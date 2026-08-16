import { useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiMapPin,
  FiSearch,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getApprovalVehicleRequests } from "../../api/authApi";
import { formatLocalDateTime } from "../../utils/dateTime";
const statusStyle = {
  approved: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  vehicle_allocated:
    "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200",
  rejected: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
  recommended: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
  submitted: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  completed: "bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200",
  cancelled: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
};
function StatCard({ icon, label, value, tone, accent }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 sm:text-xs">
            {label}
          </p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Approval records
          </p>
        </div>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${tone}`}
        >
          {icon}
        </div>
      </div>
      <div className={`absolute inset-x-0 bottom-0 h-1 ${accent}`} />
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
    cancelled: 0,
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
          ? !["approved", "completed", "rejected", "cancelled"].includes(
              request.status,
            )
          : request.status === status);
      const matchesSearch =
        !search ||
        String(request.id).includes(search) ||
        request.requester_name?.toLowerCase().includes(search) ||
        request.user?.department?.toLowerCase().includes(search) ||
        request.starting_location?.toLowerCase().includes(search) ||
        request.destination?.toLowerCase().includes(search) ||
        request.purpose?.toLowerCase().includes(search);
      return matchesStatus && matchesSearch;
    });
  }, [query, requests, status]);
  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1600px] space-y-5 sm:space-y-6">
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-5 py-6 text-white shadow-xl shadow-slate-300 sm:px-7 sm:py-8">
          <div className="pointer-events-none absolute -right-14 -top-24 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">Deputy secretary workspace</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Approval register</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Review request progress, recommendations, and allocation-ready journeys in one place.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur"><p className="text-xs text-slate-300">Total records</p><p className="mt-1 text-2xl font-bold">{stats.all}</p></div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur"><p className="text-xs text-slate-300">Awaiting action</p><p className="mt-1 text-2xl font-bold">{stats.pending}</p></div>
            </div>
          </div>
        </header>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <StatCard
            icon={<FiFileText />}
            label="Total Requests"
            value={stats.all}
            tone="bg-blue-100 text-blue-600"
            accent="bg-blue-500"
          />
          <StatCard
            icon={<FiClock />}
            label="Pending"
            value={stats.pending}
            tone="bg-amber-100 text-amber-600"
            accent="bg-amber-500"
          />
          <StatCard
            icon={<FiCheckCircle />}
            label="Approved"
            value={stats.approved}
            tone="bg-emerald-100 text-emerald-600"
            accent="bg-emerald-500"
          />
          <StatCard
            icon={<FiXCircle />}
            label="Rejected"
            value={stats.rejected}
            tone="bg-rose-100 text-rose-600"
            accent="bg-rose-500"
          />
        </div>
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_55px_-30px_rgba(15,23,42,0.18)]">
          <div className="flex flex-col gap-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-blue-50/60 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-600 ring-1 ring-blue-100">
                Official Records
              </div>
              <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
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
                <option value="completed">Complete</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="divide-y divide-slate-100 lg:hidden">
            {!loading && !error && visibleRequests.map((request) => (
              <article key={request.id} className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0"><p className="text-xs font-bold tracking-wide text-blue-700">REQ-{String(request.id).padStart(4, "0")}</p><p className="mt-1 truncate text-sm font-bold text-slate-900">{request.requester_name || request.user?.name || "Requester not recorded"}</p><p className="mt-0.5 text-xs text-slate-500">{request.user?.department || "Department not recorded"}</p></div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${statusStyle[request.status] || "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200"}`}>{request.status?.replaceAll("_", " ")}</span>
                </div>
                <div className="mt-4 rounded-xl bg-slate-50 p-3"><p className="text-sm font-semibold text-slate-800">{request.purpose || "Purpose not provided"}</p><p className="mt-2 flex items-start gap-2 text-xs leading-5 text-slate-600"><FiMapPin className="mt-0.5 shrink-0 text-blue-600" /><span>{request.starting_location || "Starting location not provided"} <span className="mx-1 text-blue-500" aria-hidden="true">→</span> {request.destination || "Destination not provided"}</span></p></div>
                <div className="mt-4 flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3 text-xs text-slate-500"><span className="inline-flex items-center gap-1"><FiUsers />{request.passenger_count || 0} pax</span><span className="truncate">{formatLocalDateTime(request.departure_at)}</span></div><button type="button" onClick={() => navigate(`/approval/${request.id}`)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition active:scale-95" aria-label={`View request REQ-${String(request.id).padStart(4, "0")}`}><FiArrowRight /></button></div>
              </article>
            ))}
            {loading && <div className="p-10 text-center text-sm text-slate-500"><FiClock className="mx-auto mb-2 animate-pulse text-xl text-blue-500" />Loading approval records...</div>}
            {!loading && error && <div className="bg-red-50 p-5 text-center text-sm text-red-700">{error}</div>}
            {!loading && !error && visibleRequests.length === 0 && <div className="p-10 text-center text-sm text-slate-500">No approval records found.</div>}
          </div>
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1500px]">
              <thead className="bg-slate-900 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-300">
                <tr>
                  <th className="px-5 py-4">Request</th>
                  <th className="px-5 py-4">Requester</th>
                  <th className="px-5 py-4">Department</th>
                  <th className="px-5 py-4">Purpose / Route</th>
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
                    className="align-top transition-colors odd:bg-white even:bg-slate-50/40 hover:bg-blue-50/70"
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
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                        <span className="max-w-28 truncate">{request.starting_location || "Starting location not provided"}</span>
                        <span className="shrink-0 text-blue-500" aria-hidden="true">→</span>
                        <span className="max-w-28 truncate">{request.destination || "Destination not provided"}</span>
                      </p>
                    </td>
                    <td className="px-5 py-5 text-sm text-slate-600">
                      <p>{formatLocalDateTime(request.departure_at)}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        to{" "}
                        {formatLocalDateTime(request.expected_return_at)}
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
                      {formatLocalDateTime(request.created_at)}
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
