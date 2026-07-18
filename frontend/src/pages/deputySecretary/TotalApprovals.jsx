import { useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiSearch,
  FiXCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getApprovalVehicleRequests } from "../../api/authApi";
const statusStyle = {
  approved: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  vehicle_allocated:
    "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200",
  rejected: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
  recommended: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
  submitted: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
};
function StatCard({ icon, label, value, tone }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-br from-white via-white to-slate-50 p-5 shadow-[0_10px_35px_-18px_rgba(15,23,42,0.35)] ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-20px_rgba(15,23,42,0.4)]">
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-60 blur-2xl ${tone}`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            {label}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-2 text-xs font-medium text-slate-400">
            Live approval overview
          </p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl shadow-sm ring-1 ring-inset ring-white/70 transition-transform duration-300 group-hover:scale-110 ${tone}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
export default function TotalApprovals() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const loadRequests = async () => {
      try {
        const response = await getApprovalVehicleRequests("all");
        setRequests(response?.data?.requests || []);
        setStats(
          response?.data?.stats || {
            all: 0,
            pending: 0,
            approved: 0,
            rejected: 0,
          },
        );
      } catch (loadError) {
        setError(loadError?.message || "Unable to load approval records.");
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, []);
  const visibleRequests = useMemo(() => {
    const search = query.trim().toLowerCase();
    return requests.filter((request) => {
      const matchesStatus =
        status === "all" ||
        (status === "pending"
          ? !["approved", "rejected"].includes(request.status)
          : request.status === status);
      const matchesSearch =
        !search ||
        String(request.id).includes(search) ||
        request.requester_name?.toLowerCase().includes(search) ||
        request.user?.department?.toLowerCase().includes(search) ||
        request.destination?.toLowerCase().includes(search) ||
        request.purpose?.toLowerCase().includes(search);
      return matchesStatus && matchesSearch;
    });
  }, [query, requests, status]);
  return (
    <DashboardLayout>
      <div className="min-h-screen space-y-6 bg-slate-50 p-6">
        <header>
          <p className="text-sm font-semibold text-blue-600">
            Deputy Secretary
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Request Allocation Register
          </h1>
          <p className="mt-1 text-slate-500">
            Vehicle allocation details for requests across all departments.
          </p>
        </header>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<FiFileText />}
            label="Total Requests"
            value={stats.all}
            tone="bg-blue-100 text-blue-600"
          />
          <StatCard
            icon={<FiClock />}
            label="Pending"
            value={stats.pending}
            tone="bg-amber-100 text-amber-600"
          />
          <StatCard
            icon={<FiCheckCircle />}
            label="Approved"
            value={stats.approved}
            tone="bg-emerald-100 text-emerald-600"
          />
          <StatCard
            icon={<FiXCircle />}
            label="Rejected"
            value={stats.rejected}
            tone="bg-rose-100 text-rose-600"
          />
        </div>
        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_55px_-30px_rgba(15,23,42,0.45)]">
          <div className="flex flex-col gap-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-blue-50/60 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-600 ring-1 ring-blue-100">
                Official Records
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Approval Register
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {visibleRequests.length}
                </span>{" "}
                of {requests.length} records
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search requests..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50 sm:w-72"
                />
              </div>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1500px]">
              <thead className="bg-slate-500 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-300">
                <tr>
                  <th className="px-5 py-4">Request</th>
                  <th className="px-5 py-4">Requester</th>
                  <th className="px-5 py-4">Department</th>
                  <th className="px-5 py-4">Purpose / Destination</th>
                  <th className="px-5 py-4">Journey</th>
                  <th className="px-5 py-4">Passengers</th>
                  <th className="px-5 py-4">Department Recommendation</th>
                  <th className="px-5 py-4">Priority</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Submitted</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="align-top transition-colors hover:bg-blue-50/50"
                  >
                    <td className="px-5 py-5">
                      <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-100">
                        REQ-{String(request.id).padStart(4, "0")}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <p className="font-semibold text-slate-900">
                        {request.requester_name || request.user?.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {request.user?.employee_id || "—"}
                      </p>
                    </td>
                    <td className="px-5 py-5 text-sm text-slate-600">
                      {request.user?.department || "—"}
                    </td>
                    <td className="max-w-[260px] px-5 py-5">
                      <p className="font-semibold text-slate-800">
                        {request.purpose}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {request.destination}
                      </p>
                    </td>
                    <td className="px-5 py-5 text-sm text-slate-600">
                      <p>{new Date(request.departure_at).toLocaleString()}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        to{" "}
                        {new Date(request.expected_return_at).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-5 py-5 text-center text-sm font-bold text-slate-700">
                      {request.passenger_count}
                    </td>
                    <td className="max-w-[260px] px-5 py-5">
                      <p className="text-sm font-semibold capitalize text-slate-800">
                        {request.recommendation_status || "pending"}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {request.recommendation_notes || "No notes"}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {request.recommender?.name || "Not reviewed"}
                      </p>
                    </td>
                    <td className="px-5 py-5 text-sm font-semibold capitalize text-slate-700">
                      {request.department_priority || "Not set"}
                    </td>
                    <td className="px-5 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyle[request.status] || "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200"}`}
                      >
                        {request.status?.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-5 text-sm text-slate-600">
                      {new Date(request.created_at).toLocaleString()}
                    </td>
                    <td className="px-5 py-5">
                      <button
                        type="button"
                        onClick={() => navigate(`/approval/${request.id}`)}
                        className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td
                      colSpan={11}
                      className="p-10 text-center text-sm text-slate-500"
                    >
                      Loading approval records...
                    </td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td
                      colSpan={11}
                      className="bg-red-50 p-5 text-center text-sm text-red-700"
                    >
                      {error}
                    </td>
                  </tr>
                )}
                {!loading && !error && visibleRequests.length === 0 && (
                  <tr>
                    <td
                      colSpan={11}
                      className="p-10 text-center text-sm text-slate-500"
                    >
                      No approval records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
