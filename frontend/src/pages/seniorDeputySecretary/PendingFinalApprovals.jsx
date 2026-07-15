import { useEffect, useState } from "react";
import { FiChevronRight, FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getFinalApprovalVehicleRequests } from "../../api/authApi";
import DashboardLayout from "../../layouts/DashboardLayout";

const requestNumber = (id) => `REQ-${String(id).padStart(4, "0")}`;
const formatDateTime = (value) => value ? new Date(value).toLocaleString() : "—";

export default function PendingFinalApprovals() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPendingRequests = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getFinalApprovalVehicleRequests("pending");
        setRequests(response?.data?.requests || []);
      } catch (requestError) {
        setError(requestError?.message || "Unable to load pending final approvals.");
      } finally {
        setLoading(false);
      }
    };

    loadPendingRequests();
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen space-y-6 bg-slate-50 p-6">
        <header>
          <p className="text-sm font-semibold text-blue-600">Senior Deputy Secretary</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Pending Final Approvals</h1>
          <p className="mt-2 text-sm text-slate-500">
            Review requests that have completed vehicle and driver allocation.
          </p>
        </header>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-amber-100 p-3 text-amber-700"><FiClock /></span>
              <div>
                <h2 className="font-bold text-slate-900">Pending Requests</h2>
                <p className="text-sm text-slate-500">{requests.length} request{requests.length === 1 ? "" : "s"} awaiting final approval</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Request ID</th>
                  <th className="px-6 py-4 font-semibold">Requester</th>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold">Journey Details</th>
                  <th className="px-6 py-4 font-semibold">Time</th>
                  <th className="px-6 py-4 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    onClick={() => navigate(`/final-approvals/${request.id}`)}
                    className="cursor-pointer border-t border-slate-100 transition hover:bg-blue-50/50"
                  >
                    <td className="px-6 py-5 font-semibold text-blue-600">{requestNumber(request.id)}</td>
                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-800">{request.requester_name || request.user?.name || "Unknown requester"}</p>
                      <p className="text-xs text-slate-500">{request.user?.employee_id || "Government Employee"}</p>
                    </td>
                    <td className="px-6 py-5 text-slate-600">{request.user?.department || "Not specified"}</td>
                    <td className="max-w-xs px-6 py-5">
                      <p className="font-semibold text-slate-800">{request.destination || "Destination not specified"}</p>
                      <p className="mt-1 text-sm text-slate-500">{request.purpose || "Purpose not specified"}</p>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      <p>{formatDateTime(request.departure_at)}</p>
                      <p className="mt-1 text-xs text-slate-500">Return: {formatDateTime(request.expected_return_at)}</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button type="button" onClick={(event) => { event.stopPropagation(); navigate(`/final-approvals/${request.id}`); }} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                        View <FiChevronRight />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading && <div className="border-t border-slate-100 px-6 py-10 text-center text-sm text-slate-500">Loading pending requests...</div>}
          {!loading && error && <div className="border-t border-red-100 bg-red-50 px-6 py-4 text-sm text-red-700">{error}</div>}
          {!loading && !error && requests.length === 0 && <div className="border-t border-slate-100 px-6 py-10 text-center text-sm text-slate-500">No requests are awaiting final approval.</div>}
        </section>
      </div>
    </DashboardLayout>
  );
}
