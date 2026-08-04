import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiDroplet,
  FiImage,
  FiInfo,
  FiTool,
  FiTruck,
} from "react-icons/fi";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getVehicleById } from "../../api/authApi";
import { useLanguage } from "../../context/useLanguage";
const STATUS_STYLES = {
  available: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  unavailable: "bg-red-50 text-red-700 ring-red-200",
  maintenance: "bg-amber-50 text-amber-700 ring-amber-200",
};
function valueOrDash(value) {
  return value === null || value === undefined || value === "" ? "—" : value;
}
function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
function Detail({ label, value, icon }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </div>
      <p className="mt-2 break-words font-semibold text-slate-800">
        {valueOrDash(value)}
      </p>
    </div>
  );
}
export default function DeputyVehicleDetails() {
  const { language } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  useEffect(() => {
    let active = true;
    const loadVehicle = async () => {
      try {
        const response = await getVehicleById(id);
        const selected = response?.data?.vehicle;
        if (!selected) throw new Error("Vehicle not found.");
        if (active) {
          setVehicle(selected);
          setSelectedImage(selected.image_urls?.[0] || selected.image_url || "");
        }
      } catch (loadError) {
        if (active)
          setError(loadError?.message || "Unable to load vehicle details.");
      }
    };
    loadVehicle();
    return () => {
      active = false;
    };
  }, [id]);
  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-red-700">{error}</p>
            <button
              onClick={() => navigate("/totalvehicles")}
              className="mt-5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Back to Fleet Inventory
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  if (!vehicle) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6 text-slate-500">
          Loading vehicle details…
        </div>
      </DashboardLayout>
    );
  }
  const status = String(vehicle.status || "unavailable").toLowerCase();
  const imageUrls = Array.isArray(vehicle.image_urls)
    ? vehicle.image_urls
    : vehicle.image_url
      ? [vehicle.image_url]
      : [];
  const fuelLevel = valueOrDash(vehicle.fuel_level);
  const seatCapacity = vehicle.seat_capacity ?? vehicle.seating_capacity;
  const licenceExpiry =
    vehicle.revenue_license_expiry || vehicle.registration_expiry;
  const serviceDetails = Array.isArray(vehicle.service_details)
    ? vehicle.service_details
    : [];
  const serviceTotal =
    vehicle.service_total_cost ??
    serviceDetails.reduce(
      (total, service) => total + (Number(service.cost) || 0),
      0,
    );
  const repairDetails = Array.isArray(vehicle.repair_details)
    ? vehicle.repair_details
    : [];
  const repairTotal = repairDetails.reduce(
    (total, repair) => total + (Number(repair.cost) || 0),
    0,
  );
  const fuelDetails = Array.isArray(vehicle.fuel_details)
    ? vehicle.fuel_details
    : [];
  const fuelTotal = fuelDetails.reduce(
    (total, fuel) => total + (Number(fuel.cost) || 0),
    0,
  );
  return (
    <DashboardLayout>
      <main className="min-h-screen bg-slate-50 p-6">
        <button
          onClick={() => navigate("/totalvehicles")}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          <FiArrowLeft /> Fleet Inventory
        </button>

        <header className="mt-4 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={`${vehicle.make || ""} ${vehicle.model || "Vehicle"}`}
                className="h-20 w-20 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <FiImage size={28} />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-blue-600">
                Vehicle ID: {valueOrDash(vehicle.id)}
              </p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                {valueOrDash(
                  [vehicle.make, vehicle.model].filter(Boolean).join(" "),
                )}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Registration: {valueOrDash(vehicle.registration_number)}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold capitalize ring-1 ring-inset ${STATUS_STYLES[status] || STATUS_STYLES.unavailable}`}
          >
            {status}
          </span>
        </header>

        {imageUrls.length > 1 && (
          <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4"><FiImage className="text-blue-600" /><h2 className="font-bold text-slate-900">Vehicle Image Gallery</h2></div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {imageUrls.map((url, index) => (
                <button type="button" key={`${url}-${index}`} onClick={() => setSelectedImage(url)} className={`overflow-hidden rounded-xl border-2 transition ${selectedImage === url ? "border-blue-500 ring-4 ring-blue-100" : "border-transparent hover:border-blue-200"}`}>
                  <img src={url} alt={`${vehicle.make || "Vehicle"} ${vehicle.model || ""} view ${index + 1}`} className="h-28 w-full object-cover" />
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <FiTruck className="text-blue-600" />
              <h2 className="font-bold text-slate-900">Vehicle Information</h2>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Detail label="Vehicle ID" value={vehicle.id} icon={<FiInfo />} />
              <Detail
                label="Registration Number"
                value={vehicle.registration_number}
                icon={<FiTruck />}
              />
              <Detail
                label="Chassis Number"
                value={vehicle.vin || vehicle.chassis_number}
                icon={<FiInfo />}
              />
              <Detail
                label="Model"
                value={[vehicle.make, vehicle.model].filter(Boolean).join(" ")}
                icon={<FiTruck />}
              />
              <Detail
                label="Manufactured Year"
                value={vehicle.manufacturing_year}
                icon={<FiCalendar />}
              />
              <Detail label="Colour" value={vehicle.color} icon={<FiInfo />} />
              <Detail
                label="Seat Capacity"
                value={seatCapacity}
                icon={<FiInfo />}
              />
              <Detail
                label="Vehicle Status"
                value={<span className="capitalize">{status}</span>}
                icon={<FiInfo />}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <FiDroplet className="text-cyan-600" />
              <h2 className="font-bold text-slate-900">Fuel and Compliance</h2>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Detail
                label="Fuel Type"
                value={vehicle.fuel_type}
                icon={<FiDroplet />}
              />
              <Detail
                label="Fuel Capacity"
                value={
                  vehicle.fuel_capacity == null
                    ? null
                    : `${vehicle.fuel_capacity} L`
                }
                icon={<FiDroplet />}
              />
              <Detail
                label="Fuel Level"
                value={fuelLevel === "—" ? fuelLevel : `${fuelLevel}%`}
                icon={<FiDroplet />}
              />
              <Detail
                label={
                  language === "si"
                    ? "ආදායම් බලපත්‍රයේ වලංගු කාලය අවසන් වන දිනය"
                    : "Licence Expire Date"
                }
                value={formatDate(licenceExpiry)}
                icon={<FiCalendar />}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <FiTool className="text-amber-600" />
                <div>
                  <h2 className="font-bold text-slate-900">Service Details</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Complete service history recorded by the Subject Officer.
                  </p>
                </div>
              </div>
              <div className="rounded-xl bg-blue-50 px-4 py-2 text-right">
                <p className="text-xs font-semibold uppercase text-blue-500">
                  Total Service Cost
                </p>
                <p className="font-bold text-blue-700">
                  LKR{" "}
                  {Number(serviceTotal).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
            {serviceDetails.length === 0 ? (
              <div className="mt-5 rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">
                No service records have been added for this vehicle.
              </div>
            ) : (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[650px]">
                  <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="rounded-l-xl px-4 py-3">#</th>
                      <th className="px-4 py-3">Service Date</th>
                      <th className="px-4 py-3">Service Type</th>
                      <th className="rounded-r-xl px-4 py-3 text-right">
                        Cost (LKR)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceDetails.map((service, index) => (
                      <tr
                        key={`${service.service_date}-${service.service_type}-${index}`}
                        className="border-b border-slate-100"
                      >
                        <td className="px-4 py-4 text-sm text-slate-400">
                          {index + 1}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-slate-700">
                          {formatDate(service.service_date)}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-700">
                          {valueOrDash(service.service_type)}
                        </td>
                        <td className="px-4 py-4 text-right text-sm font-semibold text-slate-800">
                          {Number(service.cost || 0).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <FiTool className="text-red-600" />
                <div>
                  <h2 className="font-bold text-slate-900">Repair Details</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Complete repair history recorded by the Subject Officer.
                  </p>
                </div>
              </div>
              <div className="rounded-xl bg-red-50 px-4 py-2 text-right">
                <p className="text-xs font-semibold uppercase text-red-500">
                  Total Repair Cost
                </p>
                <p className="font-bold text-red-700">
                  LKR{" "}
                  {repairTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
            {repairDetails.length === 0 ? (
              <div className="mt-5 rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">
                No repair records have been added for this vehicle.
              </div>
            ) : (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[650px]">
                  <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="rounded-l-xl px-4 py-3">#</th>
                      <th className="px-4 py-3">Repair Date</th>
                      <th className="px-4 py-3">Repair Type</th>
                      <th className="rounded-r-xl px-4 py-3 text-right">
                        Cost (LKR)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {repairDetails.map((repair, index) => (
                      <tr
                        key={`${repair.repair_date}-${repair.repair_type}-${index}`}
                        className="border-b border-slate-100"
                      >
                        <td className="px-4 py-4 text-sm text-slate-400">
                          {index + 1}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-slate-700">
                          {formatDate(repair.repair_date)}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-700">
                          {valueOrDash(repair.repair_type)}
                        </td>
                        <td className="px-4 py-4 text-right text-sm font-semibold text-slate-800">
                          {Number(repair.cost || 0).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <FiDroplet className="text-cyan-600" />
                <div>
                  <h2 className="font-bold text-slate-900">Fuel Details</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Complete fuel history recorded by the Subject Officer.
                  </p>
                </div>
              </div>
              <div className="rounded-xl bg-cyan-50 px-4 py-2 text-right">
                <p className="text-xs font-semibold uppercase text-cyan-600">
                  Total Fuel Cost
                </p>
                <p className="font-bold text-cyan-700">
                  LKR{" "}
                  {fuelTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
            {fuelDetails.length === 0 ? (
              <div className="mt-5 rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">
                No fuel records have been added for this vehicle.
              </div>
            ) : (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[750px]">
                  <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="rounded-l-xl px-4 py-3">#</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Fuel Type</th>
                      <th className="px-4 py-3 text-right">Capacity (L)</th>
                      <th className="rounded-r-xl px-4 py-3 text-right">
                        Cost (LKR)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fuelDetails.map((fuel, index) => (
                      <tr
                        key={`${fuel.date}-${fuel.fuel_type}-${index}`}
                        className="border-b border-slate-100"
                      >
                        <td className="px-4 py-4 text-sm text-slate-400">
                          {index + 1}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-slate-700">
                          {formatDate(fuel.date)}
                        </td>
                        <td className="px-4 py-4 text-sm capitalize text-slate-700">
                          {valueOrDash(fuel.fuel_type)}
                        </td>
                        <td className="px-4 py-4 text-right text-sm text-slate-700">
                          {Number(fuel.capacity || 0).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-4 text-right text-sm font-semibold text-slate-800">
                          {Number(fuel.cost || 0).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          Read-only vehicle information. Deputy officers cannot update these
          details.
        </p>
      </main>
    </DashboardLayout>
  );
}
