import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiSliders,
  FiDownload,
} from "react-icons/fi";

export default function RecommendationFilters() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

      <div className="flex flex-col lg:flex-row lg:items-center gap-4">

        {/* Search */}
        <div className="relative flex-1">

          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

          <input
            type="text"
            placeholder="Search by employee, destination, request ID..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
          />

        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">

          <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition">
            <FiFilter />
            <span>Filters</span>

            <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full">
              3
            </span>
          </button>

          <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition">
            <FiSliders />
            Sort
          </button>

          <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition">
            <FiRefreshCw />
            Refresh
          </button>

          <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition">
            <FiDownload />
            Export
          </button>

        </div>

      </div>

      {/* Active Filters */}
      <div className="flex flex-wrap gap-2 mt-4">

        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
          High Priority
        </span>

        <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-medium">
          Pending
        </span>

        <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-sm font-medium">
          This Week
        </span>

      </div>

    </div>
  );
}