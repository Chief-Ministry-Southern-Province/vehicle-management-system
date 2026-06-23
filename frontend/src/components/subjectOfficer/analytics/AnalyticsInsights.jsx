import {
  FiTrendingUp,
  FiTool,
} from "react-icons/fi";

export default function AnalyticsInsights() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">

      <div className="bg-white border rounded-2xl p-6">

        <div className="flex items-center gap-3 mb-4">
          <FiTrendingUp className="text-blue-600 text-xl" />

          <h2 className="text-2xl font-bold">
            Route Efficiency
          </h2>
        </div>

        <h1 className="text-5xl font-bold">
          94.2%
        </h1>

        <p className="text-gray-500 mt-2">
          Optimization Score
        </p>

        <div className="mt-5 bg-gray-100 rounded-lg p-3 text-sm">
          Average trip duration decreased by
          <strong> 12 minutes </strong>
          this month.
        </div>

      </div>

      <div className="bg-white border rounded-2xl p-6">

        <div className="flex items-center gap-3 mb-4">
          <FiTool className="text-orange-500 text-xl" />

          <h2 className="text-2xl font-bold">
            Predictive Maintenance
          </h2>
        </div>

        <h1 className="text-5xl font-bold">
          6 Units
        </h1>

        <p className="text-gray-500 mt-2">
          Service alerts pending
        </p>

        <div className="flex flex-wrap gap-2 mt-5">

          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">
            VMS-TX-092 (Brakes)
          </span>

          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">
            VMS-SUV-011 (Oil)
          </span>

        </div>

      </div>

    </div>
  );
}