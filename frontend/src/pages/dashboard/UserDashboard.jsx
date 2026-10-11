import DashboardLayout from "../../layouts/DashboardLayout";
import { FiCalendar } from "react-icons/fi";
import VehicleRequest from "../../components/employee/VehicleRequest";
import { useLanguage } from "../../context/useLanguage";
import { useAuth } from "../../context/useAuth";
export default function UserDashboard() {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const today = new Intl.DateTimeFormat("en-LK", { weekday: "short", month: "short", day: "numeric", year: "numeric" }).format(new Date());
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1600px] space-y-5 sm:space-y-7">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-blue-600 sm:text-xs"><span>Good day</span><i className="h-0.5 w-9 rounded-full bg-blue-500" /></p>
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              {translate("Welcome back, {name}!").replace(
                "{name}",
                user?.name || "User",
              )}
            </h1>

            <p className="mt-1 text-sm leading-5 text-slate-500 sm:text-base">
              {translate(
                "Here is what's happening with your transport requests today.",
              )}
            </p>
          </div>
          <div className="flex items-center gap-3 self-start rounded-2xl border border-blue-100 bg-white/80 px-4 py-3 shadow-[0_12px_28px_-22px_rgba(15,23,42,0.35)] backdrop-blur-sm md:self-auto">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600"><FiCalendar aria-hidden="true" /></span>
            <span><span className="block text-xs font-medium text-slate-400">Today</span><span className="block text-sm font-bold text-slate-700">{today}</span></span>
          </div>
        </div>
        <div>
          <VehicleRequest />
        </div>
      </div>
    </DashboardLayout>
  );
}
