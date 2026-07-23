import { FiCalendar, FiSearch, FiX } from "react-icons/fi";

export default function RepairFilters({ filters, repairTypes, onChange, selectedMonth, onMonthChange, onClear }) {
  return (
    <div className="border-b border-slate-100 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <FiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={filters.search} onChange={(event) => onChange("search", event.target.value)} placeholder="Search vehicle, model, or repair type..." className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" />
        </div>
        <select value={filters.repairType} onChange={(event) => onChange("repairType", event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white">
          <option value="">All Repair Types</option>
          {repairTypes.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <FiCalendar size={15} className="text-slate-400" />
          <input type="month" value={selectedMonth} onChange={(event) => onMonthChange(event.target.value)} className="bg-transparent text-sm outline-none" />
        </div>
        <button type="button" onClick={onClear} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"><FiX size={16} /> Clear</button>
      </div>
    </div>
  );
}
