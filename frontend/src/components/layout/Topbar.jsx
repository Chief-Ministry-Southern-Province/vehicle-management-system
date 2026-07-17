import { FiGlobe, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/useAuth";
import { useLanguage } from "../../context/useLanguage";

const initials = (name) =>
  String(name || "User")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export default function Topbar() {
  const { user } = useAuth();
  const { language, languages, setLanguage, t } = useLanguage();
  const roleLabel = user?.role
    ? t(`role.${user.role}`, user.role.replaceAll("_", " "))
    : t("user.government");

  return (
    <header
      data-no-translate
      className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl"
    >
      <div className="flex min-h-20 items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            {t("app.name")}
          </h1>
          <p className="mt-0.5 hidden truncate text-xs text-slate-500 sm:block">
            <span className="font-semibold text-blue-700">
              {t("app.ministry")}
            </span>
            <span className="mx-2 text-slate-300">&bull;</span>
            {t("app.location")}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-sm font-semibold text-slate-700 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 sm:px-3">
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
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-2 pr-3 shadow-sm">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-cyan-500 text-sm font-bold text-white shadow-md shadow-blue-200">
              {user?.name ? initials(user.name) : <FiUser size={19} />}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="max-w-44 truncate text-sm font-bold text-slate-800">
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
