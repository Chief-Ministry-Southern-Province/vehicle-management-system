import { useEffect, useState } from "react";
import { FiNavigation, FiClock, FiCheckCircle } from "react-icons/fi";
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
    { title: "Total Trips", value: data.total_trips, icon: <FiNavigation />, badge: "All assigned", color: "text-blue-600" },
    { title: "Today's Trips", value: data.today_trips, icon: <FiNavigation />, badge: "Today", color: "text-blue-600" },
    { title: "Scheduled Trips", value: data.scheduled_trips, icon: <FiClock />, badge: "Upcoming", color: "text-blue-600" },
    { title: "Completed", value: data.completed_trips, icon: <FiCheckCircle />, badge: `${data.completion_rate}%`, color: "text-green-600" },
  ];

  return (
    <div>
      {error && <p className="mb-3 text-sm text-red-600" role="alert">{error}</p>}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((item) => (
          <div key={item.title} className="rounded-2xl border bg-white p-5">
            <div className="mb-4 flex justify-between">
              <div className={item.color}>{item.icon}</div>

              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">
                {item.badge}
              </span>
            </div>

            <p className="text-sm text-slate-500">{item.title}</p>

            <h3 className="mt-2 text-3xl font-bold">{loading ? "..." : item.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
