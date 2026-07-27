import { FiSearch, FiFilter, FiChevronDown } from "react-icons/fi";

export default function VehicleFilters() {
  return (
    <div className="border-b border-slate-200 bg-white px-5 py-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[250px]">
          <FiSearch
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search vehicles..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </div>

        {/* Status Filter */}
        <select className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500">
          <option>All Status</option>
          <option>Available</option>
          <option>Scheduled Trip</option>
          <option>Unavailable</option>
          <option>Maintenance</option>
          <option>Out of Service</option>
        </select>

        {/* Type Filter */}
        <select className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500">
          <option>All Types</option>
          <option>Car</option>
          <option>Van</option>
          <option>SUV</option>
          <option>Bus</option>
        </select>

        {/* Filter Button */}
        <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          <FiFilter size={16} />
          Filters
        </button>

        {/* Sort */}
        <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          Newest
          <FiChevronDown size={16} />
        </button>
      </div>
    </div>
  );
}
