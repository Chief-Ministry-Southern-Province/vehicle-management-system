import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import MonthlyCostAnalysis from "../../components/deputySecretary/dashboard/MonthlyCostAnalysis";
import StatsCard from "../../components/seniorDeputySecretary/StatsCard";
import { getVehicles } from "../../api/authApi";

export default function SeniorDeputySecretaryDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [loadingCosts, setLoadingCosts] = useState(true);
  const [costError, setCostError] = useState("");

  useEffect(() => {
    let active = true;

    const loadVehicles = async () => {
      try {
        const response = await getVehicles();
        const fleet = response?.data?.vehicles;
        if (!Array.isArray(fleet)) {
          throw new Error("Unable to read vehicle records.");
        }
        if (active) {
          setVehicles(fleet);
          setCostError("");
        }
      } catch (loadError) {
        if (active) {
          setCostError(
            loadError?.message || "Unable to load monthly cost data.",
          );
        }
      } finally {
        if (active) setLoadingCosts(false);
      }
    };

    loadVehicles();
    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f4f7fb] px-3 py-4 dark:bg-slate-950 sm:px-5 sm:py-6 lg:px-7">
        <div className="mx-auto max-w-[1600px] space-y-5 sm:space-y-7">
          <header className="relative overflow-hidden rounded-[24px] bg-linear-to-br from-slate-950 via-indigo-950 to-violet-900 px-5 py-6 text-white shadow-[0_24px_60px_-30px_rgba(79,70,229,0.8)] sm:px-7 sm:py-8 lg:px-9">
            <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />
            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300 sm:text-xs">Executive oversight</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-[34px]">Senior Assistance Secretary Dashboard</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100/80 sm:text-base">Review final approvals, fleet capacity and annual operational expenditure.</p>
            </div>
          </header>
          <StatsCard />
          <MonthlyCostAnalysis vehicles={vehicles} loading={loadingCosts} error={costError} />
        </div>
      </div>
    </DashboardLayout>
  );
}
