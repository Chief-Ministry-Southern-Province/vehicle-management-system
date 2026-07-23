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
      <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-900">
        <StatsCard />
        <MonthlyCostAnalysis
          vehicles={vehicles}
          loading={loadingCosts}
          error={costError}
        />
      </div>
    </DashboardLayout>
  );
}
