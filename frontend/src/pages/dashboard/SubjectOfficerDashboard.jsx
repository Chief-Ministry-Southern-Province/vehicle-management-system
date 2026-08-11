import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import FleetStats from "../../components/subjectOfficer/FleetStats";
import MonthlyCostAnalysis from "../../components/deputySecretary/dashboard/MonthlyCostAnalysis";
import { useLanguage } from "../../context/useLanguage";
import { getVehicles } from "../../api/authApi";

export default function SubjectOfficerDashboard() {
  const { translate } = useLanguage();
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
      <div className="min-h-screen bg-[#f4f7fb] px-3 py-4 dark:bg-slate-950 sm:px-5 sm:py-6 lg:px-7">
       <div className="mx-auto w-full max-w-[1600px] space-y-5 sm:space-y-7">
        {/* Header */}
        <header className="relative min-w-0 overflow-hidden rounded-[24px] bg-linear-to-br from-slate-950 via-blue-950 to-sky-900 px-5 py-6 text-white shadow-[0_24px_60px_-30px_rgba(14,165,233,0.8)] sm:px-7 sm:py-8 lg:px-9">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl" />
          <div className="relative min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-300 sm:text-xs">Fleet operations</p>
            <h1 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-[34px]">
              {translate("Fleet Operations Overview")}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-sky-100/80 sm:text-base">
              {translate("Monitoring vehicles across government departments.")}
            </p>
          </div>
        </header>

        <FleetStats />

        <MonthlyCostAnalysis
          vehicles={vehicles}
          loading={loadingCosts}
          error={costError}
        />
       </div>
      </div>
    </DashboardLayout>
  );
}
