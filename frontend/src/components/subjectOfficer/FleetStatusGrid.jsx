import {
  FiTruck,
  FiCheckCircle,
  FiTool,
  FiAlertTriangle,
} from "react-icons/fi";
import { useMemo } from "react";
import { useLanguage } from "../../context/useLanguage";

const statusStyles = {
  available: {
    icon: FiCheckCircle,
    card: "bg-green-100 text-green-600",
    dot: "bg-green-500",
    badge: "bg-green-50 text-green-700",
    label: "Available",
  },
  maintenance: {
    icon: FiTool,
    card: "bg-amber-100 text-amber-600",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700",
    label: "Maintenance",
  },
  unavailable: {
    icon: FiAlertTriangle,
    card: "bg-red-100 text-red-600",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700",
    label: "Unavailable",
  },
};

export default function FleetStatusGrid({
  vehicles = [],
  loading,
  error,
  onRetry,
}) {
  const { translate } = useLanguage();

  const summary = useMemo(
    () =>
      vehicles.reduce(
        (totals, vehicle) => {
          if (Object.hasOwn(totals, vehicle.status))
            totals[vehicle.status] += 1;
          return totals;
        },
        { available: 0, maintenance: 0, unavailable: 0 },
      ),
    [vehicles],
  );

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {translate("Fleet Status Overview")}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {translate("Real-time availability of government vehicles")}
            </p>
          </div>

          <div className="hidden md:flex gap-6 text-sm">
            <div>
              <p className="text-slate-500">{translate("Available")}</p>
              <p className="font-bold text-green-600">{summary.available}</p>
            </div>

            <div>
              <p className="text-slate-500">{translate("Maintenance")}</p>
              <p className="font-bold text-amber-600">{summary.maintenance}</p>
            </div>

            <div>
              <p className="text-slate-500">{translate("Unavailable")}</p>
              <p className="font-bold text-red-600">{summary.unavailable}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {loading &&
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-slate-50"
              />
            ))}

          {!loading && error && (
            <div className="col-span-full flex items-center justify-between gap-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              <p>{error}</p>
              <button
                type="button"
                onClick={onRetry}
                className="rounded-lg bg-red-100 px-3 py-2 font-semibold hover:bg-red-200"
              >
                {translate("Retry")}
              </button>
            </div>
          )}

          {!loading && !error && vehicles.length === 0 && (
            <p className="col-span-full rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
              {translate("No vehicles are registered in the fleet.")}
            </p>
          )}

          {!loading &&
            !error &&
            vehicles.map((vehicle) => {
              const style =
                statusStyles[vehicle.status] || statusStyles.unavailable;
              const StatusIcon = style.icon;

              return (
                <div
                  key={vehicle.id}
                  className="group bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.card}`}
                    >
                      <FiTruck size={18} />
                    </div>

                    <span className={`w-3 h-3 rounded-full ${style.dot}`} />
                  </div>

                  <h3 className="font-semibold text-slate-800 mt-4">
                    {vehicle.registration_number}
                  </h3>

                  <div className="mt-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${style.badge}`}
                    >
                      <StatusIcon size={12} />
                      {translate(style.label)}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
