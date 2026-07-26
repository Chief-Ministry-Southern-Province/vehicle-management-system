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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">
              {translate("Fleet Operations Overview")}
            </h1>

            <p className="text-gray-500 mt-2">
              {translate("Monitoring vehicles across government departments.")}
            </p>
          </div>
        </div>

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
