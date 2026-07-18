import { FiSearch, FiFilter, FiChevronDown, FiTool } from "react-icons/fi";

export default function RepairFilters() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <FiSearch
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search vehicle, repair type, vendor..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <button className="rounded-full bg-red-100 px-4 py-2 text-xs font-medium text-red-700 transition hover:bg-red-200">
            Critical
          </button>

          <button className="rounded-full bg-amber-100 px-4 py-2 text-xs font-medium text-amber-700 transition hover:bg-amber-200">
            In Progress
          </button>

          <button className="rounded-full bg-green-100 px-4 py-2 text-xs font-medium text-green-700 transition hover:bg-green-200">
            Completed
          </button>
        </div>

        {/* Repair Type */}
        <select className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white">
          <option>All Repairs</option>
          <option>Engine</option>
          <option>Electrical</option>
          <option>Transmission</option>
          <option>Body Repair</option>
          <option>Tyre Replacement</option>
        </select>

        {/* More Filters */}
        <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          <FiFilter size={15} />
          More Filters
          <FiChevronDown size={14} />
        </button>
      </div>

      {/* Optional Summary */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
          <FiTool size={12} className="text-blue-600" />

          <span className="text-xs font-medium text-blue-700">
            24 Active Repairs
          </span>
        </div>

        <span className="text-xs text-slate-500">
          Showing repair records across the government fleet.
        </span>
      </div>
    </div>
  );
}
