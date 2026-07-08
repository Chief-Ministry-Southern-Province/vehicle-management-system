import DashboardLayout from "../../layouts/DashboardLayout";

import ExecutiveStats from "../../components/deputySecretary/dashboard/ExecutiveStats";
import ApprovalQueue from "../../components/deputySecretary/dashboard/ApprovalQueue";

export default function DeputySecretaryDashboard() {
  return (
    <DashboardLayout>
      <div className="bg-slate-50 min-h-screen p-6">

        <ExecutiveStats />

      </div>
    </DashboardLayout>
  );
}