import DashboardLayout from "../../layouts/DashboardLayout";
import VehicleStats from "../../components/subjectOfficer/vehicleDirectory/VehicleStats";
import VehicleFilters from "../../components/subjectOfficer/vehicleDirectory/VehicleFilters";
import VehicleTable from "../../components/subjectOfficer/vehicleDirectory/VehicleTable";
import { FiDownload, FiPlus, FiTruck } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getVehicles } from "../../api/authApi";
export default function VehicleDirectory() {
  const navigate = useNavigate();
  const location = useLocation();
  const [vehicles, setVehicles] = useState([]);
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const response = await getVehicles();
        setVehicles(
          (response?.data?.vehicles || []).map((vehicle) => ({
            reg: vehicle.registration_number,
            name: `${vehicle.make} ${vehicle.model}`,
            year: vehicle.manufacturing_year || "—",
            type: vehicle.vehicle_type,
            status: vehicle.status
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
            lastServiceDate: vehicle.last_service_date,
            fuelLevel: vehicle.fuel_level,
          })),
        );
      } catch (error) {
        toast.error(error?.message || "Unable to load vehicles.");
      }
    };
    loadVehicles();
  }, [location.key]);
  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Premium Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FiTruck className="text-blue-600" />

                <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
                  Fleet Management
                </span>
              </div>

              <h1 className="mt-2 text-2xl font-bold text-slate-900">
                Vehicle Directory
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage and monitor all government fleet assets from a single
                location.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <FiDownload />
                Export CSV
              </button>

              <button
                onClick={() => navigate("/registervehicle")}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                <FiPlus />
                Add Vehicle
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <VehicleStats vehicles={vehicles} />

        {/* Directory Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <VehicleFilters />

          <VehicleTable
            vehicles={vehicles}
            onDelete={() =>
              toast.error("Vehicle deletion is not available yet.")
            }
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
