import {
  FiSearch,
  FiFilter,
  FiCalendar,
} from "react-icons/fi";

export default function FuelFilters() {
  return (
    <div className="border-b border-slate-200 bg-white px-5 py-4">

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

        {/* Search */}
        <div className="relative flex-1">

          <FiSearch
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search vehicle or driver..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />

        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">

          <FiCalendar
            size={16}
            className="text-slate-400"
          />

          <input
            type="date"
            className="bg-transparent text-sm outline-none"
          />

        </div>

        {/* Fuel Type */}
        <select className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white">
          <option>All Fuel Types</option>
          <option>Diesel</option>
          <option>Petrol</option>
          <option>Hybrid</option>
          <option>Electric</option>
        </select>

        {/* Filter Button */}
        <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          <FiFilter size={16} />
          Advanced Filters
        </button>

      </div>

    </div>
  );
}