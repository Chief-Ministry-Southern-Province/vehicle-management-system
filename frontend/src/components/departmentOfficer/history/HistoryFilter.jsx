import { FiFilter, FiRefreshCw, FiSearch } from "react-icons/fi";

export default function HistoryFilters({
  query,
  status,
  onQueryChange,
  onStatusChange,
  onReset,
}) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_16px_40px_-28px_rgba(15,23,42,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-6">
        <div>
          <h3 className="font-semibold text-slate-900">Search & Filters</h3>
          <p className="mt-1 text-sm text-slate-500">
            Locate reviewed requests using live backend records.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          <FiRefreshCw size={15} /> Reset
        </button>
      </div>
      <div className="grid gap-4 p-5 sm:p-6 md:grid-cols-[1fr_220px]">
        <label className="relative">
          <FiSearch
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search employee, destination, request ID..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </label>
        <label className="relative">
          <FiFilter
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          >
            <option value="all">All request statuses</option>
            <option value="submitted">Submitted</option>
            <option value="recommended">Recommended</option>
            <option value="vehicle_allocated">Allocated Vehicle</option>
            <option value="approved">Approved</option>
            <option value="completed">Complete</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>
    </section>
  );
}
