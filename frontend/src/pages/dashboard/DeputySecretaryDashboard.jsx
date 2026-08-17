import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ExecutiveStats from "../../components/deputySecretary/dashboard/ExecutiveStats";
import MonthlyCostAnalysis from "../../components/deputySecretary/dashboard/MonthlyCostAnalysis";
import { getVehicles } from "../../api/authApi";

export default function DeputySecretaryDashboard() {
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
        if (active) setVehicles(fleet);
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
      <div className="min-h-screen px-3 py-4 dark:bg-slate-950 sm:px-5 sm:py-6 lg:px-2">
        <div className="mx-auto max-w-[1600px] space-y-5 sm:space-y-7">
          <header className="relative overflow-hidden rounded-[24px] bg-linear-to-br from-slate-950 via-blue-950 to-indigo-900 px-5 py-6 text-white shadow-[0_24px_60px_-30px_rgba(30,64,175,0.8)] sm:px-7 sm:py-8 lg:px-9">
            <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-indigo-400/20 blur-3xl" />
            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300 sm:text-xs">Executive command centre</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-[34px]">Deputy Secretary Dashboard</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100/80 sm:text-base">Monitor fleet readiness, approvals and operational spending from one place.</p>
            </div>
          </header>
          <ExecutiveStats />
          <MonthlyCostAnalysis vehicles={vehicles} loading={loadingCosts} error={costError} />
        </div>
      </div>
    </DashboardLayout>
  );
}
