import DashboardLayout from "../../layouts/DashboardLayout";
import StatsCards from "../../components/departmentOfficer/StatsCards";
import PendingRequestsTable from "../../components/departmentOfficer/PendingRequestsTable";

import { FiCalendar, FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function DepartmentOfficerDashboard() {
  const navigate = useNavigate();

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
              Welcome back, Officer David Miller.
              Here is what's happening in Operations &
              Logistics today.
            </p>
          </div>

        </div>

        <StatsCards />

        <div className="space-y-6">
            <PendingRequestsTable />
        </div>

      </div>
    </DashboardLayout>
  );
}