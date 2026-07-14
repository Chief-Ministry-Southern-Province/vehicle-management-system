import DashboardLayout from "../../layouts/DashboardLayout";
import StatsCards from "../../components/departmentOfficer/StatsCards";
import PendingRequestsTable from "../../components/departmentOfficer/PendingRequestsTable";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getDepartmentVehicleRequests } from "../../api/authApi";
import { useAuth } from "../../context/useAuth";

export default function DepartmentOfficerDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ total_records: 0, approved: 0, rejected: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await getDepartmentVehicleRequests();
        setRequests(response?.data?.requests || []);
        setStats(response?.data?.stats || {});
      } catch (error) {
        toast.error(error?.message || "Unable to load department requests.");
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-start">

          <div>
            <h1 className="text-3xl font-bold">
              Department Overview
            </h1>

            <p className="text-gray-500 mt-1">
              Welcome back, {user?.name || "Department Officer"}. Here are your department's vehicle requests.
            </p>
          </div>

        </div>

        <StatsCards stats={stats} />

        <div className="space-y-6">
            <PendingRequestsTable requests={requests} loading={loading} />
        </div>

      </div>
    </DashboardLayout>
  );
}
