import DashboardLayout from "../../layouts/DashboardLayout";
import ExecutiveStats from "../../components/deputySecretary/dashboard/ExecutiveStats";
import MonthlyCostAnalysis from "../../components/deputySecretary/dashboard/MonthlyCostAnalysis";
export default function DeputySecretaryDashboard() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-900">
        <ExecutiveStats />
        <MonthlyCostAnalysis />
      </div>
    </DashboardLayout>
  );
}
