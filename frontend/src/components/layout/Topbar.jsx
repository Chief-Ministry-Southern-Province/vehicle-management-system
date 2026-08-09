import { FiGlobe, FiMenu, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/useAuth";
import { useLanguage } from "../../context/useLanguage";
import nationalEmblem from "../../assets/national-emblem.png";

const initials = (name) =>
  String(name || "User")
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
      className="relative z-40 w-full shrink-0 overflow-hidden border-b border-slate-200/80 bg-white/9 5 shadow-[0_8px_30px_-24px_rgba(15,23,42,0.75)] backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-teal-400/60 to-transparent" />
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onMenuToggle}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-xl text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            aria-label="Open navigation menu"
            aria-controls="dashboard-sidebar"
          >
            <FiMenu />
          </button>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-linear-to-br from-white to-slate-50 p-1.5 shadow-sm ring-1 ring-slate-900/5 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
            <img
              src={nationalEmblem}
              alt="National Emblem"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-xl">
              {t("app.name")}
            </h1>
            <p className="mt-0.5 hidden truncate text-xs text-slate-500 dark:text-slate-400 sm:block">
              <span className="font-semibold text-blue-700 dark:text-blue-400">
                {t("app.ministry")}
              </span>
              <span className="mx-2 text-slate-300">&bull;</span>
              {t("app.location")}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <label className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-sm font-semibold text-slate-700 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 sm:flex sm:px-3">
            <FiGlobe className="shrink-0 text-blue-600" aria-hidden="true" />
            <span className="sr-only">{t("language.label")}</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              aria-label={t("language.label")}
              className="max-w-24 cursor-pointer bg-transparent outline-none sm:max-w-none"
            >
              {languages.map(({ code, nativeLabel }) => (
                <option key={code} value={code}>
                  {nativeLabel}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-1 px-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="relative flex h-11 w-11 items-center justify-center overflow-visible rounded-xl bg-linear-to-br from-blue-600 to-cyan-500 text-sm font-bold text-white shadow-md shadow-blue-200">
              {user?.name ? initials(user.name) : <FiUser size={19} />}
              {profilePictureUrl && (
                <img
                  src={profilePictureUrl}
                  alt={`${user?.name || "User"} profile`}
                  className="absolute inset-0 h-full w-full rounded-xl object-cover"
                  onError={(event) => { event.currentTarget.style.display = "none"; }}
                />
              )}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="max-w-44 truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                {user?.name || t("user.government")}
              </p>
              <p className="mt-0.5 max-w-44 truncate text-xs font-medium text-blue-600">
                {roleLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
