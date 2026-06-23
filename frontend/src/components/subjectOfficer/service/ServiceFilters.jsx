import {
  FiSearch,
  FiFilter,
  FiCalendar,
} from "react-icons/fi";

export default function ServiceFilters() {
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
            placeholder="Search vehicle, plate number, or model..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />

        </div>

        {/* Service Status */}
        <select className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white">
          <option>All Status</option>
          <option>Scheduled</option>
          <option>In Progress</option>
          <option>Completed</option>
          <option>Overdue</option>
        </select>

        {/* Date Filter */}
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">

          <FiCalendar
            size={15}
            className="text-slate-400"
          />

          <input
            type="date"
            className="bg-transparent text-sm outline-none"
          />

        </div>

        {/* Filter Button */}
        <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          <FiFilter size={16} />
          Filters
        </button>

      </div>

    </div>
  );
}