import { FiChevronDown, FiGlobe, FiMenu, FiShield, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/useAuth";
import { useLanguage } from "../../context/useLanguage";
import nationalEmblem from "../../assets/national-emblem.png";

const initials = (name) =>
  String(name || "User")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export default function Topbar({ onMenuToggle }) {
  const { user } = useAuth();
  const { language, languages, setLanguage, t } = useLanguage();
  const apiOrigin =
    import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
    "http://127.0.0.1:8000";
  const profilePictureUrl = user?.profile_picture_path
    ? `${apiOrigin}/${String(user.profile_picture_path).replace(/^\/+/, "")}`
    : null;
  const roleLabel = user?.role
    ? t(`role.${user.role}`, user.role.replaceAll("_", " "))
    : t("user.government");

  return (
    <header
      data-no-translate
      className="relative z-40 w-full shrink-0 border-b border-slate-200/70 bg-white/90 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.7)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/90"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-24 h-52 w-52 rounded-full bg-blue-500/8 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute right-[18%] top-0 h-24 w-64 rounded-full bg-teal-400/8 blur-3xl dark:bg-teal-400/10" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-blue-500/45 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-17 w-full items-center justify-between gap-2 px-3 py-2.5 sm:min-h-20 sm:gap-4 sm:px-6 lg:px-8">
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

          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white bg-linear-to-br from-white via-slate-50 to-blue-50 p-1.5 shadow-[0_8px_22px_-12px_rgba(37,99,235,0.6)] ring-1 ring-slate-900/5 sm:h-13 sm:w-13 sm:rounded-2xl sm:p-2 dark:border-white/10 dark:from-slate-800 dark:via-slate-900 dark:to-blue-950 dark:ring-white/10">
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

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/75 p-1.5 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.8)] ring-1 ring-white/70 sm:gap-3 sm:pr-3.5 dark:border-white/10 dark:bg-white/5 dark:ring-white/5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 via-blue-500 to-teal-400 text-xs font-extrabold text-white shadow-md shadow-blue-500/20 sm:h-11 sm:w-11 sm:text-sm">
              {user?.name ? initials(user.name) : <FiUser size={18} />}
              {profilePictureUrl && (
                <img
                  src={profilePictureUrl}
                  alt={`${user?.name || "User"} profile`}
                  className="absolute inset-0 h-full w-full rounded-xl object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              )}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-[2.5px] border-white bg-emerald-500 shadow-sm dark:border-slate-900" />
            </div>

            <div className="hidden min-w-0 sm:block">
              <p className="max-w-36 truncate text-sm font-bold leading-tight text-slate-900 lg:max-w-48 dark:text-white">
                {user?.name || t("user.government")}
              </p>
              <div className="mt-1 flex items-center gap-1.5">                <p className="max-w-32 truncate text-[10px] font-bold uppercase tracking-[0.08em] text-blue-600 lg:max-w-44 dark:text-blue-400">
                  {roleLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
