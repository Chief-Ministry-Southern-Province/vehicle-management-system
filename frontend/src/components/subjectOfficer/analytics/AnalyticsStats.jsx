import {
  FiActivity,
  FiDroplet,
  FiTool,
  FiTruck,
  FiTrendingUp,
} from "react-icons/fi";

const stats = [
  {
    title: "Fleet Utilization",
    value: "72.4%",
    icon: <FiActivity size={18} />,
    bg: "bg-blue-50",
    color: "text-blue-600",
    trend: "+4.2%",
    positive: true,
  },
  {
    title: "Fuel Expense",
    value: "$12,450",
    icon: <FiDroplet size={18} />,
    bg: "bg-cyan-50",
    color: "text-cyan-600",
    trend: "-2.1%",
    positive: true,
  },
  {
    title: "Maintenance Cost",
    value: "$8,920",
    icon: <FiTool size={18} />,
    bg: "bg-orange-50",
    color: "text-orange-600",
    trend: "+12.5%",
    positive: false,
  },
  {
    title: "Active Vehicles",
    value: "42 / 48",
    icon: <FiTruck size={18} />,
    bg: "bg-green-50",
    color: "text-green-600",
    trend: "Stable",
    positive: null,
  },
];

export default function AnalyticsStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

      {stats.map((item) => (
        <div
          key={item.title}
          className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >

          {/* Decorative Glow */}
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-100 opacity-50 blur-2xl" />

          <div className="relative flex items-start justify-between">

            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg} ${item.color}`}
            >
              {item.icon}
            </div>

            {item.positive === true && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                <FiTrendingUp size={11} />
                {item.trend}
              </span>
            )}

            {item.positive === false && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                <FiTrendingUp size={11} />
                {item.trend}
              </span>
            )}

            {item.positive === null && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {item.trend}
              </span>
            )}

          </div>

          <div className="relative mt-5">

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {item.title}
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {item.value}
            </h2>

          </div>

          {/* Bottom Accent */}
          <div
            className={`mt-5 h-1 rounded-full ${
              item.color === "text-blue-600"
                ? "bg-blue-500"
                : item.color === "text-cyan-600"
                ? "bg-cyan-500"
                : item.color === "text-orange-600"
                ? "bg-orange-500"
                : "bg-green-500"
            }`}
          />

        </div>
      ))}

    </div>
  );
}