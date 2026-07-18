import DashboardLayout from "../../layouts/DashboardLayout";
import MonthlyCostAnalysis from "../../components/deputySecretary/dashboard/MonthlyCostAnalysis";
import StatsCard from "../../components/seniorDeputySecretary/StatsCard";
export default function SeniorDeputySecretaryDashboard() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-900">
        <StatsCard />
        <MonthlyCostAnalysis />
      </div>
    </DashboardLayout>
  );
}
