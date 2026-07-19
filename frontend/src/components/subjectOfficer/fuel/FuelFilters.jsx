import { FiCalendar, FiSearch, FiX } from "react-icons/fi";

export default function FuelFilters({ filters, onChange, onClear }) {
  return (
    <div className="border-b border-slate-200 bg-white px-5 py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <FiSearch
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={filters.search}
            onChange={(event) => onChange("search", event.target.value)}
            placeholder="Search registration number or vehicle model..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <FiCalendar size={16} className="text-slate-400" />
          <span className="sr-only">Filter by date</span>
          <input
            type="date"
            value={filters.date}
            onChange={(event) => onChange("date", event.target.value)}
            className="bg-transparent text-sm outline-none"
          />
        </label>

        <select
          value={filters.fuelType}
          onChange={(event) => onChange("fuelType", event.target.value)}
          aria-label="Filter by fuel type"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
        >
          <option value="">All Fuel Types</option>
          <option value="diesel">Diesel</option>
          <option value="petrol">Petrol</option>
        </select>

        <button
          type="button"
          onClick={onClear}
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <FiX size={16} />
          Clear Filters
        </button>
      </div>
    </div>
  );
}
