import { useMemo, useState } from "react";
import { FiCheckCircle, FiInfo, FiTruck, FiUser } from "react-icons/fi";
import DashboardLayout from "../../layouts/DashboardLayout";
import { RAW_VEHICLES } from "./TotalVehicle";
import { DRIVERS } from "./DriverDetails";

import RequestHeader from "../../components/deputySecretary/approvalWorkspace/RequestHeader";
import RequestOverview from "../../components/deputySecretary/approvalWorkspace/RequestOverview";
import ApprovalActions from "../../components/deputySecretary/approvalWorkspace/ApprovalActions";

const AVAILABLE_VEHICLES = RAW_VEHICLES.filter((vehicle) => vehicle.status === "Available");
const AVAILABLE_DRIVERS = DRIVERS.filter((driver) => driver.status === "Available");

function OfficerRecommendation() {
  return (
    <section className="overflow-hidden rounded-2xl border bg-white">
      <div className="border-b p-5">
        <h3 className="text-xl font-bold text-slate-900">Department Officer Recommendation</h3>
        <p className="mt-1 text-sm text-slate-500">Submitted by Ms. Nadeesha Perera, Department Officer</p>
      </div>
      <div className="p-6">
        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Priority level</dt><dd className="mt-1"><span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">High</span></dd></div>
        </dl>
        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Officer’s notice for this journey</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">Please ensure the assigned driver reports to the Ministry Central Gate by 7:30 AM, confirms the route with the security liaison, and keeps the vehicle available until the delegation returns at 6:00 PM.</p>
        </div>
      </div>
    </section>
  );
}

function AllocationPanel() {
  const [driverId, setDriverId] = useState("");
  const [vehicleRegistration, setVehicleRegistration] = useState("");
  const [defaultVehicleRegistration, setDefaultVehicleRegistration] = useState("");
  const selectedDriver = useMemo(() => AVAILABLE_DRIVERS.find((driver) => driver.id === driverId), [driverId]);
  const selectedVehicle = useMemo(() => AVAILABLE_VEHICLES.find((vehicle) => vehicle.registerNo === vehicleRegistration), [vehicleRegistration]);
  const isOverride = Boolean(defaultVehicleRegistration && vehicleRegistration !== defaultVehicleRegistration);

  const handleDriverChange = (event) => {
    const nextDriver = AVAILABLE_DRIVERS.find((driver) => driver.id === event.target.value);
    setDriverId(event.target.value);
    setDefaultVehicleRegistration(nextDriver?.registration || "");
    setVehicleRegistration(nextDriver?.registration || "");
  };

  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-5">
        <h3 className="text-xl font-bold text-slate-900">Vehicle Allocation</h3>
        <p className="mt-1 text-sm text-slate-500">Choose a driver first; their assigned vehicle is selected automatically.</p>
      </div>
      <div className="space-y-5 p-5">
        <div>
          <label htmlFor="allocation-driver" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"><FiUser className="text-blue-600" /> Driver</label>
          <select id="allocation-driver" value={driverId} onChange={handleDriverChange} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50">
            <option value="">Select an available driver</option>
            {AVAILABLE_DRIVERS.map((driver) => <option key={driver.id} value={driver.id}>{driver.fullName} — {driver.designation}</option>)}
          </select>
        </div>

        {selectedDriver && <div className="rounded-xl bg-slate-50 p-4 text-sm"><div className="flex justify-between gap-3"><div><p className="font-semibold text-slate-800">{selectedDriver.fullName}</p><p className="mt-1 text-slate-500">{selectedDriver.experience} experience · Rating {selectedDriver.rating}</p></div><span className="h-fit rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">{selectedDriver.status}</span></div></div>}

        <div>
          <label htmlFor="allocation-vehicle" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"><FiTruck className="text-blue-600" /> Allocated vehicle</label>
          <select id="allocation-vehicle" value={vehicleRegistration} onChange={(event) => setVehicleRegistration(event.target.value)} disabled={!driverId} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-50">
            <option value="">Select a vehicle</option>
            {AVAILABLE_VEHICLES.map((vehicle) => <option key={vehicle.id} value={vehicle.registerNo}>{vehicle.model} — {vehicle.registerNo}</option>)}
          </select>
          {driverId && <p className="mt-2 flex items-start gap-2 text-xs text-slate-500"><FiInfo className="mt-0.5 shrink-0" /> {isOverride ? "A different available vehicle has been selected for this driver." : "The driver’s registered vehicle is selected by default. Select another vehicle above if needed."}</p>}
        </div>

        {selectedVehicle && <div className="grid grid-cols-2 gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-sm"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Vehicle</p><p className="mt-1 font-semibold text-slate-800">{selectedVehicle.model}</p><p className="text-slate-500">{selectedVehicle.registerNo}</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Fleet details</p><p className="mt-1 font-semibold text-slate-800">{selectedVehicle.type} · {selectedVehicle.seats} seats</p><p className="text-slate-500">{selectedVehicle.fuel} · {selectedVehicle.status}</p></div></div>}
      </div>
    </section>
  );
}

export default function ApprovalWorkspace() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <RequestHeader />
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7"><RequestOverview /><OfficerRecommendation /></div>
          <div className="space-y-6 lg:col-span-5"><AllocationPanel /><ApprovalActions /></div>
        </div>
      </div>
    </DashboardLayout>
  );
}
