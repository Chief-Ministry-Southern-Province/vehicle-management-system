import DashboardLayout from "../../layouts/DashboardLayout";

import MonthlyCostAnalysis from "../../components/deputySecretary/dashboard/MonthlyCostAnalysis";
import StatsCard from "../../components/seniorDeputySecretary/StatsCard";

export default function SeniorDeputySecretaryDashboard() {
  return (
    <DashboardLayout>
      <div className="bg-slate-50 min-h-screen p-6">

        <StatsCard />
        <MonthlyCostAnalysis />

      </div>
    </DashboardLayout>
  );
}
