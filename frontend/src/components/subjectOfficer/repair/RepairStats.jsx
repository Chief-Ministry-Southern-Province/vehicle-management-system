import {
  FiAlertTriangle,
  FiDollarSign,
  FiClock,
  FiTrendingUp,
} from "react-icons/fi";

const stats = [
  {
    title: "Critical Issues",
    value: "12",
    subtitle: "Active Repairs",
    icon: <FiAlertTriangle size={18} />,
    color: "text-red-600",
    bg: "bg-red-50",
    trend: "+3",
    trendColor: "text-red-600",
  },
  {
    title: "Repair Spend",
    value: "$4,852",
    subtitle: "Month To Date",
    icon: <FiDollarSign size={18} />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    trend: "+12%",
    trendColor: "text-blue-600",
  },
  {
    title: "Return Time",
    value: "2.4",
    subtitle: "Average Days",
    icon: <FiClock size={18} />,
    color: "text-slate-600",
    bg: "bg-slate-100",
    trend: "-0.6",
    trendColor: "text-green-600",
  },
];

export default function RepairStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((item) => (
        <div
          key={item.title}
          className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          {/* Background Glow */}
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-100 opacity-60 blur-2xl" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {item.title}
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {item.value}
              </h2>

              <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>

              <div className="mt-4 flex items-center gap-2">
                <FiTrendingUp size={13} className={item.trendColor} />

                <span className={`text-sm font-medium ${item.trendColor}`}>
                  {item.trend}
                </span>

                <span className="text-xs text-slate-400">this month</span>
              </div>
            </div>

            {/* Icon */}
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg} ${item.color} transition-transform duration-300 group-hover:scale-110`}
            >
              {item.icon}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-5">
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${
                  item.color === "text-red-600"
                    ? "bg-red-500 w-[80%]"
                    : item.color === "text-blue-600"
                      ? "bg-blue-500 w-[65%]"
                      : "bg-slate-500 w-[45%]"
                }`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
