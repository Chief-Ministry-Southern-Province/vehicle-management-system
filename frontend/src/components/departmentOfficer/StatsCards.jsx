import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

export default function StatsCards() {
  return (
    <div className="grid md:grid-cols-3 gap-5">

      <div className="bg-white border rounded-xl p-6">
        <div className="flex justify-between">
          <FiClock className="text-blue-500 text-2xl" />

          <span className="text-xs text-green-600">
            +12% from last week
          </span>
        </div>

        <p className="text-gray-500 mt-4">
          Pending Recommendation
        </p>

        <h2 className="text-4xl font-bold mt-2">
          8
        </h2>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <div className="flex justify-between">
          <FiCheckCircle className="text-blue-500 text-2xl" />

          <span className="text-xs text-green-600">
            +5% from last month
          </span>
        </div>

        <p className="text-gray-500 mt-4">
          Total Recommended (MTD)
        </p>

        <h2 className="text-4xl font-bold mt-2">
          45
        </h2>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <div className="flex justify-between">
          <FiXCircle className="text-red-500 text-2xl" />

          <span className="text-xs text-red-600">
            -2% from last month
          </span>
        </div>

        <p className="text-gray-500 mt-4">
          Rejected This Month
        </p>

        <h2 className="text-4xl font-bold mt-2">
          4
        </h2>
      </div>

    </div>
  );
}