import { FiTool } from "react-icons/fi";

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
};

export default function ServiceScheduleTable({ records, loading, error, selectedIds, onToggle, onToggleAll }) {
  const allSelected = records.length > 0 && records.every((record) => selectedIds.has(record.id));
  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h3 className="font-semibold text-slate-900">Service Records</h3>
          <p className="mt-1 text-sm text-slate-500">Vehicle maintenance history</p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600">
          {records.length} {records.length === 1 ? "Record" : "Records"}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-4 py-4 text-center"><input type="checkbox" checked={allSelected} onChange={() => onToggleAll(records, !allSelected)} aria-label="Select all displayed service records" className="h-4 w-4 rounded border-slate-300 accent-blue-600" /></th>
              <th className="px-6 py-4 text-left">Vehicle</th>
              <th className="px-6 py-4 text-left">Service Type</th>
              <th className="px-6 py-4 text-left">Cost</th>
              <th className="px-6 py-4 text-left">Service Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">Loading service records...</td></tr>
            ) : error ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-sm font-medium text-red-600">{error}</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">No service records match the selected filters.</td></tr>
            ) : records.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 transition hover:bg-slate-50">
                <td className="px-4 py-4 text-center"><input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => onToggle(item.id)} aria-label={`Select service record for ${item.vehicle || "vehicle"}`} className="h-4 w-4 rounded border-slate-300 accent-blue-600" /></td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><FiTool size={18} /></div>
                    <div>
                      <h4 className="font-medium text-slate-900">{item.vehicle || "-"}</h4>
                      <p className="text-xs text-slate-500">{item.model || "Model not specified"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.service_type || "-"}</td>
                <td className="px-6 py-4 font-medium text-slate-900">LKR {(Number(item.cost) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{formatDate(item.service_date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
