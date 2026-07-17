import {
  FiCheckSquare,
  FiTruck,
  FiMap,
  FiClock,
  FiArrowUpRight,
} from "react-icons/fi";

export default function QuickActions() {
  const actions = [
    {
      title: "Bulk Approval",
      subtitle: "Approve recurring requests",
      icon: <FiCheckSquare size={18} />,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Fleet Inventory",
      subtitle: "View all active vehicles",
      icon: <FiTruck size={18} />,
      color: "from-emerald-500 to-green-600",
    },
    {
      title: "Utilization Map",
      subtitle: "Analyze deployment zones",
      icon: <FiMap size={18} />,
      color: "from-purple-500 to-violet-600",
    },
    {
      title: "Fleet Review",
      subtitle: "Next review: Sept 24",
      icon: <FiClock size={18} />,
      color: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {actions.map((item) => (
        <button
          key={item.title}
          className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          {/* Background Accent */}
          <div
            className={`absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r ${item.color}`}
          />

          {/* Header */}
          <div className="flex items-start justify-between">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-md`}
            >
              {item.icon}
            </div>

            <FiArrowUpRight
              size={16}
              className="text-slate-400 transition group-hover:text-slate-700"
            />
          </div>

          {/* Content */}
          <div className="mt-5">
            <h3 className="font-semibold text-slate-900">{item.title}</h3>

            <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Quick Action
            </span>

            <span className="text-xs font-semibold text-slate-700">Open →</span>
          </div>
        </button>
      ))}
    </div>
  );
}
