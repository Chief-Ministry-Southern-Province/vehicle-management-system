import { FiSearch } from "react-icons/fi";

export default function HistoryFilters({
  query,
  onQueryChange,
  status,
  onStatusChange,
  counts,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-2xl flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by request ID, destination, or purpose..."
            className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <button
            type="button"
            onClick={() => onStatusChange("all")}
            className={`rounded-xl px-3 py-2.5 text-xs font-semibold transition sm:px-4 sm:text-sm ${status === "all" ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            All Requests ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => onStatusChange("approved")}
            className={`rounded-xl px-3 py-2.5 text-xs font-semibold transition sm:px-4 sm:text-sm ${status === "approved" ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            Approved ({counts.approved})
          </button>
        </div>
      </div>
    </div>
  );
}
