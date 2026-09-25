import { useCallback, useEffect, useRef, useState } from "react";
import { FiBell, FiCheck, FiChevronDown, FiGlobe, FiMenu, FiSettings, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useLanguage } from "../../context/useLanguage";
import { getNotifications, getProfile, markAllNotificationsRead, markNotificationRead } from "../../api/authApi";
import nationalEmblem from "../../assets/national-emblem.png";
import topbarBackdrop from "../../assets/side-bar-5.png";
import { enablePushNotifications, supportsPushNotifications } from "../../utils/pushNotifications";

const initials = (name) =>
  String(name || "User")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const notificationPopupStorageKey = (userId) => `vms-notification-popups:${userId}`;

const initialPushStatus = () => {
  if (!supportsPushNotifications()) return "unsupported";
  if (Notification.permission === "denied") return "denied";

  return Notification.permission === "granted" ? "checking" : "prompt";
};

const readShownNotificationIds = (userId) => {
  if (!userId) return new Set();

  try {
    const notificationIds = JSON.parse(sessionStorage.getItem(notificationPopupStorageKey(userId)) || "[]");
    return new Set(Array.isArray(notificationIds) ? notificationIds : []);
  } catch {
    return new Set();
  }
};

const saveShownNotificationIds = (userId, notificationIds) => {
  if (!userId) return;

  try {
    sessionStorage.setItem(
      notificationPopupStorageKey(userId),
      JSON.stringify([...notificationIds].slice(-100)),
    );
  } catch {
    // Notification pop-ups still work when session storage is unavailable.
  }
};

const countUnreadNotificationsByTitle = (notifications) =>
  notifications.reduce((counts, notification) => {
    if (notification.read_at || !notification.data?.title) return counts;

    counts[notification.data.title] = (counts[notification.data.title] || 0) + 1;
    return counts;
  }, {});

const publishNotificationUpdate = (notifications, unreadByTitle) => {
  window.dispatchEvent(
    new CustomEvent("vms:notifications-updated", {
      detail: { notifications, unreadByTitle },
    }),
  );
};

const notificationDestination = (role, title) => {
  const workflowDestinations = {
    "New vehicle request": {
      department_officer: "/departmentrequesthistory",
      deputy_secretary: "/deputy/pending-recommendations",
      senior_deputy_secretary: "/senior-deputy/pending-recommendations",
    },
    "Vehicle allocation required": { deputy_secretary: "/pendingapprovals" },
    "Final approval required": {
      senior_deputy_secretary: "/pendingfinalapprovals",
      secretary: "/pendingfinalapprovals",
    },
    "Vehicle issue reported": {
      subject_officer: "/ontimeavailability",
      deputy_secretary: "/ontimeavailability",
    },
  };

  const roleHome = {
    employee: "/requesthistory",
    department_officer: "/departmentrequesthistory",
    subject_officer: "/subjectofficer/requesthistory",
    deputy_secretary: "/requesthistory",
    senior_deputy_secretary: "/finalapprovals",
    secretary: "/finalapprovals",
    driver: "/driverdashboard",
    system_admin: "/usermanagement",
  };

  return workflowDestinations[title]?.[role] || roleHome[role] || "/";
};

const showNotificationPopup = (notification) => {
  const title = notification.data?.title || "New notification";
  const message = notification.data?.message || "You have a new workflow update.";

  toast.custom(
    (toastItem) => (
      <div
        data-no-translate
        className={`pointer-events-auto flex w-[min(24rem,calc(100vw-2rem))] gap-3 rounded-xl border border-blue-100 bg-white p-4 shadow-lg shadow-slate-900/15 transition dark:border-blue-400/20 dark:bg-slate-900 ${toastItem.visible ? "animate-enter" : "animate-leave"}`}
        role="status"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
          <FiBell aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-slate-900 dark:text-white">{title}</span>
          <span className="mt-1 block text-sm leading-5 text-slate-600 dark:text-slate-300">{message}</span>
        </span>
        <button
          type="button"
          onClick={() => toast.dismiss(toastItem.id)}
          className="shrink-0 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
          aria-label="Dismiss notification"
        >
          Dismiss
        </button>
      </div>
    ),
    { id: `workflow-notification-${notification.id}`, duration: 8000 },
  );
};

export default function Topbar({ onMenuToggle, onSettingsOpen }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id || user?.employee_id;
  const { language, languages, setLanguage, t } = useLanguage();
  const apiOrigin =
    import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
    "http://127.0.0.1:8000";
  const [profilePicturePath, setProfilePicturePath] = useState(user?.profile_picture_path || null);
  const profilePictureUrl = profilePicturePath
    ? `${apiOrigin}/${String(profilePicturePath).replace(/^\/+/, "")}`
    : null;
  const roleLabel = user?.role
    ? t(`role.${user.role}`, user.role.replaceAll("_", " "))
    : t("user.government");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadByTitle, setUnreadByTitle] = useState({});
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [pushStatus, setPushStatus] = useState(initialPushStatus);
  const notificationMenuRef = useRef(null);
  const shownNotificationIdsRef = useRef(new Set());

  useEffect(() => {
    let active = true;
    const initialPicturePath = user?.profile_picture_path || null;
    const initialLoad = window.setTimeout(() => {
      if (active) setProfilePicturePath(initialPicturePath);
    }, 0);

    if (!userId) return () => {
      active = false;
      window.clearTimeout(initialLoad);
    };

    getProfile()
      .then((response) => {
        const latestPicturePath = response?.data?.user?.profile_picture_path || null;
        if (active) setProfilePicturePath(latestPicturePath);
      })
      .catch(() => {
        // The cached session image remains available if the profile refresh fails.
      });

    return () => {
      active = false;
      window.clearTimeout(initialLoad);
    };
  }, [userId, user?.profile_picture_path]);

  const loadNotifications = useCallback(async () => {
    setLoadingNotifications(true);
    try {
      const response = await getNotifications();
      const nextNotifications = response.data?.notifications || [];
      const newUnreadNotifications = [...nextNotifications]
        .filter((notification) => !notification.read_at && !shownNotificationIdsRef.current.has(notification.id))
        .reverse();

      newUnreadNotifications.forEach((notification) => {
        shownNotificationIdsRef.current.add(notification.id);
        showNotificationPopup(notification);
      });
      saveShownNotificationIds(userId, shownNotificationIdsRef.current);

      setNotifications(nextNotifications);
      setUnreadCount(response.data?.unread_count || 0);
      const nextUnreadByTitle =
        response.data?.unread_by_title || countUnreadNotificationsByTitle(nextNotifications);
      setUnreadByTitle(nextUnreadByTitle);
      publishNotificationUpdate(nextNotifications, nextUnreadByTitle);
    } catch {
      // The bell remains available if a transient request fails; it will retry on the next open.
    } finally {
      setLoadingNotifications(false);
    }
  }, [userId]);

  useEffect(() => {
    shownNotificationIdsRef.current = readShownNotificationIds(userId);
    const initialLoad = window.setTimeout(loadNotifications, 0);

    return () => window.clearTimeout(initialLoad);
  }, [loadNotifications, userId]);
  useEffect(() => {
    const refreshOnPush = (event) => {
      if (event.data?.type === "VMS_PUSH_NOTIFICATION") loadNotifications();
    };

    navigator.serviceWorker?.addEventListener("message", refreshOnPush);
    return () => navigator.serviceWorker?.removeEventListener("message", refreshOnPush);
  }, [loadNotifications]);
  useEffect(() => {
    // Reverb events intentionally contain only an invalidation. Reload the
    // recipient's authorized, durable notification list so the bell, badges,
    // and in-app pop-up update immediately without a browser refresh.
    const refreshOnWorkflowUpdate = () => {
      loadNotifications();
    };

    window.addEventListener("vms:workflow-updated", refreshOnWorkflowUpdate);
    return () => window.removeEventListener("vms:workflow-updated", refreshOnWorkflowUpdate);
  }, [loadNotifications]);
  useEffect(() => {
    let active = true;

    if (!supportsPushNotifications() || Notification.permission !== "granted") return undefined;

    enablePushNotifications()
      .then((status) => active && setPushStatus(status))
      .catch(() => active && setPushStatus("error"));

    return () => { active = false; };
  }, [userId]);
  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!notificationMenuRef.current?.contains(event.target)) setNotificationsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const toggleNotifications = () => {
    setNotificationsOpen((isOpen) => !isOpen);
    if (!notificationsOpen) loadNotifications();
  };
  const markRead = async (notification) => {
    if (notification.read_at) return true;
    try {
      await markNotificationRead(notification.id);
      const remainingNotifications = notifications.filter((item) => item.id !== notification.id);
      const nextUnreadByTitle = { ...unreadByTitle };
      const notificationTitle = notification.data?.title;
      if (notificationTitle && nextUnreadByTitle[notificationTitle]) {
        nextUnreadByTitle[notificationTitle] -= 1;
        if (nextUnreadByTitle[notificationTitle] === 0) delete nextUnreadByTitle[notificationTitle];
      }
      setNotifications(remainingNotifications);
      setUnreadCount((count) => Math.max(0, count - 1));
      setUnreadByTitle(nextUnreadByTitle);
      publishNotificationUpdate(remainingNotifications, nextUnreadByTitle);
      return true;
    } catch {
      return false;
    }
  };
  const markAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications([]);
      setUnreadCount(0);
      setUnreadByTitle({});
      publishNotificationUpdate([], {});
    } catch { /* Keep the unread state when the API update fails. */ }
  };
  const openNotification = async (notification) => {
    setNotificationsOpen(false);
    await markRead(notification);
    navigate(notificationDestination(user?.role, notification.data?.title));
  };
  const enableDeviceAlerts = async () => {
    setPushStatus("enabling");
    try {
      const status = await enablePushNotifications({ requestPermission: true });
      setPushStatus(status);
      if (status === "enabled") toast.success(t("notifications.deviceAlertsEnabled", "Device alerts enabled"));
    } catch (error) {
      setPushStatus("error");
      toast.error(error?.message || t("notifications.deviceAlertsError", "Unable to enable device alerts."));
    }
  };

  return (
    <header
      data-no-translate
      className="relative z-40 w-full shrink-0 overflow-visible border-b border-slate-200/70 bg-white/90 shadow-[0_8px_24px_-22px_rgba(15,23,42,0.5)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/90"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img src={topbarBackdrop} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center opacity-35 dark:opacity-10" />
        <div className="absolute inset-0 bg-linear-to-r from-white/75 via-white/45 to-white/75 dark:from-slate-950/90 dark:via-slate-950/70 dark:to-slate-950/90" />
        <div className="absolute -left-20 -top-24 h-52 w-52 rounded-full bg-blue-500/8 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute right-[18%] top-0 h-24 w-64 rounded-full bg-teal-400/8 blur-3xl dark:bg-teal-400/10" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-blue-500/45 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-14 w-full items-center justify-between gap-2 px-2 py-1.5 sm:min-h-15 sm:gap-3 sm:px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-4">
          <button
            type="button"
            onClick={onMenuToggle}
            className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white/90 text-xl text-slate-700 shadow-[0_6px_18px_-10px_rgba(15,23,42,0.7)] transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 active:translate-y-0 lg:hidden dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-blue-500/15 dark:hover:text-blue-300"
            aria-label="Open navigation menu"
            aria-controls="dashboard-sidebar"
          >
            <FiMenu className="transition-transform duration-200 group-hover:scale-105" />
          </button>

          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white bg-linear-to-br from-white via-slate-50 to-blue-50 p-1.5 shadow-[0_8px_22px_-12px_rgba(37,99,235,0.6)] ring-1 ring-slate-900/5 sm:h-11 sm:w-11 sm:rounded-xl sm:p-1.5 dark:border-white/10 dark:from-slate-800 dark:via-slate-900 dark:to-blue-950 dark:ring-white/10">
            <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-slate-950" />
            <img
              src={nationalEmblem}
              alt="National Emblem"
              className="h-full w-full object-contain drop-shadow-sm"
            />
          </div>

          <div className="min-w-0">
            {/* <div className="mb-0.5 hidden items-center gap-1.5 sm:flex">
              <FiShield className="text-[11px] text-blue-600 dark:text-blue-400" />
              <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                Government of Sri Lanka
              </span>
            </div> */}
            <h1 className="truncate text-sm font-extrabold tracking-tight text-slate-900 min-[390px]:text-base sm:text-xl dark:text-white">
              {t("app.name")}
            </h1>
            <p className="mt-0.5 hidden truncate text-[11px] font-medium text-slate-500 md:block dark:text-slate-400">
              <span className="text-slate-700 dark:text-slate-300">{t("app.ministry")}</span>
              <span className="mx-2 text-slate-300 dark:text-slate-700">/</span>
              {t("app.location")}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <label className="group relative hidden items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white/75 px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.75)] transition hover:border-blue-200 hover:bg-white focus-within:border-blue-400 focus-within:ring-3 focus-within:ring-blue-100/70 sm:flex dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/8 dark:focus-within:ring-blue-500/15">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
              <FiGlobe aria-hidden="true" />
            </span>
            <span className="sr-only">{t("language.label")}</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              aria-label={t("language.label")}
              className="max-w-28 cursor-pointer appearance-none bg-transparent pr-5 outline-none lg:max-w-none"
            >
              {languages.map(({ code, nativeLabel }) => (
                <option key={code} value={code}>
                  {nativeLabel}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-3 text-xs text-slate-400" />
          </label>

          <div ref={notificationMenuRef} className="static sm:relative">
            <button
              type="button"
              onClick={toggleNotifications}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200/80 bg-white/75 text-slate-700 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.75)] transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-blue-500/15 dark:hover:text-blue-300"
              aria-label={t("notifications.title", "Notifications")}
              aria-expanded={notificationsOpen}
              aria-controls="notification-panel"
            >
              <FiBell size={19} aria-hidden="true" />
              {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-rose-500 px-1 text-[10px] font-bold text-white dark:border-slate-950">{unreadCount > 9 ? "9+" : unreadCount}</span>}
            </button>

            {notificationsOpen && (
              <section id="notification-panel" className="absolute inset-x-3 top-[calc(100%+0.65rem)] z-50 flex max-h-[calc(100dvh-6rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 sm:left-auto sm:right-0 sm:w-88 dark:border-white/10 dark:bg-slate-900">
                <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-white/10">
                  <div><h2 className="font-bold text-slate-900 dark:text-white">{t("notifications.title", "Notifications")}</h2><p className="text-xs text-slate-500 dark:text-slate-400">{unreadCount ? `${unreadCount} unread` : "You're all caught up"}</p></div>
                  {unreadCount > 0 && <button type="button" onClick={markAllRead} className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-300">Mark all read</button>}
                </div>
                {pushStatus === "enabled" && <p className="border-b border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300">{t("notifications.deviceAlertsEnabled", "Device alerts enabled")}</p>}
                {(pushStatus === "prompt" || pushStatus === "error") && <button type="button" onClick={enableDeviceAlerts} className="flex w-full items-center justify-between border-b border-blue-100 bg-blue-50 px-4 py-2.5 text-left text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20"><span>{t("notifications.enableDeviceAlerts", "Enable alerts when the app is closed")}</span><FiBell aria-hidden="true" /></button>}
                {pushStatus === "enabling" && <p className="border-b border-slate-100 px-4 py-2 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">{t("notifications.enablingDeviceAlerts", "Enabling device alerts…")}</p>}
                {pushStatus === "denied" && <p className="border-b border-amber-100 bg-amber-50 px-4 py-2 text-xs text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-300">{t("notifications.deviceAlertsDenied", "Device alerts are blocked in your browser settings.")}</p>}
                {pushStatus === "unsupported" && <p className="border-b border-slate-100 px-4 py-2 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">{t("notifications.deviceAlertsUnsupported", "This browser does not support device alerts.")}</p>}
                <div className="min-h-0 max-h-96 overflow-y-auto">
                  {loadingNotifications && notifications.length === 0 ? <p className="px-4 py-6 text-center text-sm text-slate-500">Loading notifications…</p> : notifications.length === 0 ? <p className="px-4 py-8 text-center text-sm text-slate-500">No unread notifications.</p> : notifications.map((notification) => (
                    <button type="button" key={notification.id} onClick={() => openNotification(notification)} className={`flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5 ${notification.read_at ? "" : "bg-blue-50/70 dark:bg-blue-500/10"}`}>
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notification.read_at ? "bg-transparent" : "bg-blue-600"}`} />
                      <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">{notification.data?.title}</span><span className="mt-0.5 block text-xs leading-5 text-slate-600 dark:text-slate-300">{notification.data?.message}</span><span className="mt-1 block text-[11px] text-slate-400">{notification.created_at ? new Date(notification.created_at).toLocaleString() : ""}</span></span>
                      {!notification.read_at && <FiCheck className="mt-1 shrink-0 text-blue-600 dark:text-blue-300" aria-label="Mark as read" />}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/75 p-1.5 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.8)] ring-1 ring-white/70 sm:gap-3 sm:pr-3.5 dark:border-white/10 dark:bg-white/5 dark:ring-white/5">
            <div
              className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-blue-600 via-blue-500 to-teal-400 text-xs font-extrabold text-white shadow-md shadow-blue-500/20 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-300 sm:h-12 sm:w-12 sm:text-sm dark:focus-visible:ring-blue-500/50"
            >
              {user?.name ? initials(user.name) : <FiUser size={18} />}
              {profilePictureUrl && (
                <img
                  src={profilePictureUrl}
                  alt={`${user?.name || "User"} profile`}
                  className="absolute inset-0 z-10 h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              )}
              <span className="absolute -bottom-0.5 -right-0.5 z-20 h-3 w-3 rounded-full border-[2.5px] border-white bg-emerald-500 shadow-sm dark:border-slate-900" />
            </div>

            <div className="hidden min-w-0 sm:block">
              <p translate={user?.name ? "no" : undefined} className="max-w-36 truncate text-sm font-bold leading-tight text-slate-900 lg:max-w-48 dark:text-white">
                {user?.name || t("user.government")}
              </p>
              <div className="mt-1 flex items-center gap-1.5">                <p className="max-w-32 truncate text-[10px] font-bold uppercase tracking-[0.08em] text-blue-600 lg:max-w-44 dark:text-blue-400">
                  {roleLabel}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onSettingsOpen}
              aria-label={t("nav.user_settings")}
              title={t("nav.user_settings")}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200 sm:h-9 sm:w-9 dark:text-slate-300 dark:hover:bg-blue-500/15 dark:hover:text-blue-300"
            >
              <FiSettings aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
