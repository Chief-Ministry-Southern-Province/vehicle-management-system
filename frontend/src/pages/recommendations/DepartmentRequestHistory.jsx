import { useEffect, useMemo, useState } from "react";
import { FiArchive, FiClock, FiRefreshCw, FiShield } from "react-icons/fi";
import DashboardLayout from "../../layouts/DashboardLayout";
import HistoryFilters from "../../components/departmentOfficer/history/HistoryFilter";
import HistoryTable from "../../components/departmentOfficer/history/HistoryTable";
import { useNavigate } from "react-router-dom";
import { getDepartmentVehicleRequests } from "../../api/authApi";
export default function DepartmentRequestHistory() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getDepartmentVehicleRequests("all");
        if (active) setRequests(response?.data?.requests || []);
      } catch (requestError) {
        if (active)
          setError(
            requestError?.message ||
              "Unable to load department request history.",
          );
      } finally {
        if (active) setLoading(false);
      }
    };
    loadHistory();
    return () => {
      active = false;
    };
  }, []);
  const filteredRequests = useMemo(() => {
    const search = query.trim().toLowerCase();
    return requests.filter((request) => {
      const matchesStatus =
        status === "all" || request.status === status;
      const matchesSearch =
        !search ||
        [
          `REQ-${String(request.id).padStart(4, "0")}`,
          request.requester_name,
          request.user?.name,
          request.user?.employee_id,
          request.destination,
          request.purpose,
          request.recommender?.name,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(search),
        );
      return matchesStatus && matchesSearch;
    });
  }, [requests, query, status]);
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-5 sm:py-6 lg:px-7">
        <div className="mx-auto max-w-[1600px] space-y-5 sm:space-y-6">
          <header className="relative overflow-hidden rounded-[24px] bg-linear-to-br from-slate-950 via-blue-950 to-indigo-900 px-5 py-6 text-white shadow-[0_24px_60px_-30px_rgba(30,64,175,0.8)] sm:px-7 sm:py-8">
            <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl" />
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300">Department operations</p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Request History</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100/80">Review the complete, department-scoped archive of official vehicle requests and recommendations.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-blue-100 backdrop-blur-sm"><FiArchive className="text-cyan-300" /> {requests.length} archived</div>
                <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-blue-100 backdrop-blur-sm"><FiClock className="text-cyan-300" /> {filteredRequests.length} displayed</div>
              </div>
            </div>
          </header>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500"><FiShield className="text-blue-600" /> Department records are visible only to authorized reviewers.</div>
            <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <FiRefreshCw /> Refresh
            </button>
            <button
              onClick={() => navigate("/pendingrecommendations")}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
            >
              Review Pending Requests
            </button>
            </div>
          </div>
          <HistoryFilters
            query={query}
            status={status}
            onQueryChange={setQuery}
            onStatusChange={setStatus}
            onReset={() => {
              setQuery("");
              setStatus("all");
            }}
          />
          <HistoryTable
            requests={filteredRequests}
            loading={loading}
            error={error}
            onView={(id) => navigate(`/employee/recommendations/${id}`)}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
