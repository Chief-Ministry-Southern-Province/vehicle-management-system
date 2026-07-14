import { useEffect, useState } from "react";
import { FiCheckCircle, FiDroplet, FiImage, FiSave, FiTool, FiTruck } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getFleetVehicle, saveFleetVehicle } from "../../data/fleetVehicles";
import VehicleDatabaseDetails from "./VehicleDatabaseDetails";

const SERVICE_CATEGORIES = ["Public Works", "Secretary Works", "Ministerial Assignments", "Administrative Transport", "Protocol & VIP Movement", "General Fleet Pool"];
const REPAIR_TYPES = ["Routine service", "Oil and filter change", "Brake inspection", "Tyre replacement", "Engine repair", "Body repair", "Electrical repair"];

// Retained temporarily for reference while the route uses VehicleDatabaseDetails.
// eslint-disable-next-line no-unused-vars
function LegacyVehicleDetails() {
  const { registration } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(() => getFleetVehicle(registration));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setVehicle(getFleetVehicle(registration));
    setSaved(false);
  }, [registration]);

  if (!vehicle) {
    return <DashboardLayout><div className="min-h-screen bg-slate-50 p-6"><div className="rounded-2xl border border-slate-200 bg-white p-6"><h1 className="text-xl font-bold text-slate-900">Vehicle not found</h1><button onClick={() => navigate("/vehicledirectory")} className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Back to directory</button></div></div></DashboardLayout>;
  }

  const updateVehicle = (field, value) => { setVehicle((current) => ({ ...current, [field]: value })); setSaved(false); };
  const handleImageChange = (event) => { const file = event.target.files?.[0]; if (file) updateVehicle("image", URL.createObjectURL(file)); };
  const handleSave = () => { saveFleetVehicle(vehicle); setSaved(true); };
  const statusStyles = { Available: "bg-emerald-100 text-emerald-700", Unavailable: "bg-rose-100 text-rose-700", Maintenance: "bg-amber-100 text-amber-700" };

  return (
    <DashboardLayout>
      <div className="min-h-screen space-y-6 bg-slate-50 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-medium text-blue-600">Fleet operations</p><h1 className="mt-1 text-2xl font-bold text-slate-900">Update Vehicle Details</h1><p className="mt-1 text-sm text-slate-500">Maintain vehicle availability, service records, repair costs, and operational assignment.</p></div><button type="button" onClick={handleSave} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"><FiSave /> Save changes</button></div>
        {saved && <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"><FiCheckCircle /> Vehicle details updated in the directory.</div>}

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-bold text-slate-900">Vehicle image</h2><p className="mt-1 text-sm text-slate-500">Upload a current photograph for identification.</p><img src={vehicle.image} alt={vehicle.name} className="mt-5 h-56 w-full rounded-xl object-cover" /><label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100"><FiImage /> Change vehicle image<input type="file" accept="image/*" onChange={handleImageChange} className="hidden" /></label></section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2"><div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5"><div><h2 className="text-lg font-bold text-slate-900">Operational details</h2><p className="mt-1 text-sm text-slate-500">Used when allocating this vehicle.</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[vehicle.status]}`}>{vehicle.status}</span></div><div className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">Vehicle registration<input value={vehicle.reg} readOnly className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal text-slate-500 outline-none" /></label>
            <label className="text-sm font-semibold text-slate-700">Vehicle model<input value={vehicle.name} onChange={(event) => updateVehicle("name", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50" /></label>
            <label className="text-sm font-semibold text-slate-700">Vehicle status<select value={vehicle.status} onChange={(event) => updateVehicle("status", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"><option>Available</option><option>Unavailable</option><option>Maintenance</option></select></label>
            <label className="text-sm font-semibold text-slate-700">Last service date<input type="date" value={vehicle.lastServiceDate} onChange={(event) => updateVehicle("lastServiceDate", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50" /></label>
            <label className="text-sm font-semibold text-slate-700">Licence cancellation date<input type="date" value={vehicle.licenceCancellationDate} onChange={(event) => updateVehicle("licenceCancellationDate", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50" /></label>
            <label className="text-sm font-semibold text-slate-700">Service category<select value={vehicle.serviceCategory} onChange={(event) => updateVehicle("serviceCategory", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50">{SERVICE_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label className="text-sm font-semibold text-slate-700">Seat capacity<input type="number" min="1" max="100" value={vehicle.seatCapacity || ""} onChange={(event) => updateVehicle("seatCapacity", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50" /></label>
            <div><label htmlFor="fuel-level" className="text-sm font-semibold text-slate-700">Fuel level <span className="text-blue-600">{vehicle.fuelLevel}%</span></label><div className="mt-3 flex items-center gap-3"><FiDroplet className="text-blue-600" /><input id="fuel-level" type="range" min="0" max="100" value={vehicle.fuelLevel} onChange={(event) => updateVehicle("fuelLevel", Number(event.target.value))} className="w-full accent-blue-600" /></div></div>
          </div></section>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2 border-b border-slate-100 pb-4"><FiTool className="text-blue-600" /><div><h2 className="font-bold text-slate-900">Maintenance cost and repair details</h2><p className="mt-1 text-sm text-slate-500">Record the most recent repair or maintenance activity.</p></div></div><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4"><label className="text-sm font-semibold text-slate-700">Repair type<select value={vehicle.repairType} onChange={(event) => updateVehicle("repairType", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50">{REPAIR_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label><label className="text-sm font-semibold text-slate-700">Repair date<input type="date" value={vehicle.repairDate} onChange={(event) => updateVehicle("repairDate", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50" /></label><label className="text-sm font-semibold text-slate-700">Repair station<input value={vehicle.repairStation} onChange={(event) => updateVehicle("repairStation", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50" /></label><label className="text-sm font-semibold text-slate-700">Maintenance cost (LKR)<input type="number" min="0" value={vehicle.maintenanceCost} onChange={(event) => updateVehicle("maintenanceCost", Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50" /></label></div></section>
      </div>
    </DashboardLayout>
  );
}

export default VehicleDatabaseDetails;
