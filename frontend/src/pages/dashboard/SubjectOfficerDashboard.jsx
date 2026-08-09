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
      <div className="mx-auto w-full max-w-[1600px] space-y-4 sm:space-y-6">
        {/* Header */}
        <header className="min-w-0 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-6">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white sm:text-3xl">
              {translate("Fleet Operations Overview")}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
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
    </DashboardLayout>
  );
}
