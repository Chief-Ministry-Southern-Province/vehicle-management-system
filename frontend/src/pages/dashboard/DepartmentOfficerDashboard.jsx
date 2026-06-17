import DashboardLayout from "../../layouts/DashboardLayout";
import StatsCards from "../../components/departmentOfficer/StatsCards";
import PendingRequestsTable from "../../components/departmentOfficer/PendingRequestsTable";
import DepartmentChart from "../../components/departmentOfficer/DepartmentChart";
import ActivityTimeline from "../../components/departmentOfficer/ActivityTimeline";

import { FiCalendar, FiClock } from "react-icons/fi";

export default function DepartmentOfficerDashboard() {
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

          <div className="flex gap-3">

            <button className="border px-4 py-2 rounded-lg flex items-center gap-2">
              <FiCalendar />
              May 2024
            </button>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <FiClock />
              View Pending (8)
            </button>

          </div>

        </div>

        <StatsCards />

        <div className="grid lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2">
            <PendingRequestsTable />
          </div>

          <DepartmentChart />

        </div>

        <ActivityTimeline />

      </div>
    </DashboardLayout>
  );
}