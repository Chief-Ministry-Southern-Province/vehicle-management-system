import { useEffect, useState } from "react";
import { FiTruck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getDriverAssignedVehicle } from "../../../api/authApi";

const formatDate = (value) => value
  ? new Intl.DateTimeFormat("en-LK", { year: "numeric", month: "short", day: "2-digit" }).format(new Date(value))
  : "Not recorded";

export default function AssignedVehicle() {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getDriverAssignedVehicle()
      .then((response) => {
        if (active) setVehicle(response?.data?.vehicle || null);
      })
      .catch((requestError) => {
        if (active) setError(requestError?.message || "Unable to load assigned vehicle.");
      })
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, []);

  if (loading) {
    return <div className="rounded-2xl border bg-white p-8 text-center text-sm text-slate-500">Loading assigned vehicle...</div>;
  }

  if (error) {
    return <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700" role="alert">{error}</div>;
  }

  if (!vehicle) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center">
        <FiTruck className="mx-auto text-4xl text-slate-300" />
        <h3 className="mt-4 font-bold text-slate-800">No vehicle assigned</h3>
        <p className="mt-1 text-sm text-slate-500">Your allocated vehicle will appear here.</p>
      </div>
    );
  }

  const fuelLevel = Math.max(0, Math.min(100, Number(vehicle.fuel_level) || 0));

  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      {vehicle.image_url ? (
        <img src={vehicle.image_url} alt={`${vehicle.make} ${vehicle.model}`} className="h-52 w-full object-cover" />
      ) : (
        <div className="flex h-52 items-center justify-center bg-slate-100"><FiTruck className="text-6xl text-slate-300" /></div>
      )}

      <div className="p-5">
        <h3 className="text-2xl font-bold">{vehicle.make} {vehicle.model}</h3>
        <p className="text-slate-500">{vehicle.registration_number}</p>

        <div className="mt-5">
          <div className="mb-1 flex justify-between"><span>Fuel Level</span><span>{fuelLevel}%</span></div>
          <div className="h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-blue-600" style={{ width: `${fuelLevel}%` }} /></div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-slate-500">Vehicle Type</dt><dd className="font-bold text-slate-800">{vehicle.vehicle_type}</dd></div>
          <div><dt className="text-slate-500">Seat Capacity</dt><dd className="font-bold text-slate-800">{vehicle.seat_capacity || "Not recorded"}</dd></div>
          <div><dt className="text-slate-500">Fuel Type</dt><dd className="font-bold text-slate-800">{vehicle.fuel_type || "Not recorded"}</dd></div>
          <div><dt className="text-slate-500">Status</dt><dd className="font-bold capitalize text-slate-800">{vehicle.status}</dd></div>
          <div className="col-span-2"><dt className="text-slate-500">Revenue Licence Expiry</dt><dd className="font-bold text-slate-800">{formatDate(vehicle.revenue_license_expiry)}</dd></div>
        </dl>

        <button type="button" onClick={() => navigate("/reportvehicle")} className="mt-6 w-full rounded-xl border border-blue-200 py-3 font-semibold text-blue-600 hover:bg-blue-50">Report Vehicle Issue</button>
      </div>
    </div>
  );
}
