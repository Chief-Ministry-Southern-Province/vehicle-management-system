import {
  FiDroplet,
  FiDollarSign,
  FiTrendingUp,
  FiTruck,
  FiArrowUp,
} from "react-icons/fi";

const stats = [
  {
    title: "Fuel Consumed",
    value: "1,452 L",
    icon: <FiDroplet size={20} />,
    bg: "bg-blue-50",
    color: "text-blue-600",
    change: "+8.4%",
  },
  {
    title: "Fuel Spend",
    value: "$1,816",
    icon: <FiDollarSign size={20} />,
    bg: "bg-green-50",
    color: "text-green-600",
    change: "-4.2%",
  },
  {
    title: "Efficiency",
    value: "12.8 km/L",
    icon: <FiTrendingUp size={20} />,
    bg: "bg-purple-50",
    color: "text-purple-600",
    change: "+2.1%",
  },
  {
    title: "Refueled",
    value: "28",
    icon: <FiTruck size={20} />,
    bg: "bg-orange-50",
    color: "text-orange-600",
    change: "+5",
  },
];

export default function FuelStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          {/* Background Glow */}
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-100 opacity-50 blur-2xl" />

          <div className="relative flex items-start justify-between">
            {/* Content */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {item.title}
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {item.value}
              </h2>

              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                    item.change.startsWith("-")
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  <FiArrowUp
                    size={11}
                    className={item.change.startsWith("-") ? "rotate-180" : ""}
                  />
                  {item.change}
                </span>

                <span className="text-xs text-slate-400">vs last month</span>
              </div>
            </div>

            {/* Icon */}
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg} ${item.color} shadow-sm transition-transform duration-300 group-hover:scale-110`}
            >
              {item.icon}
            </div>
          </div>

          {/* Bottom Accent */}
          <div
            className={`mt-5 h-1 rounded-full ${
              item.color === "text-blue-600"
                ? "bg-blue-500"
                : item.color === "text-green-600"
                  ? "bg-green-500"
                  : item.color === "text-purple-600"
                    ? "bg-purple-500"
                    : "bg-orange-500"
            }`}
          />
        </div>
      ))}
    </div>
  );
}
