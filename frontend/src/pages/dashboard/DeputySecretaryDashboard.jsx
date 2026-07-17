import DashboardLayout from "../../layouts/DashboardLayout";
import ExecutiveStats from "../../components/deputySecretary/dashboard/ExecutiveStats";
import MonthlyCostAnalysis from "../../components/deputySecretary/dashboard/MonthlyCostAnalysis";
export default function DeputySecretaryDashboard() {
  return (
    <DashboardLayout>
      <div className="bg-slate-50 min-h-screen p-6">
        <ExecutiveStats />
        <MonthlyCostAnalysis />
      </div>
    </DashboardLayout>
  );
}
