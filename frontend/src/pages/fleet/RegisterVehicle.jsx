import DashboardLayout from "../../layouts/DashboardLayout";

import BasicInformation from "../../components/subjectOfficer/registerVehicle/BasicInformation";
import VehicleImageUpload from "../../components/subjectOfficer/registerVehicle/VehicleImageUpload";
import TechnicalSpecifications from "../../components/subjectOfficer/registerVehicle/TechnicalSpecifications";
import ComplianceRegulatory from "../../components/subjectOfficer/registerVehicle/ComplianceRegulatory";
import DeploymentStatus from "../../components/subjectOfficer/registerVehicle/DeploymentStatus";

import { FiSave } from "react-icons/fi";

export default function RegisterVehicle() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <div>
            <p className="text-sm text-gray-500">
              Fleet Dashboard &gt; Vehicle Directory &gt; Add New Vehicle
            </p>

            <h1 className="text-4xl font-bold mt-2">
              Register New Asset
            </h1>
          </div>

          <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
            ID: VMS-NEW-042
          </span>

        </div>

        <div className="grid lg:grid-cols-12 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-8 space-y-6">

            <BasicInformation />

            <TechnicalSpecifications />

            <ComplianceRegulatory />

          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4 space-y-6">

            <VehicleImageUpload />

            <DeploymentStatus />

            <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700">
              <FiSave />
              Save Vehicle Records
            </button>

            <button className="w-full border py-4 rounded-xl font-medium hover:bg-gray-50">
              Discard & Return
            </button>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}