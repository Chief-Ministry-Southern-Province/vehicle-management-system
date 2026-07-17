import { FiFilter, FiRefreshCw, FiSearch } from "react-icons/fi";

export default function HistoryFilters({
  query,
  status,
  onQueryChange,
  onStatusChange,
  onReset,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
        <div>
          <h3 className="font-semibold text-slate-900">Search & Filters</h3>
          <p className="mt-1 text-sm text-slate-500">
            Locate reviewed requests using live backend records.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <FiRefreshCw size={15} /> Reset
        </button>
      </div>
      <div className="grid gap-4 p-6 md:grid-cols-[1fr_220px]">
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
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
            className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="all">All decisions</option>
            <option value="recommended">Recommended</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
      </div>
    </div>
  );
}
