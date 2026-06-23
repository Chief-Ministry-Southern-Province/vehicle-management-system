import {
  FiTrendingUp,
  FiTool,
} from "react-icons/fi";

export default function AnalyticsInsights() {
  return (
    <div className="grid md:grid-cols-2 gap-4">

      {/* Route Efficiency */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">

        <div className="flex items-center gap-2 mb-3">

          <FiTrendingUp
            size={16}
            className="text-blue-600"
          />

          <h3 className="font-semibold text-slate-900">
            Route Efficiency
          </h3>

        </div>

        <h2 className="text-3xl font-bold text-slate-900">
          94.2%
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Optimization Score
        </p>

        <div className="mt-4 border-t pt-3">

          <p className="text-sm text-slate-600">
            Average trip duration reduced by
            <span className="font-medium text-slate-900">
              {" "}12 minutes
            </span>
            .
          </p>

        </div>

      </div>

      {/* Predictive Maintenance */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">

        <div className="flex items-center gap-2 mb-3">

          <FiTool
            size={16}
            className="text-blue-600"
          />

          <h3 className="font-semibold text-slate-900">
            Predictive Maintenance
          </h3>

        </div>

        <h2 className="text-3xl font-bold text-slate-900">
          6
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Pending Service Alerts
        </p>

        <div className="mt-4 flex flex-wrap gap-2">

          <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs text-slate-600">
            TX-092 (Brakes)
          </span>

          <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs text-slate-600">
            SUV-011 (Oil)
          </span>

          <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs text-slate-600">
            +4 More
          </span>

        </div>

      </div>

    </div>
  );
}