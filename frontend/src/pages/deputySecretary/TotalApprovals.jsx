import { useEffect, useMemo, useState } from "react";
import { FiCheckCircle, FiClock, FiFileText, FiSearch, FiXCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getApprovalVehicleRequests } from "../../api/authApi";

const statusStyle = {
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
  recommended: "bg-blue-100 text-blue-700",
  submitted: "bg-amber-100 text-amber-700",
};

function StatCard({ icon, label, value, tone }) {
  return <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>{icon}</div><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold text-slate-900">{value}</p></div>;
}

export default function TotalApprovals() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ all: 0, pending: 0, approved: 0, rejected: 0 });
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const response = await getApprovalVehicleRequests("all");
        setRequests(response?.data?.requests || []);
        setStats(response?.data?.stats || { all: 0, pending: 0, approved: 0, rejected: 0 });
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
      const matchesStatus = status === "all" || (status === "pending" ? !["approved", "rejected"].includes(request.status) : request.status === status);
      const matchesSearch = !search || String(request.id).includes(search) || request.requester_name?.toLowerCase().includes(search) || request.user?.department?.toLowerCase().includes(search) || request.destination?.toLowerCase().includes(search) || request.purpose?.toLowerCase().includes(search);
      return matchesStatus && matchesSearch;
    });
  }, [query, requests, status]);

  return <DashboardLayout><div className="min-h-screen space-y-6 bg-slate-50 p-6">
    <header><p className="text-sm font-semibold text-blue-600">Deputy Secretary</p><h1 className="mt-1 text-3xl font-bold text-slate-900">Total Approvals</h1><p className="mt-1 text-slate-500">Complete approval details for vehicle requests across all departments.</p></header>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard icon={<FiFileText />} label="Total Requests" value={stats.all} tone="bg-blue-50 text-blue-600" /><StatCard icon={<FiClock />} label="Pending" value={stats.pending} tone="bg-amber-50 text-amber-600" /><StatCard icon={<FiCheckCircle />} label="Approved" value={stats.approved} tone="bg-emerald-50 text-emerald-600" /><StatCard icon={<FiXCircle />} label="Rejected" value={stats.rejected} tone="bg-rose-50 text-rose-600" /></div>
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="flex flex-col gap-4 border-b p-5 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-xl font-bold text-slate-900">Approval Register</h2><p className="text-sm text-slate-500">Showing {visibleRequests.length} of {requests.length} records</p></div><div className="flex flex-col gap-3 sm:flex-row"><div className="relative"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search requests..." className="w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-400 sm:w-72" /></div><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border bg-white px-4 py-2.5 text-sm"><option value="all">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></div></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[1500px]"><thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Request</th><th className="px-5 py-4">Requester</th><th className="px-5 py-4">Department</th><th className="px-5 py-4">Purpose / Destination</th><th className="px-5 py-4">Journey</th><th className="px-5 py-4">Passengers</th><th className="px-5 py-4">Department Recommendation</th><th className="px-5 py-4">Priority</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Submitted</th><th className="px-5 py-4">Action</th></tr></thead><tbody>
        {visibleRequests.map((request) => <tr key={request.id} className="border-t align-top hover:bg-blue-50/30"><td className="px-5 py-4 font-semibold text-blue-600">REQ-{String(request.id).padStart(4, "0")}</td><td className="px-5 py-4"><p className="font-semibold text-slate-800">{request.requester_name || request.user?.name}</p><p className="text-xs text-slate-500">{request.user?.employee_id || "—"}</p></td><td className="px-5 py-4 text-sm text-slate-600">{request.user?.department || "—"}</td><td className="max-w-[260px] px-5 py-4"><p className="font-medium text-slate-800">{request.purpose}</p><p className="mt-1 text-sm text-slate-500">{request.destination}</p></td><td className="px-5 py-4 text-sm text-slate-600"><p>{new Date(request.departure_at).toLocaleString()}</p><p className="mt-1 text-xs">to {new Date(request.expected_return_at).toLocaleString()}</p></td><td className="px-5 py-4 text-center text-sm">{request.passenger_count}</td><td className="max-w-[260px] px-5 py-4"><p className="text-sm font-semibold capitalize">{request.recommendation_status || "pending"}</p><p className="mt-1 line-clamp-2 text-xs text-slate-500">{request.recommendation_notes || "No notes"}</p><p className="mt-1 text-xs text-slate-400">{request.recommender?.name || "Not reviewed"}</p></td><td className="px-5 py-4 text-sm font-semibold capitalize">{request.department_priority || "Not set"}</td><td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle[request.status] || "bg-slate-100 text-slate-600"}`}>{request.status?.replaceAll("_", " ")}</span></td><td className="px-5 py-4 text-sm text-slate-600">{new Date(request.created_at).toLocaleString()}</td><td className="px-5 py-4"><button type="button" onClick={() => navigate(`/approval/${request.id}`)} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white">View details</button></td></tr>)}
        {loading && <tr><td colSpan={11} className="p-10 text-center text-sm text-slate-500">Loading approval records...</td></tr>}{!loading && error && <tr><td colSpan={11} className="bg-red-50 p-5 text-center text-sm text-red-700">{error}</td></tr>}{!loading && !error && visibleRequests.length === 0 && <tr><td colSpan={11} className="p-10 text-center text-sm text-slate-500">No approval records found.</td></tr>}
      </tbody></table></div>
    </section>
  </div></DashboardLayout>;
}
