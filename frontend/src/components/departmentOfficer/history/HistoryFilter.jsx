import {
  FiCalendar,
  FiFilter,
  FiRefreshCw,
  FiSearch,
  FiChevronDown,
} from "react-icons/fi";

export default function HistoryFilters() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">

        <div>

          <h3 className="font-semibold text-slate-900">
            Search & Filters
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Quickly locate requests using search and advanced filters.
          </p>

        </div>

        <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">

          <FiRefreshCw size={15} />

          Reset

        </button>

      </div>

      {/* Filters */}
      <div className="p-6">

        <div className="grid gap-4 xl:grid-cols-12">

          {/* Search */}
          <div className="relative xl:col-span-5">

            <FiSearch
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search employee, destination, request ID..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

          </div>

          {/* Date */}
          <button className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-white xl:col-span-2">

            <span className="flex items-center gap-2">
              <FiCalendar size={16} />
              Date Range
            </span>

            <FiChevronDown size={16} />

          </button>

          {/* Status */}
          <button className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-white xl:col-span-2">

            <span className="flex items-center gap-2">
              <FiFilter size={16} />
              Status
            </span>

            <FiChevronDown size={16} />

          </button>

          {/* Vehicle Type */}
          <button className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-white xl:col-span-2">

            <span className="flex items-center gap-2">
              <FiFilter size={16} />
              Vehicle
            </span>

            <FiChevronDown size={16} />

          </button>

          {/* Apply */}
          <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 xl:col-span-1">

            Apply

          </button>

        </div>

        {/* Active Filters */}
        <div className="mt-5 flex flex-wrap items-center gap-2">

          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Active Filters
          </span>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            Last 30 Days
          </span>

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            Approved
          </span>

          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
            SUV
          </span>

        </div>

      </div>

    </div>
  );
}