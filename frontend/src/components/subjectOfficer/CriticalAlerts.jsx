import {
  FiAlertTriangle,
  FiArrowRight,
  FiClock,
} from "react-icons/fi";

const alerts = [
  {
    vehicle: "KAD 012D",
    issue: "Engine Service Required",
    level: "HIGH",
    due: "Today",
  },
  {
    vehicle: "KAI 567I",
    issue: "Tire Replacement",
    level: "MEDIUM",
    due: "2 Days",
  },
  {
    vehicle: "KAR 234R",
    issue: "Insurance Renewal",
    level: "HIGH",
    due: "Tomorrow",
  },
];

export default function CriticalAlerts() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Critical Alerts
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Vehicles requiring immediate attention
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-xs font-medium text-red-600">
            3 Active
          </span>
        </div>
      </div>

      {/* Alerts */}
      <div className="p-4 space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.vehicle}
            className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-r from-white to-slate-50 p-4 transition-all duration-300 hover:shadow-md hover:border-slate-200"
          >
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                {/* Icon */}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <FiAlertTriangle size={20} />
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {alert.vehicle}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {alert.issue}
                  </p>

                  <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                    <FiClock size={12} />
                    Due: {alert.due}
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-3">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    alert.level === "HIGH"
                      ? "bg-red-100 text-red-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {alert.level}
                </span>

                <FiArrowRight className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/50">
        <button className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 transition">
          View All Alerts
        </button>
      </div>
    </div>
  );
}