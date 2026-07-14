import DashboardLayout from "../../layouts/DashboardLayout";
import ApprovalQueue from "../../components/deputySecretary/dashboard/ApprovalQueue";
import { useEffect, useState } from "react";
import { getApprovalVehicleRequests } from "../../api/authApi";

export default function PendingApprovals() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("pending");
  const [stats, setStats] = useState({ pending: 0, approved: 0 });

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getApprovalVehicleRequests(view);
        setRequests(response?.data?.requests || []);
        setStats(response?.data?.stats || { pending: 0, approved: 0 });
      } catch (requestError) {
        setError(requestError?.message || "Unable to load approval requests.");
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [view]);

  return (
    <DashboardLayout>

      <div className="space-y-6">

        <div className="flex flex-wrap gap-3 rounded-2xl border bg-white p-3 shadow-sm">
          <button type="button" onClick={() => setView("pending")} className={`rounded-xl px-5 py-2.5 text-sm font-semibold ${view === "pending" ? "bg-amber-500 text-white" : "bg-slate-50 text-slate-600"}`}>Pending ({stats.pending})</button>
          <button type="button" onClick={() => setView("approved")} className={`rounded-xl px-5 py-2.5 text-sm font-semibold ${view === "approved" ? "bg-emerald-600 text-white" : "bg-slate-50 text-slate-600"}`}>Approved ({stats.approved})</button>
        </div>

        {/* Approval Table */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <ApprovalQueue requests={requests} loading={loading} error={error} view={view} />

        </div>

      </div>

    </DashboardLayout>
  );
}
