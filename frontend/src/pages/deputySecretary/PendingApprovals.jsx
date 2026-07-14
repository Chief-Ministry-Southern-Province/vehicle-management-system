import DashboardLayout from "../../layouts/DashboardLayout";
import ApprovalQueue from "../../components/deputySecretary/dashboard/ApprovalQueue";
import { useEffect, useState } from "react";
import { getApprovalVehicleRequests } from "../../api/authApi";

export default function PendingApprovals() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const response = await getApprovalVehicleRequests();
        setRequests(response?.data?.requests || []);
      } catch (requestError) {
        setError(requestError?.message || "Unable to load approval requests.");
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* Approval Table */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <ApprovalQueue requests={requests} loading={loading} error={error} />

        </div>

      </div>

    </DashboardLayout>
  );
}
