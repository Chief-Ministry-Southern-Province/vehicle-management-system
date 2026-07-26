import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ApprovalQueue from "../../components/deputySecretary/dashboard/ApprovalQueue";
import { getSeniorPendingRecommendations } from "../../api/authApi";

export default function PendingRecommendations() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const response = await getSeniorPendingRecommendations();
        setRequests(response?.data?.requests || []);
      } catch (requestError) {
        setError(
          requestError?.message || "Unable to load pending recommendations.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Pending Recommendations
          </h1>
          <p className="mt-1 text-slate-500">
            Review vehicle requests submitted by Deputy Secretaries.
          </p>
        </div>
        <ApprovalQueue
          requests={requests}
          loading={loading}
          error={error}
          view="senior_recommendations"
        />
      </div>
    </DashboardLayout>
  );
}
