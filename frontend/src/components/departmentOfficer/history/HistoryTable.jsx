import { FiArrowUpRight, FiEye, FiMapPin } from "react-icons/fi";
import { formatLocalDateTime as formatDate } from "../../../utils/dateTime";

const requestNumber = (id) => `REQ-${String(id).padStart(4, "0")}`;
const shortLocation = (location) => String(location || "—").split(",")[0].trim() || "—";
const statusClasses = {
  pending: "bg-amber-50 text-amber-700 ring-amber-100",
  submitted: "bg-slate-100 text-slate-700 ring-slate-200",
  recommended: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  vehicle_allocated: "bg-blue-50 text-blue-700 ring-blue-100",
  approved: "bg-violet-50 text-violet-700 ring-violet-100",
  rejected: "bg-red-50 text-red-700 ring-red-100",
  completed: "bg-cyan-50 text-cyan-700 ring-cyan-100",
  cancelled: "bg-slate-100 text-slate-600 ring-slate-200",
};
const statusLabels = {
  pending: "Pending",
  submitted: "Submitted",
  recommended: "Recommended",
  vehicle_allocated: "Allocated Vehicle",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Complete",
  cancelled: "Cancelled",
};

export default function HistoryTable({ requests, loading, error, onView }) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_16px_40px_-28px_rgba(15,23,42,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-linear-to-r from-white via-white to-blue-50/60 px-5 py-5 sm:px-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">Department archive</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">Request Archive</h2>
          <p className="mt-1 text-sm text-slate-500">
          Reviewed vehicle requests from your department.
        </p>
        </div>
        <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">{requests.length} records</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px]">
          <thead className="bg-slate-50 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-5 py-4">Request</th>
              <th className="px-5 py-4">Requester</th>
              <th className="px-5 py-4">Route & purpose</th>
              <th className="px-5 py-4">Submitted</th>
              <th className="px-5 py-4">Recommended by</th>
              <th className="px-5 py-4">Recommendation</th>
              <th className="px-5 py-4">Decision</th>
              <th className="px-5 py-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-t border-slate-100 transition hover:bg-blue-50/40">
                <td className="px-5 py-4 font-bold text-blue-700">
                  {requestNumber(request.id)}
                </td>
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">
                    {request.requester_name || request.user?.name || "—"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {request.user?.employee_id || "—"}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <p className="flex items-center gap-1.5 font-semibold text-slate-800"><FiMapPin className="shrink-0 text-blue-500" />
                    {shortLocation(request.starting_location)} – {shortLocation(request.destination)}
                  </p>
                  <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                    {request.purpose || "—"}
                  </p>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                  {formatDate(request.created_at)}
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {request.recommender?.name || "—"}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${statusClasses[request.recommendation_status || request.status] || "bg-slate-100 text-slate-700 ring-slate-200"}`}
                  >
                    {statusLabels[request.recommendation_status || request.status] ||
                      request.recommendation_status?.replaceAll("_", " ") ||
                      request.status?.replaceAll("_", " ") ||
                      "—"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                  {formatDate(request.recommended_at)}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onView(request.id)}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3.5 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-blue-600"
                  >
                    <FiEye /> View <FiArrowUpRight className="text-xs" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && (
        <div className="border-t border-slate-100 p-10 text-center text-sm text-slate-500">
          Loading request history...
        </div>
      )}
      {!loading && error && (
        <div className="border-t border-red-100 bg-red-50 p-5 text-sm font-medium text-red-700">
          {error}
        </div>
      )}
      {!loading && !error && requests.length === 0 && (
        <div className="border-t border-slate-100 p-10 text-center text-sm text-slate-500">
          No reviewed requests found.
        </div>
      )}
      {!loading && !error && requests.length > 0 && (
        <div className="border-t border-slate-100 bg-slate-50/80 px-5 py-4 text-sm text-slate-500">
          Showing {requests.length} historical record
          {requests.length === 1 ? "" : "s"}
        </div>
      )}
    </section>
  );
}
