import {
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

export default function RecommendationStats() {
  return (
    <div className="grid lg:grid-cols-3 gap-5">

      <div className="bg-white border rounded-xl p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-gray-500 text-sm">
              Total Pending
            </p>

            <h2 className="text-4xl font-bold mt-2">
              12
            </h2>

            <p className="text-xs text-gray-400 mt-3">
              4 requests pending over 24 hours
            </p>
          </div>

          <FiClock className="text-blue-500 text-2xl" />
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-gray-500 text-sm">
              High Priority
            </p>

            <h2 className="text-4xl font-bold mt-2">
              03
            </h2>

            <p className="text-xs text-gray-400 mt-3">
              Requires immediate recommendation
            </p>
          </div>

          <FiAlertCircle className="text-red-500 text-2xl" />
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-gray-500 text-sm">
              Completed Today
            </p>

            <h2 className="text-4xl font-bold mt-2">
              08
            </h2>

            <p className="text-xs text-gray-400 mt-3">
              Recommended / Rejected in last 24h
            </p>
          </div>

          <FiCheckCircle className="text-green-500 text-2xl" />
        </div>
      </div>

    </div>
  );
}