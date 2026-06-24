import {
  FiCalendar,
  FiEdit3,
  FiAlertTriangle,
  FiFileText,
} from "react-icons/fi";

const actions = [
  {
    title: "Today's Schedule",
    subtitle: "View assigned trips",
    icon: <FiCalendar />,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Quick Log",
    subtitle: "Submit trip report",
    icon: <FiEdit3 />,
    color: "bg-green-50 text-green-600",
  },
  {
    title: "Report Issue",
    subtitle: "Vehicle maintenance",
    icon: <FiAlertTriangle />,
    color: "bg-red-50 text-red-600",
  },
  {
    title: "Trip History",
    subtitle: "View completed trips",
    icon: <FiFileText />,
    color: "bg-purple-50 text-purple-600",
  },
];

export default function DriverQuickActions() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900 text-lg">
          Quick Actions
        </h3>

        <span className="text-xs text-slate-400">
          Driver Tools
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">

        {actions.map((item) => (
          <button
            key={item.title}
            className="group p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all text-left"
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${item.color}`}
            >
              {item.icon}
            </div>

            <h4 className="font-semibold text-slate-800">
              {item.title}
            </h4>

            <p className="text-xs text-slate-500 mt-1">
              {item.subtitle}
            </p>
          </button>
        ))}

      </div>
    </div>
  );
}