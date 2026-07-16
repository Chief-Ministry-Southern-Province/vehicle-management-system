import { FiUser } from "react-icons/fi";
import { useAuth } from "../../context/useAuth";

const formatRole = (role) => role ? role.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : "Government User";
const initials = (name) => String(name || "User").split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">Vehicle Management System</h1>
            <p className="mt-0.5 hidden truncate text-xs text-slate-500 sm:block"><span className="font-semibold text-blue-700">Chief Ministry</span><span className="mx-2 text-slate-300">•</span>Dakshinapaya, Labuduwa, Galle</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-2 pr-3 shadow-sm">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-cyan-500 text-sm font-bold text-white shadow-md shadow-blue-200">{user?.name ? initials(user.name) : <FiUser size={19} />}<span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" /></div>
          <div className="hidden min-w-0 sm:block">
            <p className="max-w-44 truncate text-sm font-bold text-slate-800">{user?.name || "Government User"}</p>
            <p className="mt-0.5 max-w-44 truncate text-xs font-medium text-blue-600">{formatRole(user?.role)}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
