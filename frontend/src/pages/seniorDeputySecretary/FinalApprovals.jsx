import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiXCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getFinalApprovalVehicleRequests } from "../../api/authApi";
import DashboardLayout from "../../layouts/DashboardLayout";
const views = [
  {
    key: "pending",
    label: "Pending",
    icon: FiClock,
    active: "bg-amber-500 text-white",
  },
  {
    key: "approved",
    label: "Approved",
    icon: FiCheckCircle,
    active: "bg-emerald-600 text-white",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: FiXCircle,
    active: "bg-rose-600 text-white",
  },
];
const statusStyle = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};
const priorityStyle = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
};
const requestNumber = (id) => `REQ-${String(id).padStart(4, "0")}`;
export default function FinalApprovals() {
  const navigate = useNavigate();
  const [view, setView] = useState("pending");
  const [requests, setRequests] = useState([]);
  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getFinalApprovalVehicleRequests(view);
        const data = response?.data || {};
        const nextRequests = data.requests || [];
        setRequests(nextRequests);
        setCounts((current) => ({
          ...current,
          ...(data.stats || {}),
          [view]: data.stats?.[view] ?? nextRequests.length,
        }));
      } catch (requestError) {
        setRequests([]);
        setError(
          requestError?.message || `Unable to load ${view} final approvals.`,
        );
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, [view]);
  return (
    <DashboardLayout>
      <div className="min-h-screen space-y-6 bg-slate-50 p-6">
        <header>
          <p className="text-sm font-semibold text-blue-600">
            Senior Deputy Secretary
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Final Approvals
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Track pending, approved, and rejected vehicle requests.
          </p>
        </header>

        <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          {views.map(({ key, label, icon: Icon, active }) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${view === key ? active : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
            >
              <Icon /> {label} ({counts[key]})
            </button>
          ))}
        </div>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-xl font-bold capitalize text-slate-900">
              {view} Requests
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Showing requests with {view} final approval status.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Request ID</th>
                  <th className="px-6 py-4 font-semibold">Requester</th>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Priority</th>
                  <th className="px-6 py-4 font-semibold">Allocated Vehicle</th>
                  <th className="px-6 py-4 text-center font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    onClick={() => navigate(`/final-approvals/${request.id}`)}
                    className="cursor-pointer border-t border-slate-100 transition hover:bg-blue-50/50"
                  >
                    <td className="px-6 py-5 font-semibold text-blue-600">
                      {requestNumber(request.id)}
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-800">
                        {request.requester_name ||
                          request.user?.name ||
                          "Unknown requester"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {request.user?.employee_id || "Government Employee"}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-slate-600">
                      {request.user?.department || "Not specified"}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle[request.status] || statusStyle[view]}`}
                      >
                        {(request.status || view).replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${priorityStyle[request.department_priority] || "bg-slate-100 text-slate-700"}`}
                      >
                        {request.department_priority?.replaceAll("_", " ") ||
                          "Not set"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-slate-600">
                      {request.allocated_vehicle?.registration_number ||
                        "Not allocated"}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        {view === "pending" ? "Review" : "View"}{" "}
                        <FiChevronRight />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading && (
            <div className="border-t border-slate-100 px-6 py-10 text-center text-sm text-slate-500">
              Loading {view} requests...
            </div>
          )}
          {!loading && error && (
            <div className="border-t border-red-100 bg-red-50 px-6 py-4 text-sm text-red-700">
              {error}
            </div>
          )}
          {!loading && !error && requests.length === 0 && (
            <div className="border-t border-slate-100 px-6 py-10 text-center text-sm text-slate-500">
              No {view} requests found.
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
