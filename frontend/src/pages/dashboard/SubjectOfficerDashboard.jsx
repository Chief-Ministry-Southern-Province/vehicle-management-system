import DashboardLayout from "../../layouts/DashboardLayout";
import FleetStats from "../../components/subjectOfficer/FleetStats";
import FleetStatusGrid from "../../components/subjectOfficer/FleetStatusGrid";
import { useLanguage } from "../../context/useLanguage";
export default function SubjectOfficerDashboard() {
  const { translate } = useLanguage();
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

        <div className="grid gap-6">
          <FleetStatusGrid />
        </div>
      </div>
    </DashboardLayout>
  );
}
