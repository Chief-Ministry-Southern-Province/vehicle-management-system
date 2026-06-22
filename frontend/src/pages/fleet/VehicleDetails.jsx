import DashboardLayout from "../../layouts/DashboardLayout";

import VehicleHeader from "../../components/subjectOfficer/vehicleDetails/VehicleHeader";
import VehicleTabs from "../../components/subjectOfficer/vehicleDetails/VehicleTabs";
import UtilizationChart from "../../components/subjectOfficer/vehicleDetails/UtilizationChart";
import TechnicalInfo from "../../components/subjectOfficer/vehicleDetails/TechnicalInfo";

export default function VehicleDetails() {
  return (
    <DashboardLayout>
      <div className="space-y-6">

        <VehicleHeader />

        <VehicleTabs />

        <div className="grid grid-cols-12 gap-6">

          <div className="col-span-12 xl:col-span-8">
            <UtilizationChart />
          </div>

          <div className="col-span-12 xl:col-span-4 space-y-5">
            <TechnicalInfo />
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}