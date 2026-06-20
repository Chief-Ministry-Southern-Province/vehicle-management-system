import {
  FiShield,
  FiTruck,
  FiArrowUpRight,
} from "react-icons/fi";

export default function RecommendationInfoCards() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">

      {/* Recommendation Policy */}
      <div className="relative overflow-hidden bg-linear-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">

        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-40" />

        <div className="relative z-10">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <FiShield className="text-blue-600 text-xl" />
              </div>

              <div>
                <h3 className="font-semibold text-blue-900">
                  Recommendation Policy
                </h3>

                <p className="text-xs text-blue-500">
                  Compliance & Governance
                </p>
              </div>

            </div>

          </div>

          <p className="text-sm text-gray-600 mt-5 leading-6">
            All vehicle requests must be reviewed and
            recommended within <strong>48 hours</strong> of
            submission. Rejected requests must include
            proper justification notes to maintain audit
            transparency and accountability.
          </p>

          <div className="mt-5 flex items-center text-blue-600 text-sm font-medium">
            View Policy Guidelines
            <FiArrowUpRight className="ml-2" />
          </div>

        </div>

      </div>

      {/* Fleet Status */}
      <div className="relative overflow-hidden bg-linear-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">

        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-40" />

        <div className="relative z-10">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <FiTruck className="text-emerald-600 text-xl" />
              </div>

              <div>
                <h3 className="font-semibold text-emerald-900">
                  Fleet Status Update
                </h3>

                <p className="text-xs text-emerald-500">
                  Live Operational Summary
                </p>
              </div>

            </div>

          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">

            <div className="bg-white rounded-xl p-4 border">
              <p className="text-xs text-gray-500">
                Fleet Utilization
              </p>

              <h4 className="text-2xl font-bold text-emerald-600 mt-1">
                85%
              </h4>
            </div>

            <div className="bg-white rounded-xl p-4 border">
              <p className="text-xs text-gray-500">
                Available Vehicles
              </p>

              <h4 className="text-2xl font-bold text-blue-600 mt-1">
                12
              </h4>
            </div>

          </div>

          <p className="text-sm text-gray-600 mt-5 leading-6">
            High-priority requests should be processed
            before routine travel requests. Current
            vehicle availability is sufficient for today's
            scheduled operations.
          </p>

        </div>

      </div>

    </div>
  );
}