import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ApprovalQueue from "../../components/deputySecretary/dashboard/ApprovalQueue";
import { getDepartmentOfficerRecommendations } from "../../api/authApi";

export default function DepartmentRecommendations() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const response = await getDepartmentOfficerRecommendations();
        setRequests(response?.data?.requests || []);
      } catch (requestError) {
        setError(
          requestError?.message ||
            "Unable to load Department Officer recommendations.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Department Recommendations
          </h1>
          <p className="mt-1 text-slate-500">
            View vehicle-request recommendations submitted by Department
            Officers.
          </p>
        </div>

        <ApprovalQueue
          requests={requests}
          loading={loading}
          error={error}
          view="department_recommendations"
        />
      </div>
    </DashboardLayout>
  );
}
