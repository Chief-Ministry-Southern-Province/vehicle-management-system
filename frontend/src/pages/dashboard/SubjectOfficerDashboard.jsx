import DashboardLayout from "../../layouts/DashboardLayout";

import FleetStats from "../../components/subjectOfficer/FleetStats";
import FleetStatusGrid from "../../components/subjectOfficer/FleetStatusGrid";
import { useCallback, useEffect, useState } from "react";
import { getVehicles } from "../../api/authApi";
import { useLanguage } from "../../context/useLanguage";

export default function SubjectOfficerDashboard() {
  const { translate } = useLanguage();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFleet = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getVehicles();
      setVehicles(response?.data?.vehicles || []);
    } catch (loadError) {
      setVehicles([]);
      setError(loadError?.message || "Unable to load the fleet overview.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    getVehicles()
      .then((response) => {
        if (!active) return;
        setVehicles(response?.data?.vehicles || []);
        setError("");
      })
      .catch((loadError) => {
        if (!active) return;
        setVehicles([]);
        setError(loadError?.message || "Unable to load the fleet overview.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

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

        <FleetStats vehicles={vehicles} loading={loading} error={error} />

        <div className="grid gap-6">
            <FleetStatusGrid vehicles={vehicles} loading={loading} error={error} onRetry={loadFleet} />
        </div>

      </div>
    </DashboardLayout>
  );
}
