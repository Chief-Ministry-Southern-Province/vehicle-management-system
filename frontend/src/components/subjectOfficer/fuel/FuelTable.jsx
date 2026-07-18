import { FiDroplet } from "react-icons/fi";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function FuelTable({ logs, loading, error }) {
  return (
    <div className="overflow-hidden bg-white">
      <div className="max-h-[460px] overflow-auto">
        <table className="w-full min-w-[760px]">
          <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm">
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Vehicle</th>
              <th className="px-6 py-4 text-left">Fuel Type</th>
              <th className="px-6 py-4 text-left">Fuel Liters</th>
              <th className="px-6 py-4 text-left">Cost (LKR)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                  Loading fuel records…
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm font-medium text-red-600">
                  {error}
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                  No fuel records match the selected filters.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b border-slate-100 transition hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-600">{formatDate(log.date)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <FiDroplet size={18} />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-600">{log.vehicle || "—"}</h4>
                        <p className="text-xs text-slate-500">{log.model || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium capitalize text-slate-800">{log.fuel_type || "—"}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{formatNumber(log.capacity)} L</td>
                  <td className="px-6 py-4 text-slate-600">{formatNumber(log.cost)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {!loading && !error && (
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-sm text-slate-500">
          Showing {logs.length} fuel {logs.length === 1 ? "record" : "records"}. Scroll to view more.
        </div>
      )}
    </div>
  );
}
