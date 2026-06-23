import { FiTrendingUp } from "react-icons/fi";

export default function InsightCard() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">

      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
          <FiTrendingUp className="text-blue-600" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Automated Insights
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-3">
        Fuel Efficiency Increased by 4.2%
      </h3>

      <p className="text-sm text-gray-600 leading-relaxed">
        Route optimization within the Public Works Department has
        reduced unnecessary travel distance, generating an estimated
        operational saving of <span className="font-semibold">$1,200</span>{" "}
        this month.
      </p>

      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">
            Estimated Savings
          </p>

          <h4 className="text-xl font-bold text-green-600">
            $1,200
          </h4>
        </div>

        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          Read Full Analysis →
        </button>
      </div>

    </div>
  );
}