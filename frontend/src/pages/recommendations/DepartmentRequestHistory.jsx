import { useEffect, useMemo, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
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
        const response = await getDepartmentVehicleRequests("history");
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
        status === "all" || request.recommendation_status === status;
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Request History
            </h1>

            <p className="text-gray-500 mt-1">
              Monitor and manage your vehicle allocation requests.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 border px-4 py-2 rounded-xl hover:bg-gray-50"
            >
              <FiRefreshCw /> Refresh
            </button>
            <button
              onClick={() => navigate("/pendingrecommendations")}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700"
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
    </DashboardLayout>
  );
}
