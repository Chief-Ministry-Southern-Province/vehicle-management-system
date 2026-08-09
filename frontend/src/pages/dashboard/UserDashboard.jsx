import DashboardLayout from "../../layouts/DashboardLayout";
import { FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useEffect, useState } from "react";
import VehicleRequest from "../../components/employee/VehicleRequest";
import { getMyVehicleRequests } from "../../api/authApi";
import { useLanguage } from "../../context/useLanguage";
import { useAuth } from "../../context/useAuth";
function StatCard({ title, value, description, icon, tone, wide = false }) {
  const tones = {
    amber: {
      icon: "from-amber-400 to-orange-500 shadow-amber-500/25",
      accent: "from-amber-400 to-orange-500",
      surface: "sm:from-amber-50/80 sm:via-white sm:to-white dark:sm:from-amber-950/20 dark:sm:via-slate-900 dark:sm:to-slate-900",
      ring: "sm:hover:border-amber-200 dark:sm:hover:border-amber-800/60",
    },
    emerald: {
      icon: "from-emerald-500 to-teal-500 shadow-emerald-500/25",
      accent: "from-emerald-400 to-teal-500",
      surface: "sm:from-emerald-50/80 sm:via-white sm:to-white dark:sm:from-emerald-950/20 dark:sm:via-slate-900 dark:sm:to-slate-900",
      ring: "sm:hover:border-emerald-200 dark:sm:hover:border-emerald-800/60",
    },
    rose: {
      icon: "from-rose-500 to-red-600 shadow-rose-500/25",
      accent: "from-rose-400 to-red-500",
      surface: "sm:from-rose-50/80 sm:via-white sm:to-white dark:sm:from-rose-950/20 dark:sm:via-slate-900 dark:sm:to-slate-900",
      ring: "sm:hover:border-rose-200 dark:sm:hover:border-rose-800/60",
    },
  };
  const palette = tones[tone];

  return (
    <article className={`group relative min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white bg-linear-to-br p-3 shadow-[0_2px_7px_rgba(15,23,42,0.08)] transition-all duration-300 dark:border-slate-700 dark:bg-slate-900 sm:min-h-40 sm:rounded-[20px] sm:p-5 sm:shadow-[0_8px_30px_-22px_rgba(15,23,42,0.35)] sm:hover:-translate-y-1 sm:hover:shadow-[0_18px_38px_-20px_rgba(15,23,42,0.35)] ${palette.surface} ${palette.ring} ${wide ? "col-span-2 md:col-span-1" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-sm text-white shadow-lg transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14 sm:rounded-2xl sm:text-xl ${palette.icon}`}
        >
          {icon}
        </div>
        <p className="min-w-0 text-right text-2xl font-extrabold leading-none tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          {value}
        </p>
      </div>

      <p className="mt-3 text-[10px] font-bold uppercase leading-4 tracking-wide text-slate-600 dark:text-slate-300 sm:mt-4 sm:text-xs sm:tracking-[0.08em]">
        {title}
      </p>
      <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-slate-400 dark:text-slate-500 sm:mt-1.5 sm:text-sm">
        {description}
      </p>

      <div
        className={`absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r sm:h-1 ${palette.accent}`}
      />
    </article>
  );
}
export default function UserDashboard() {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");
  useEffect(() => {
    let isMounted = true;
    const loadStats = async () => {
      try {
        const response = await getMyVehicleRequests();
        const requests = response?.data?.requests || [];
        if (isMounted) {
          setStats({
            pending: requests.filter(
              (request) =>
                !["approved", "completed", "rejected", "cancelled"].includes(
                  request.status,
                ),
            ).length,
            approved: requests.filter(
              (request) =>
                ["approved", "completed"].includes(request.status),
            ).length,
            rejected: requests.filter(
              (request) => request.status === "rejected",
            ).length,
          });
        }
      } catch (error) {
        if (isMounted) {
          setStatsError(error?.message || "Unable to load request statistics.");
        }
      } finally {
        if (isMounted) {
          setStatsLoading(false);
        }
      }
    };
    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);
  const statValue = (value) => (statsLoading ? "\u2014" : value);
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1600px] space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-3xl">
              {translate("Welcome back, {name}!").replace(
                "{name}",
                user?.name || "User",
              )}
            </h1>

            <p className="mt-1 text-sm leading-5 text-gray-500 sm:text-base">
              {translate(
                "Here is what's happening with your transport requests today.",
              )}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 md:gap-5">
          <StatCard
            title={translate("Pending Requests")}
            value={statValue(stats.pending)}
            description={translate("Awaiting review and approval")}
            icon={<FiClock />}
            tone="amber"
          />

          <StatCard
            title={translate("Approved")}
            value={statValue(stats.approved)}
            description={translate("Requests approved for travel")}
            icon={<FiCheckCircle />}
            tone="emerald"
          />

          <StatCard
            title={translate("Rejected")}
            value={statValue(stats.rejected)}
            description={translate("Requests not approved")}
            icon={<FiXCircle />}
            tone="rose"
            wide
          />
        </div>
        {statsError && (
          <p role="alert" className="text-sm text-rose-600">
            {statsError}
          </p>
        )}
        <div>
          <VehicleRequest />
        </div>
      </div>
    </DashboardLayout>
  );
}
