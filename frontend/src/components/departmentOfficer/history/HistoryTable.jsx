import { FiEye } from "react-icons/fi";
import { formatLocalDateTime as formatDate } from "../../../utils/dateTime";

const requestNumber = (id) => `REQ-${String(id).padStart(4, "0")}`;
const statusClasses = {
  submitted: "bg-slate-100 text-slate-700",
  recommended: "bg-emerald-100 text-emerald-700",
  vehicle_allocated: "bg-blue-100 text-blue-700",
  approved: "bg-violet-100 text-violet-700",
  rejected: "bg-red-100 text-red-700",
};
const statusLabels = {
  submitted: "Submitted",
  recommended: "Recommended",
  vehicle_allocated: "Allocated Vehicle",
  approved: "Approved",
  rejected: "Rejected",
};

export default function HistoryTable({ requests, loading, error, onView }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="border-b p-5">
        <h2 className="text-xl font-semibold">Request Archive</h2>
        <p className="text-sm text-gray-500">
          Reviewed vehicle requests from your department.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px]">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="p-4">Request ID</th>
              <th className="p-4">Employee Name</th>
              <th className="p-4">Destination</th>
              <th className="p-4">Request Date</th>
              <th className="p-4">Recommended By</th>
              <th className="p-4">Request Status</th>
              <th className="p-4">Decision Date</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-semibold text-blue-600">
                  {requestNumber(request.id)}
                </td>
                <td className="p-4">
                  <p className="font-medium text-slate-800">
                    {request.requester_name || request.user?.name || "—"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {request.user?.employee_id || "—"}
                  </p>
                </td>
                <td className="p-4">
                  <p className="font-medium text-slate-700">
                    {request.destination || "—"}
                  </p>
                  <p className="max-w-xs truncate text-xs text-slate-500">
                    {request.purpose || "—"}
                  </p>
                </td>
                <td className="p-4 text-slate-600">
                  {formatDate(request.created_at)}
                </td>
                <td className="p-4 text-slate-600">
                  {request.recommender?.name || "—"}
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[request.status] || "bg-slate-100 text-slate-700"}`}
                  >
                    {statusLabels[request.status] ||
                      request.status?.replaceAll("_", " ") ||
                      "—"}
                  </span>
                </td>
                <td className="p-4 text-slate-600">
                  {formatDate(request.recommended_at)}
                </td>
                <td className="p-4 text-center">
                  <button
                    type="button"
                    onClick={() => onView(request.id)}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    <FiEye /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && (
        <div className="border-t p-10 text-center text-sm text-slate-500">
          Loading request history...
        </div>
      )}
      {!loading && error && (
        <div className="border-t border-red-100 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      )}
      {!loading && !error && requests.length === 0 && (
        <div className="border-t p-10 text-center text-sm text-slate-500">
          No reviewed requests found.
        </div>
      )}
      {!loading && !error && requests.length > 0 && (
        <div className="border-t bg-slate-50 p-4 text-sm text-slate-500">
          Showing {requests.length} historical record
          {requests.length === 1 ? "" : "s"}
        </div>
      )}
    </div>
  );
}
