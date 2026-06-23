import DashboardLayout from "../../layouts/DashboardLayout";

import ExecutiveStats from "../../components/deputySecretary/dashboard/ExecutiveStats";
import ApprovalQueue from "../../components/deputySecretary/dashboard/ApprovalQueue";
import AvailableFleet from "../../components/deputySecretary/dashboard/AvailableFleet";
import StandbyDrivers from "../../components/deputySecretary/dashboard/StandbyDrivers";
import QuickActions from "../../components/deputySecretary/dashboard/QuickActions";
import AllocationEfficiency from "../../components/deputySecretary/dashboard/AllocationEfficiency";
import DepartmentDemand from "../../components/deputySecretary/dashboard/DepartmentDemand";

export default function DeputySecretaryDashboard() {
  return (
    <DashboardLayout>
      <div className="bg-slate-50 min-h-screen p-6">

        <ExecutiveStats />

        <div className="grid lg:grid-cols-12 gap-6 mt-6">

          <div className="lg:col-span-8">
            <ApprovalQueue />
          </div>

          <div className="lg:col-span-4 space-y-5">
            <AvailableFleet />
            <StandbyDrivers />
            <QuickActions />
          </div>

        </div>

        <div className="grid lg:grid-cols-12 gap-6 mt-6">

          <div className="lg:col-span-8">
            <AllocationEfficiency />
          </div>

          <div className="lg:col-span-4">
            <DepartmentDemand />
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}