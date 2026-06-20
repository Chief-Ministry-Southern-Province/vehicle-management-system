import { FiCalendar, FiFilter, FiRefreshCw, FiSearch } from "react-icons/fi";

export default function HistoryFilters() {
    return (
        <div className="bg-white border rounded-xl p-4">
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-62.5">
                    <FiSearch className="absolute left-3 top-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by employee, destination, request ID..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    />
                </div>

                <button className="border px-4 py-3 rounded-lg flex items-center gap-2">
                    <FiCalendar />
                    Date Range
                </button>

                <button className="border px-4 py-3 rounded-lg flex items-center gap-2">
                    <FiFilter />
                    Status
                </button>

                <button className="border px-4 py-3 rounded-lg flex items-center gap-2">
                    <FiFilter />
                    Vehicle Type
                </button>

                <button className="border px-4 py-3 rounded-lg flex items-center gap-2">
                    <FiRefreshCw />
                    Reset
                </button>

                <button className="bg-blue-600 text-white px-4 py-3 rounded-lg">
                    Apply Filters
                </button>

            </div>
        </div>
    );
}