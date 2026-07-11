import {
  FiTruck,
  FiDroplet,
  FiTool,
  FiAlertTriangle,
} from "react-icons/fi";

const stats = [
  {
    title: "Total Vehicle",
    value: "35",
    subtitle: "Total vehicles in fleet",
    icon: <FiTruck size={18} />,
    bg: "from-cyan-500 to-blue-600",
    trend: "+2.8%",
  },
  {
    title: "Available Now",
    value: "28",
    subtitle: "Ready for allocation",
    icon: <FiTruck size={18} />,
    bg: "from-cyan-500 to-blue-600",
    trend: "+2.8%",
  },
  {
    title: "Unavailable Now",
    value: "05",
    subtitle: "Currently in use",
    icon: <FiTruck size={18} />,
    bg: "from-cyan-500 to-blue-600",
    trend: "+2.8%",
  },
  {
    title: "Maintenance Due",
    value: "02",
    subtitle: "Scheduled maintenance",
    icon: <FiTruck size={18} />,
    bg: "from-cyan-500 to-blue-600",
    trend: "+2.8%",
  },
  {
    title: "Fuel Cost",
    value: "$12.4k",
    subtitle: "Fuel expenses",
    icon: <FiDroplet size={18} />,
    bg: "from-sky-500 to-cyan-600",
    trend: "-1.4%",
  },
  {
    title: "Service Costs",
    value: "$8.2k",
    subtitle: "Maintenance spending",
    icon: <FiTool size={18} />,
    bg: "from-indigo-500 to-violet-600",
    trend: "+3.1%",
  },
  {
    title: "Repair Expense",
    value: "$4.1k",
    subtitle: "Damage repairs",
    icon: <FiAlertTriangle size={18} />,
    bg: "from-red-500 to-rose-600",
    trend: "+6.5%",
  },
];

export default function FleetStats() {
  return (
    <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="
            relative
            overflow-hidden
            rounded-2xl
            border border-slate-200
            bg-white
            p-4
            shadow-sm
            hover:shadow-lg
            hover:-translate-y-1
            transition-all
            duration-300
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div
              className={`
                w-10 h-10
                rounded-xl
                bg-linear-to-r
                ${item.bg}
                text-white
                flex items-center justify-center
                shadow-md
              `}
            >
              {item.icon}
            </div>

            <span
              className={`text-[10px] font-semibold px-2 py-1 rounded-full ${item.trend.startsWith("+")
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
                }`}
            >
              {item.trend}
            </span>
          </div>

          {/* Content */}
          <div className="mt-3">
            <p className="text-xs font-medium text-slate-500">
              {item.title}
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              {item.value}
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              {item.subtitle}
            </p>
          </div>

          {/* Bottom Accent */}
          <div
            className={`
              absolute bottom-0 left-0
              w-full h-1
              bg-linear-to-r
              ${item.bg}
            `}
          />
        </div>
      ))}
    </div>
  );
}