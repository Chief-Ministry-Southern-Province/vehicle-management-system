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
      iconClass: "bg-blue-600",
      accentClass: "bg-blue-600",
    },
    {
      title: "Today's Trips",
      value: data.today_trips,
      icon: <FiTrendingUp />,
      iconClass: "bg-cyan-500",
      accentClass: "bg-cyan-500",
    },
    {
      title: "Scheduled Trips",
      value: data.scheduled_trips,
      icon: <FiClock />,
      iconClass: "bg-amber-500",
      accentClass: "bg-amber-500",
    },
    {
      title: "Completed Trips",
      value: data.completed_trips,
      icon: <FiCheckCircle />,
      iconClass: "bg-emerald-500",
      accentClass: "bg-emerald-500",
    },
  ];

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <h3 className="shrink-0 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 sm:text-xs">
          Trip Summary
        </h3>
        <div className="h-px flex-1 bg-linear-to-r from-slate-300/90 to-transparent dark:from-slate-700" />
      </div>
      {error && (
        <p className="mb-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <article
            key={item.title}
            className="group relative min-h-[152px] min-w-0 overflow-hidden rounded-[24px] border border-slate-200/90 bg-white px-6 py-7 shadow-[0_10px_24px_-19px_rgba(15,23,42,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_32px_-22px_rgba(15,23,42,0.55)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
          >
            <div className="flex min-w-0 items-start justify-between gap-4">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] text-xl text-white shadow-[0_8px_16px_-8px_rgba(15,23,42,0.7)] transition-transform duration-200 group-hover:scale-105 ${item.iconClass}`}>
                {item.icon}
              </span>
              <strong className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 tabular-nums dark:text-white">
                {loading ? "..." : item.value}
              </strong>
            </div>
            <p className="mt-6 text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-300">
              {item.title}
            </p>
            <span className={`absolute inset-x-0 bottom-0 h-[3px] ${item.accentClass}`} />
          </article>
        ))}
      </div>
    </section>
  );
}
