import { FiEye } from "react-icons/fi";

const requestNumber = (id) => `REQ-${String(id).padStart(4, "0")}`;
const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
        new Date(value),
      )
    : "—";

const statusClasses = {
  recommended: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
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
              <th className="p-4">Status</th>
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
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClasses[request.recommendation_status] || "bg-slate-100 text-slate-700"}`}
                  >
                    {request.recommendation_status || "—"}
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
