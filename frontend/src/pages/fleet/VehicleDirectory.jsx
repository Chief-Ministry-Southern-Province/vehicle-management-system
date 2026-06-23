import DashboardLayout from "../../layouts/DashboardLayout";

import VehicleStats from "../../components/subjectOfficer/vehicleDirectory/VehicleStats";
import VehicleFilters from "../../components/subjectOfficer/vehicleDirectory/VehicleFilters";
import VehicleTable from "../../components/subjectOfficer/vehicleDirectory/VehicleTable";

import {
  FiDownload,
  FiPlus,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function VehicleDirectory() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-start">

          <div>
            <h1 className="text-4xl font-bold">
              Vehicle Directory
            </h1>

            <p className="text-gray-500 mt-2">
              Manage and monitor all government fleet assets in one place.
            </p>
          </div>

          <div className="flex gap-3">

            <button className="flex items-center gap-2 border px-5 py-3 rounded-xl hover:bg-gray-50">
              <FiDownload />
              Export CSV
            </button>

            <button 
                onClick={() => navigate('/registervehicle')}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700">
              <FiPlus />
              Add New Vehicle
            </button>

          </div>

        </div>

        <VehicleStats />

        <div className="bg-white border rounded-2xl overflow-hidden">
          <VehicleFilters />
          <VehicleTable />
        </div>

      </div>
    </DashboardLayout>
  );
}