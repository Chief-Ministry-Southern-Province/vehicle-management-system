import { useEffect, useMemo, useState } from "react";
import { FiMoreHorizontal, FiPlus } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import HistoryFilters from "../../components/employee/HistoryFilters";
import { getMyVehicleRequests } from "../../api/authApi";

const statusColor = { approved: "bg-green-100 text-green-700", vehicle_allocated: "bg-indigo-100 text-indigo-700", completed: "bg-blue-100 text-blue-700", submitted: "bg-yellow-100 text-yellow-700", recommended: "bg-amber-100 text-amber-700", rejected: "bg-red-100 text-red-700", cancelled: "bg-gray-100 text-gray-700" };

export default function RequestHistory() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [requests, setRequests] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const status = searchParams.get("status") === "approved" ? "approved" : "all";

  useEffect(() => { const load = async () => { try { const response = await getMyVehicleRequests(); setRequests(response?.data?.requests || []); } catch (loadError) { setError(loadError?.message || "Unable to load request history."); } finally { setLoading(false); } }; load(); }, []);

  const counts = useMemo(() => ({ all: requests.length, approved: requests.filter((request) => request.status === "approved").length }), [requests]);
  const visibleRequests = useMemo(() => { const search = query.trim().toLowerCase(); return requests.filter((request) => (status === "all" || request.status === "approved") && (!search || String(request.id).includes(search) || request.destination?.toLowerCase().includes(search) || request.purpose?.toLowerCase().includes(search))); }, [query, requests, status]);
  const changeStatus = (nextStatus) => setSearchParams(nextStatus === "approved" ? { status: "approved" } : {});

  return <DashboardLayout><div className="space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h1 className="text-3xl font-bold">Request History</h1><p className="mt-1 text-gray-500">View all your vehicle requests, including approved requests.</p></div><button onClick={() => navigate("/createvehiclerequest")} className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"><FiPlus />Create New Request</button></div>
    <HistoryFilters query={query} onQueryChange={setQuery} status={status} onStatusChange={changeStatus} counts={counts} />
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full"><thead className="border-b bg-gray-50"><tr className="text-left text-sm text-gray-600"><th className="p-4">Request ID</th><th className="p-4">Date</th><th className="p-4">Destination</th><th className="p-4">Purpose</th><th className="p-4">Pax</th><th className="p-4">Priority</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>
      {visibleRequests.map((request) => <tr key={request.id} onClick={() => navigate(`/employee/requests/${request.id}`)} className="cursor-pointer border-b hover:bg-gray-50"><td className="p-4 font-medium text-blue-600">REQ-{String(request.id).padStart(4, "0")}</td><td className="p-4 text-gray-600">{new Date(request.created_at).toLocaleDateString()}</td><td className="p-4">{request.destination}</td><td className="p-4 text-gray-600">{request.purpose}</td><td className="p-4 text-center">{request.passenger_count}</td><td className="p-4 text-xs font-semibold uppercase text-gray-600">â— {request.department_priority || "Not set"}</td><td className="p-4"><span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColor[request.status] || "bg-gray-100 text-gray-700"}`}>{request.status?.replaceAll("_", " ")}</span></td><td className="p-4"><button type="button" aria-label="View request"><FiMoreHorizontal /></button></td></tr>)}
      {loading && <tr><td colSpan={8} className="p-10 text-center text-sm text-gray-500">Loading request history...</td></tr>}{!loading && error && <tr><td colSpan={8} className="bg-red-50 p-5 text-center text-sm text-red-700">{error}</td></tr>}{!loading && !error && visibleRequests.length === 0 && <tr><td colSpan={8} className="p-10 text-center text-sm text-gray-500">{status === "approved" ? "No approved requests found." : "You have not submitted any vehicle requests."}</td></tr>}
    </tbody></table></div><div className="border-t p-4 text-sm text-gray-500">Showing {visibleRequests.length} of {requests.length} requests</div></div>
  </div></DashboardLayout>;
}
