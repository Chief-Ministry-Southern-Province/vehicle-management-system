import DashboardLayout from "../../layouts/DashboardLayout";
import { FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useEffect, useState } from "react";
import VehicleRequest from "../../components/employee/VehicleRequest";
import { getMyVehicleRequests } from "../../api/authApi";
import { useLanguage } from "../../context/useLanguage";
import { useAuth } from "../../context/useAuth";
function StatCard({ title, value, description, icon, tone }) {
  const tones = {
    amber: {
      icon: "from-amber-400 to-orange-500 shadow-amber-500/25",
      accent: "from-amber-400 to-orange-500",
    },
    emerald: {
      icon: "from-emerald-500 to-teal-500 shadow-emerald-500/25",
      accent: "from-emerald-400 to-teal-500",
    },
    rose: {
      icon: "from-rose-500 to-red-600 shadow-rose-500/25",
      accent: "from-rose-400 to-red-500",
    },
  };
  const palette = tones[tone];

  return (
    <article className="group relative min-h-52 overflow-hidden rounded-[20px] border border-slate-200 bg-white px-6 pb-6 pt-6 shadow-[0_2px_7px_rgba(15,23,42,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-12px_rgba(15,23,42,0.28)] dark:border-slate-700 dark:bg-slate-900">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br text-xl text-white shadow-lg transition-transform duration-300 group-hover:scale-105 ${palette.icon}`}
      >
        {icon}
      </div>

      <p className="mt-5 text-sm font-semibold uppercase tracking-[0.02em] text-slate-600 dark:text-slate-300">
        {title}
      </p>
      <p className="mt-1.5 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
        {description}
      </p>

      <div
        className={`absolute inset-x-0 bottom-0 h-1 bg-linear-to-r ${palette.accent}`}
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {translate("Welcome back, {name}!").replace(
                "{name}",
                user?.name || "User",
              )}
            </h1>

            <p className="text-gray-500 mt-1">
              {translate(
                "Here is what's happening with your transport requests today.",
              )}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
