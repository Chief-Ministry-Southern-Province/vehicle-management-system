import {
  FiSearch,
  FiCalendar,
  FiFilter,
  FiDownload,
  FiX,
} from "react-icons/fi";

export default function HistoryFilters() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">

      {/* Top Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

        {/* Search */}
        <div className="relative flex-1 max-w-2xl">

          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />

          <input
            type="text"
            placeholder="Search by Request ID, Destination, Purpose..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none"
          />

        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">

          <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600">

            <FiCalendar />

            Last 30 Days

          </button>

          <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600">

            <FiFilter />

            Status

          </button>

          <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600">

            <FiFilter />

            Vehicle Type

          </button>

          <button className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">

            <FiDownload />

            Export Data

          </button>

        </div>

      </div>

      {/* Divider */}
      <div className="my-5 border-t border-slate-100" />

      {/* Active Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">

        <div className="flex flex-wrap items-center gap-2">

          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Active Filters
          </span>

          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
            Last 30 Days
            <FiX className="cursor-pointer hover:text-red-500" />
          </span>

          <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
            Approved
            <FiX className="cursor-pointer hover:text-red-500" />
          </span>

          <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700">
            Sedan
            <FiX className="cursor-pointer hover:text-red-500" />
          </span>

        </div>

        <button className="text-sm font-medium text-slate-500 transition hover:text-red-600">
          Clear All Filters
        </button>

      </div>


    </div>
  );
}