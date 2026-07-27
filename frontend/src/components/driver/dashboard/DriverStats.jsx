import { useEffect, useState } from "react";
import { FiCheckCircle, FiClock, FiNavigation, FiTrendingUp } from "react-icons/fi";
import { getDriverDashboardStats } from "../../../api/authApi";

const emptyStats = {
  total_trips: 0,
  today_trips: 0,
  scheduled_trips: 0,
  completed_trips: 0,
  completion_rate: 0,
};

export default function DriverStats() {
  const [data, setData] = useState(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getDriverDashboardStats()
      .then((response) => {
        if (active) setData({ ...emptyStats, ...response?.data?.stats });
      })
      .catch((requestError) => {
        if (active) setError(requestError?.message || "Unable to load trip statistics.");
      })
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, []);

  const stats = [
    {
      title: "Total Trips",
      value: data.total_trips,
      icon: <FiNavigation />,
      badge: "All assigned",
      tone: "from-blue-500 to-blue-600",
      glow: "bg-blue-500/10",
      badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200",
    },
    {
      title: "Today's Trips",
      value: data.today_trips,
      icon: <FiTrendingUp />,
      badge: "Today",
      tone: "from-cyan-500 to-cyan-600",
      glow: "bg-cyan-500/10",
      badgeClass: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-200",
    },
    {
      title: "Scheduled Trips",
      value: data.scheduled_trips,
      icon: <FiClock />,
      badge: "Upcoming",
      tone: "from-amber-400 to-amber-500",
      glow: "bg-amber-500/10",
      badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
    },
    {
      title: "Completed",
      value: data.completed_trips,
      icon: <FiCheckCircle />,
      badge: `${data.completion_rate}%`,
      tone: "from-emerald-500 to-emerald-600",
      glow: "bg-emerald-500/10",
      badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
    },
  ];

  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-300">
        Trip Summary
      </h3>
      {error && (
        <p className="mb-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="group relative overflow-hidden rounded-[18px] border border-slate-100 bg-white/80 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-[0_20px_40px_-16px_rgba(15,23,42,0.18)] dark:border-slate-700 dark:bg-slate-800"
          >
            <div
              className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl ${item.glow} opacity-60 transition-opacity duration-300 group-hover:opacity-100`}
            />
            <div className="relative mb-5 flex items-start justify-between gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br text-lg text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${item.tone}`}>
                {item.icon}
              </div>

              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.badgeClass}`}>
                {item.badge}
              </span>
            </div>

            <p className="relative text-sm font-medium text-slate-500 dark:text-slate-400">{item.title}</p>

            <h3 className="relative mt-1 text-[26px] font-bold leading-tight text-slate-800 tabular-nums dark:text-white">
              {loading ? "..." : item.value}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
