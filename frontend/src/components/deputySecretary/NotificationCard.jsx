import { FiBell, FiCheckCircle } from "react-icons/fi";

export default function NotificationCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <FiBell size={18} className="text-blue-600" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-900">
                System Notification
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Fleet Operations Center
              </p>
            </div>

            <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
              Resolved
            </span>
          </div>

          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            All critical vehicle maintenance activities for the VIP fleet have
            been completed successfully. All
            <span className="font-medium text-slate-900">
              {" "}
              12 high-priority vehicles
            </span>{" "}
            are now operational and available for deployment.
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <FiCheckCircle size={14} className="text-green-600" />
              Updated 15 minutes ago
            </div>

            <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
