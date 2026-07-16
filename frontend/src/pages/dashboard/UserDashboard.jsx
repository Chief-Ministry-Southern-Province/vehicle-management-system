import DashboardLayout from "../../layouts/DashboardLayout";

import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import VehicleRequest from "../../components/employee/VehicleRequest";
import { getMyVehicleRequests } from "../../api/authApi";
import { useLanguage } from "../../context/useLanguage";
import { useAuth } from "../../context/useAuth";

function StatCard({ title, value, icon, tone }) {
  const tones = {
    amber: { icon: "bg-amber-50 text-amber-600 ring-amber-100", glow: "bg-amber-400/10", accent: "from-amber-400 to-orange-500" },
    emerald: { icon: "bg-emerald-50 text-emerald-600 ring-emerald-100", glow: "bg-emerald-400/10", accent: "from-emerald-400 to-teal-500" },
    rose: { icon: "bg-rose-50 text-rose-600 ring-rose-100", glow: "bg-rose-400/10", accent: "from-rose-400 to-red-500" },
  };
  const palette = tones[tone];

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(15,23,42,0.3)]">
      <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl ${palette.glow}`} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-900">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ring-1 ring-inset transition-transform duration-300 group-hover:scale-110 ${palette.icon}`}>
          {icon}
        </div>
      </div>
      <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${palette.accent}`} />
    </article>
  );
}

export default function UserDashboard() {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
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
              (request) => !["approved", "rejected"].includes(request.status),
            ).length,
            approved: requests.filter((request) => request.status === "approved").length,
            rejected: requests.filter((request) => request.status === "rejected").length,
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
              {translate("Welcome back, {name}!").replace("{name}", user?.name || "User")}
            </h1>

            <p className="text-gray-500 mt-1">
              {translate("Here is what's happening with your transport requests today.")}
            </p>
          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard
            title={translate("Pending Requests")}
            value={statValue(stats.pending)}
            icon={<FiClock />}
            tone="amber"
          />

          <StatCard
            title={translate("Approved")}
            value={statValue(stats.approved)}
            icon={<FiCheckCircle />}
            tone="emerald"
          />

          <StatCard
            title={translate("Rejected")}
            value={statValue(stats.rejected)}
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
