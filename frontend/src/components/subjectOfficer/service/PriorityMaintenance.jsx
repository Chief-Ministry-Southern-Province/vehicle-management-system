import { FiAlertTriangle, FiClock } from "react-icons/fi";

export default function PriorityMaintenance() {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">
          Priority Maintenance
        </h3>

        <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-medium text-red-600">
          HIGH
        </span>
      </div>

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <FiAlertTriangle size={18} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900">GV-9021</h4>

          <p className="text-sm text-slate-500">Major Engine Overhaul</p>

          <p className="mt-1 text-xs text-slate-400">AutoTech Solutions</p>

          <div className="mt-3 flex items-center gap-1 text-xs text-red-600">
            <FiClock size={12} />

            <span>Overdue since 15 May 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
}
