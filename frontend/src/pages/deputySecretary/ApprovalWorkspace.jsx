import { useEffect, useMemo, useState } from "react";
import { FiChevronDown, FiInfo, FiTruck, FiUser } from "react-icons/fi";
import DashboardLayout from "../../layouts/DashboardLayout";
import { DRIVERS } from "./DriverDetails";
import {
  allocateVehicleRequest,
  reallocateVehicleRequest,
  cancelMyVehicleRequest,
  getApprovalVehicleRequest,
  getDrivers,
  getVehicles,
} from "../../api/authApi";
import { useParams } from "react-router-dom";
import RequestHeader from "../../components/deputySecretary/approvalWorkspace/RequestHeader";
import RequestOverview from "../../components/deputySecretary/approvalWorkspace/RequestOverview";
import ApprovalActions from "../../components/deputySecretary/approvalWorkspace/ApprovalActions";
import { formatLocalDateTime } from "../../utils/dateTime";
const AVAILABLE_DRIVERS = DRIVERS.filter(
  (driver) => driver.status === "Available",
);
const PREVIOUS_JOURNEYS = {
  "DRV-0148": [
    {
      date: "09 Jul 2026",
      route: "Parliament Complex → Ministry of Foreign Affairs",
      purpose: "Diplomatic delegation transfer",
      distance: "38 km",
      status: "Completed",
    },
    {
      date: "05 Jul 2026",
      route: "Ministry Central Gate → Colombo Port",
      purpose: "Official site inspection",
      distance: "26 km",
      status: "Completed",
    },
    {
      date: "01 Jul 2026",
      route: "Colombo 07 → Bandaranaike Airport",
      purpose: "Protocol transfer",
      distance: "62 km",
      status: "Completed",
    },
  ],
  "DRV-0161": [
    {
      date: "08 Jul 2026",
      route: "Colombo Secretariat → Bandaranaike Airport",
      purpose: "Official airport transfer",
      distance: "64 km",
      status: "Completed",
    },
    {
      date: "03 Jul 2026",
      route: "Temple Trees → Ministry of Finance",
      purpose: "Inter-ministerial meeting",
      distance: "12 km",
      status: "Completed",
    },
    {
      date: "29 Jun 2026",
      route: "Colombo 03 → Battaramulla",
      purpose: "Committee meeting transport",
      distance: "18 km",
      status: "Completed",
    },
  ],
};
function OfficerRecommendation() {
  return (
    <section className="overflow-hidden rounded-2xl border bg-white">
      <div className="border-b p-5">
        <h3 className="text-xl font-bold text-slate-900">
          Department Officer Recommendation
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Submitted by Ms. Nadeesha Perera, Department Officer
        </p>
      </div>
      <div className="p-6">
        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Priority level
            </dt>
            <dd className="mt-1">
              <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">
                High
              </span>
            </dd>
          </div>
        </dl>
        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Officer’s notice for this journey
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Please ensure the assigned driver reports to the Ministry Central
            Gate by 7:30 AM, confirms the route with the security liaison, and
            keeps the vehicle available until the delegation returns at 6:00 PM.
          </p>
        </div>
      </div>
    </section>
  );
}
function AllocationPanel() {
  const [driverId, setDriverId] = useState("");
  const [vehicleRegistration, setVehicleRegistration] = useState("");
  const [defaultVehicleRegistration, setDefaultVehicleRegistration] =
    useState("");
  const [showPreviousJourneys, setShowPreviousJourneys] = useState(true);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [vehiclesError, setVehiclesError] = useState("");
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const response = await getVehicles();
        setAvailableVehicles(
          (response?.data?.vehicles || [])
            .filter((vehicle) => vehicle.status === "available")
            .map((vehicle) => ({
              id: vehicle.id,
              registerNo: vehicle.registration_number,
              model: `${vehicle.make} ${vehicle.model}`,
              type: vehicle.vehicle_type,
              fuel: vehicle.fuel_type || "—",
              fuelCapacity: vehicle.fuel_capacity ?? "—",
              status: "Available",
            })),
        );
      } catch (error) {
        setVehiclesError(
          error?.message || "Unable to load available vehicles.",
        );
      }
    };
    loadVehicles();
  }, []);
  const selectedDriver = useMemo(
    () => AVAILABLE_DRIVERS.find((driver) => driver.id === driverId),
    [driverId],
  );
  const selectedVehicle = useMemo(
    () =>
      availableVehicles.find(
        (vehicle) => vehicle.registerNo === vehicleRegistration,
      ),
    [availableVehicles, vehicleRegistration],
  );
  const previousJourneys = selectedDriver
    ? PREVIOUS_JOURNEYS[selectedDriver.id]
    : [];
  const isOverride = Boolean(
    defaultVehicleRegistration &&
    vehicleRegistration !== defaultVehicleRegistration,
  );
  const handleDriverChange = (event) => {
    const nextDriver = AVAILABLE_DRIVERS.find(
      (driver) => driver.id === event.target.value,
    );
    setDriverId(event.target.value);
    setDefaultVehicleRegistration(nextDriver?.registration || "");
    setVehicleRegistration(nextDriver?.registration || "");
    setShowPreviousJourneys(true);
  };
  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-5">
        <h3 className="text-xl font-bold text-slate-900">Vehicle Allocation</h3>
        <p className="mt-1 text-sm text-slate-500">
          Choose a driver first; their assigned vehicle is selected
          automatically.
        </p>
      </div>
      <div className="space-y-5 p-5">
        <div>
          <label
            htmlFor="allocation-driver"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
          >
            <FiUser className="text-blue-600" /> Driver
          </label>
          <select
            id="allocation-driver"
            value={driverId}
            onChange={handleDriverChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
          >
            <option value="">Select an available driver</option>
            {AVAILABLE_DRIVERS.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.fullName} — {driver.designation}
              </option>
            ))}
          </select>
        </div>

        {selectedDriver && (
          <>
            <div className="rounded-xl bg-slate-50 p-4 text-sm">
              <div className="flex justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800">
                    {selectedDriver.fullName}
                  </p>
                  <p className="mt-1 text-slate-500">
                    {selectedDriver.experience} experience · Rating{" "}
                    {selectedDriver.rating}
                  </p>
                </div>
                <span className="h-fit rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {selectedDriver.status}
                </span>
              </div>
            </div>
            {previousJourneys.length > 0 && (
              <div className="rounded-xl border border-slate-200 p-4 text-sm">
                <button
                  type="button"
                  onClick={() => setShowPreviousJourneys((visible) => !visible)}
                  className="flex w-full items-center justify-between gap-3 text-left font-semibold text-slate-800"
                >
                  <span>Previous journeys ({previousJourneys.length})</span>
                  <FiChevronDown
                    className={`shrink-0 text-slate-500 transition-transform ${showPreviousJourneys ? "rotate-180" : ""}`}
                  />
                </button>
                {showPreviousJourneys && (
                  <div className="mt-3 max-h-52 divide-y divide-slate-100 overflow-y-auto pr-2">
                    {previousJourneys.map((journey) => (
                      <div
                        key={`${journey.date}-${journey.route}`}
                        className="py-3 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-slate-800">
                              {journey.route}
                            </p>
                            <p className="mt-1 text-slate-500">
                              {journey.purpose}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {journey.status}
                          </span>
                        </div>
                        <div className="mt-2 flex gap-5 text-xs text-slate-500">
                          <span>{journey.date}</span>
                          <span>{journey.distance}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <div>
          <label
            htmlFor="allocation-vehicle"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
          >
            <FiTruck className="text-blue-600" /> Allocated vehicle
          </label>
          <select
            id="allocation-vehicle"
            value={vehicleRegistration}
            onChange={(event) => setVehicleRegistration(event.target.value)}
            disabled={!driverId}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
          >
            <option value="">Select a vehicle</option>
            {availableVehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.registerNo}>
                {vehicle.model} — {vehicle.registerNo}
              </option>
            ))}
          </select>
          {vehiclesError && (
            <p className="mt-2 text-xs text-red-600">{vehiclesError}</p>
          )}
          {driverId && (
            <p className="mt-2 flex items-start gap-2 text-xs text-slate-500">
              <FiInfo className="mt-0.5 shrink-0" />{" "}
              {isOverride
                ? "A different available vehicle has been selected for this driver."
                : "The driver’s registered vehicle is selected by default. Select another vehicle above if needed."}
            </p>
          )}
        </div>

        {selectedVehicle && (
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Vehicle
              </p>
              <p className="mt-1 font-semibold text-slate-800">
                {selectedVehicle.model}
              </p>
              <p className="text-slate-500">{selectedVehicle.registerNo}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Fleet details
              </p>
              <p className="mt-1 font-semibold text-slate-800">
                {selectedVehicle.type} · {selectedVehicle.fuelCapacity} L
              </p>
              <p className="text-slate-500">
                {selectedVehicle.fuel} · {selectedVehicle.status}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Retained temporarily while the database-backed workspace replaces the original layout.
// eslint-disable-next-line no-unused-vars
function LegacyApprovalWorkspace() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <RequestHeader />
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <RequestOverview />
            <OfficerRecommendation />
          </div>
          <div className="space-y-6 lg:col-span-5">
            <AllocationPanel />
            <ApprovalActions />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
function DatabaseRecommendation({ request }) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-white">
      <div className="border-b p-5">
        <h3 className="text-xl font-bold text-slate-900">
          Department Officer Recommendation
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {request.recommender
            ? `Submitted by ${request.recommender.name}`
            : "Not yet reviewed"}
        </p>
      </div>
      <div className="grid gap-5 p-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            Decision
          </p>
          <p className="mt-2 font-semibold capitalize">
            {request.recommendation_status || "pending"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            Priority
          </p>
          <p className="mt-2 font-semibold capitalize">
            {request.department_priority || "Not set"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            Recommended at
          </p>
          <p className="mt-2 text-sm">
            {request.recommended_at
              ? formatLocalDateTime(request.recommended_at)
              : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            Officer department
          </p>
          <p className="mt-2 text-sm">
            {request.recommender?.department || "—"}
          </p>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 sm:col-span-2">
          <p className="text-xs font-semibold uppercase text-blue-600">
            Recommendation notes
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
            {request.recommendation_notes || "No notes provided."}
          </p>
        </div>
      </div>
    </section>
  );
}
function DatabaseAllocationPanel({ onAllocationChange, request }) {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [driverId, setDriverId] = useState("");
  const [registeredVehicle, setRegisteredVehicle] = useState("");
  const [vehicleRegistration, setVehicleRegistration] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const load = async () => {
      try {
        const [driverResponse, vehicleResponse] = await Promise.all([
          getDrivers({
            departure_at: request.departure_at,
            expected_return_at: request.expected_return_at,
          }),
          getVehicles({
            departure_at: request.departure_at,
            expected_return_at: request.expected_return_at,
          }),
        ]);
        setDrivers(
          (driverResponse?.data?.drivers || []).filter(
            (driver) => driver.duty_status === "active",
          ),
        );
        setVehicles(vehicleResponse?.data?.vehicles || []);
      } catch (loadError) {
        setError(loadError?.message || "Unable to load allocation data.");
      }
    };
    load();
  }, [request.departure_at, request.expected_return_at]);
  const driver = useMemo(
    () => drivers.find((item) => item.driver_id === driverId),
    [driverId, drivers],
  );
  const vehicle = useMemo(
    () =>
      vehicles.find((item) => item.registration_number === vehicleRegistration),
    [vehicleRegistration, vehicles],
  );
  const selectableVehicles = useMemo(
    () =>
      vehicles.filter(
        (item) =>
          ["available", "scheduled_trip"].includes(item.status) ||
          item.registration_number === registeredVehicle,
      ),
    [registeredVehicle, vehicles],
  );
  useEffect(() => {
    onAllocationChange({
      driver_id: driver?.id || null,
      vehicle_id: vehicle?.id || null,
    });
  }, [driver, onAllocationChange, vehicle]);
  const changeDriver = (event) => {
    const id = event.target.value;
    const nextDriver = drivers.find((item) => item.driver_id === id);
    const allocation = nextDriver?.allocated_vehicle || "";
    setDriverId(id);
    setRegisteredVehicle(allocation);
    setVehicleRegistration(allocation);
  };
  const statusLabel = (status) =>
    ({
      available: "Available",
      scheduled_trip: "Scheduled Trip",
      ongoing_trip: "Ongoing Trip",
      unavailable: "Unavailable",
    })[status] || status;
  const previousJourneysPanel = driver ? (
    <section className="overflow-hidden rounded-xl border border-slate-200">
      <div className="border-b bg-slate-50 px-4 py-3">
        <h4 className="font-semibold text-slate-800">Previous Journeys</h4>
        <p className="mt-1 text-xs text-slate-500">
          Journey history for {driver.full_name}
        </p>
      </div>
      {Array.isArray(driver.previous_journeys) &&
      driver.previous_journeys.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {driver.previous_journeys.map((journey, index) => (
            <article
              key={`${journey.date}-${journey.destination}-${index}`}
              className="p-4 text-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800">
                    {journey.origin} → {journey.destination}
                  </p>
                  <p className="mt-1 text-slate-500">{journey.purpose}</p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold capitalize text-emerald-700">
                  {journey.status}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                <span>{new Date(journey.date).toLocaleDateString()}</span>
                <span>
                  Vehicle: {journey.vehicle_registration || "Not recorded"}
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="p-5 text-center text-sm text-slate-500">
          No previous journeys recorded for this driver.
        </p>
      )}
    </section>
  ) : null;
  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-5">
        <h3 className="text-xl font-bold">Vehicle Allocation</h3>
        <p className="mt-1 text-sm text-slate-500">
          The driver’s allocated vehicle is selected automatically. Another
          available vehicle can be selected.
        </p>
      </div>
      <div className="space-y-5 p-5">
        <label className="block text-sm font-semibold">
          <span className="mb-2 flex items-center gap-2">
            <FiUser className="text-blue-600" />
            Driver
          </span>
          <select
            value={driverId}
            onChange={changeDriver}
            className="w-full rounded-xl border px-3 py-3 font-normal"
          >
            <option value="">Select a driver</option>
            {drivers.map((item) => (
              <option
                key={item.driver_id}
                value={item.driver_id}
                disabled={!item.available_for_slot}
              >
                {statusLabel(item.status_for_slot || item.status)} —{" "}
                {item.full_name} — {item.driver_id}
              </option>
            ))}
          </select>
        </label>
        {driver && (
          <div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase text-slate-400">Licence</p>
              <p className="font-semibold">
                {driver.licence_number} · {driver.licence_type}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400">
                Status for requested time
              </p>
              <p className="font-semibold">
                {statusLabel(driver.status_for_slot || driver.status)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400">Contact</p>
              <p>{driver.contact_number}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs uppercase text-slate-400">
                Registered vehicle
              </p>
              <p>{driver.allocated_vehicle || "No vehicle allocated"}</p>
            </div>
          </div>
        )}
        <label className="block text-sm font-semibold">
          <span className="mb-2 flex items-center gap-2">
            <FiTruck className="text-blue-600" />
            Vehicle
          </span>
          <select
            value={vehicleRegistration}
            onChange={(event) => setVehicleRegistration(event.target.value)}
            disabled={!driverId}
            className="w-full rounded-xl border px-3 py-3 font-normal disabled:bg-slate-100"
          >
            <option value="">Select an available or scheduled vehicle</option>
            {selectableVehicles.map((item) => (
              <option
                key={item.id}
                value={item.registration_number}
                disabled={item.available_for_slot === false}
              >
                {item.make} {item.model} — {item.registration_number}
                {` (${statusLabel(item.status)})`}
              </option>
            ))}
          </select>
        </label>
        {driverId && (
          <p className="flex gap-2 text-xs text-slate-500">
            <FiInfo />
            {vehicleRegistration && vehicleRegistration !== registeredVehicle
              ? "A different vehicle is selected."
              : registeredVehicle
                ? "The driver’s allocated vehicle was selected automatically."
                : "Select an available vehicle for this driver."}
          </p>
        )}
        {vehicle && (
          <div className="grid gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase text-slate-400">Vehicle</p>
              <p className="font-semibold">
                {vehicle.make} {vehicle.model}
              </p>
              <p>{vehicle.registration_number}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400">
                Vehicle details
              </p>
              <p>
                {vehicle.vehicle_type} · {vehicle.seat_capacity || "—"} seats
              </p>
              <p>
                {vehicle.fuel_type || "—"} · {vehicle.fuel_capacity || "—"} L ·{" "}
                <span>{statusLabel(vehicle.status)}</span>
              </p>
            </div>
          </div>
        )}
        {previousJourneysPanel}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </section>
  );
}
function AllocatedVehicleDetails({ request }) {
  const vehicle = request.allocated_vehicle;
  const driver = request.allocated_driver;
  if (!vehicle || !driver)
    return (
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
        The saved vehicle or driver record is unavailable.
      </section>
    );
  return (
    <section className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
      <div className="border-b border-emerald-100 bg-emerald-50 p-5">
        <h3 className="text-xl font-bold">Allocated Vehicle and Driver</h3>
        <p className="mt-1 text-sm text-slate-600">
          Saved database details for this request.
        </p>
      </div>
      <div className="space-y-5 p-5">
        <div className="grid gap-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase text-slate-400">Vehicle</p>
            <p className="mt-1 font-bold">
              {vehicle.make} {vehicle.model}
            </p>
            <p>{vehicle.registration_number}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-400">Vehicle details</p>
            <p className="mt-1">
              {vehicle.vehicle_type} · {vehicle.seat_capacity || "—"} seats
            </p>
            <p className="capitalize">
              {vehicle.fuel_type || "—"} · {vehicle.status}
            </p>
          </div>
        </div>
        <div className="grid gap-4 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase text-slate-400">Driver</p>
            <p className="mt-1 font-bold">{driver.full_name}</p>
            <p>{driver.driver_id}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-400">
              Contact and identity
            </p>
            <p className="mt-1">{driver.contact_number}</p>
            <p>NIC: {driver.nic}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-400">Licence</p>
            <p className="mt-1">
              {driver.licence_number} · {driver.licence_type}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-400">Status</p>
            <p className="mt-1 capitalize">
              {request.status?.replaceAll("_", " ")}
            </p>
          </div>
        </div>
        <div className="grid gap-4 border-t pt-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase text-slate-400">Allocated by</p>
            <p className="mt-1">{request.allocator?.name || "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-400">Allocated at</p>
            <p className="mt-1">
              {request.allocated_at
                ? formatLocalDateTime(request.allocated_at)
                : "—"}
            </p>
          </div>
          {request.status === "approved" && (
            <>
              <div>
                <p className="text-xs uppercase text-slate-400">
                  Finally approved by
                </p>
                <p className="mt-1">{request.approver?.name || "—"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">Approved at</p>
                <p className="mt-1">
                  {request.approved_at
                    ? formatLocalDateTime(request.approved_at)
                    : "—"}
                </p>
              </div>
            </>
          )}
        </div>
        {request.reallocation_reason && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
              Vehicle re-allocation reason
            </p>
            <p className="mt-2 text-slate-800">{request.reallocation_reason}</p>
            <p className="mt-2 text-xs text-slate-500">
              Changed from driver{" "}
              {request.previous_allocated_driver?.full_name ||
                "the previous driver"}{" "}
              and vehicle{" "}
              {request.previous_allocated_vehicle?.registration_number ||
                "the previous vehicle"}{" "}
              by {request.reallocator?.name || "the Assistance Secreatry"} on{" "}
              {formatLocalDateTime(request.reallocated_at)}. Fresh final
              approval is required.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function VehicleReallocationPanel({ request, onReallocate, submitting }) {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [registeredVehicleId, setRegisteredVehicleId] = useState("");
  const [changeVehicle, setChangeVehicle] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const schedule = {
      departure_at: request.departure_at,
      expected_return_at: request.expected_return_at,
      ignore_request_id: request.id,
    };
    Promise.all([getVehicles(schedule), getDrivers(schedule)])
      .then(([vehicleResponse, driverResponse]) => {
        setVehicles(vehicleResponse?.data?.vehicles || []);
        setDrivers(driverResponse?.data?.drivers || []);
      })
      .catch((loadError) =>
        setError(
          loadError?.message ||
            "Unable to load replacement drivers and vehicles.",
        ),
      );
  }, [request.departure_at, request.expected_return_at, request.id]);

  const replacements = vehicles.filter(
    (vehicle) =>
      vehicle.id !== request.allocated_vehicle_id &&
      ["available", "scheduled_trip"].includes(vehicle.status) &&
      vehicle.available_for_slot !== false,
  );
  const replacementDrivers = drivers.filter(
    (driver) =>
      driver.id !== request.allocated_driver_id &&
      driver.duty_status === "active" &&
      !["unavailable", "inactive"].includes(
        String(driver.status_for_slot || driver.status || "").toLowerCase(),
      ),
  );
  const selectedDriver = drivers.find(
    (driver) => driver.id === Number(driverId),
  );
  const selectedVehicle = vehicles.find(
    (vehicle) => vehicle.id === Number(vehicleId),
  );
  const selectDriver = (event) => {
    const nextDriverId = event.target.value;
    const nextDriver = drivers.find(
      (driver) => driver.id === Number(nextDriverId),
    );
    const registeredVehicle = replacements.find(
      (vehicle) =>
        vehicle.registration_number === nextDriver?.allocated_vehicle,
    );

    setDriverId(nextDriverId);
    setRegisteredVehicleId(
      registeredVehicle ? String(registeredVehicle.id) : "",
    );
    setVehicleId(registeredVehicle ? String(registeredVehicle.id) : "");
    setChangeVehicle(!registeredVehicle);
  };
  const statusLabel = (status) =>
    String(status || "Not recorded").replaceAll("_", " ");

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
      <div className="border-b border-amber-100 bg-amber-50 p-5">
        <h3 className="text-xl font-bold text-slate-900">
          Re-allocate Driver and Vehicle
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Replace both assignments before the journey begins. The previous
          driver and vehicle will be released, and fresh final approval will be
          required.
        </p>
      </div>
      <div className="space-y-4 p-5">
        <label className="block text-sm font-semibold text-slate-700">
          Replacement driver
          <select
            value={driverId}
            onChange={selectDriver}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal"
          >
            <option value="">Select a replacement driver</option>
            {replacementDrivers.map((driver) => (
              <option
                key={driver.id}
                value={driver.id}
                disabled={driver.available_for_slot === false}
              >
                {driver.full_name} — {driver.driver_id} (
                {statusLabel(driver.status_for_slot || driver.status)})
              </option>
            ))}
          </select>
        </label>
        {selectedDriver && (
          <>
            <div className="grid gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Driver
                </p>
                <p className="mt-1 font-bold text-slate-900">
                  {selectedDriver.full_name}
                </p>
                <p className="text-slate-600">{selectedDriver.driver_id}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Driver status
                </p>
                <p className="mt-1 font-semibold capitalize text-slate-800">
                  {statusLabel(
                    selectedDriver.status_for_slot || selectedDriver.status,
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Licence
                </p>
                <p className="mt-1 text-slate-800">
                  {selectedDriver.licence_number} ·{" "}
                  {selectedDriver.licence_type}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Contact
                </p>
                <p className="mt-1 text-slate-800">
                  {selectedDriver.contact_number || "Not recorded"}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Driver’s registered vehicle
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {registeredVehicleId
                      ? "Selected automatically."
                      : "No available registered vehicle was found for this journey."}
                  </p>
                </div>
                {registeredVehicleId && (
                  <button
                    type="button"
                    onClick={() => {
                      const overriding = !changeVehicle;
                      setChangeVehicle(overriding);
                      setVehicleId(overriding ? "" : registeredVehicleId);
                    }}
                    className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                  >
                    {changeVehicle
                      ? "Use registered vehicle"
                      : "Choose a different vehicle"}
                  </button>
                )}
              </div>

              {(changeVehicle || !registeredVehicleId) && (
                <label className="mt-4 block text-sm font-semibold text-slate-700">
                  Replacement vehicle
                  <select
                    value={vehicleId}
                    onChange={(event) => setVehicleId(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal"
                  >
                    <option value="">Select a different available vehicle</option>
                    {replacements.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.make} {vehicle.model} —{" "}
                        {vehicle.registration_number} (
                        {statusLabel(vehicle.status)})
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          </>
        )}

        {selectedVehicle && (
          <div className="grid gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Vehicle
              </p>
              <p className="mt-1 font-bold text-slate-900">
                {selectedVehicle.make} {selectedVehicle.model}
              </p>
              <p className="text-slate-600">
                {selectedVehicle.registration_number}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Vehicle status
              </p>
              <p className="mt-1 font-semibold capitalize text-slate-800">
                {statusLabel(selectedVehicle.status)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Seat capacity
              </p>
              <p className="mt-1 font-semibold text-slate-800">
                {selectedVehicle.seat_capacity || "Not recorded"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Fuel level
              </p>
              <p className="mt-1 font-semibold text-slate-800">
                {selectedVehicle.fuel_level == null
                  ? "Not recorded"
                  : `${selectedVehicle.fuel_level}%`}
              </p>
            </div>
          </div>
        )}

        {selectedDriver && (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="border-b bg-slate-50 px-4 py-3">
              <h4 className="font-semibold text-slate-800">
                Driver Previous Journeys
              </h4>
              <p className="mt-1 text-xs text-slate-500">
                Recent journey history for {selectedDriver.full_name}
              </p>
            </div>
            {Array.isArray(selectedDriver.previous_journeys) &&
            selectedDriver.previous_journeys.length > 0 ? (
              <div className="max-h-64 divide-y divide-slate-100 overflow-y-auto">
                {selectedDriver.previous_journeys.map((journey, index) => (
                  <article
                    key={`${journey.date}-${journey.destination}-${index}`}
                    className="p-4 text-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {journey.origin || "Origin not recorded"} →{" "}
                          {journey.destination || "Destination not recorded"}
                        </p>
                        <p className="mt-1 text-slate-500">
                          {journey.purpose || "Purpose not recorded"}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold capitalize text-emerald-700">
                        {journey.status || "Completed"}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>
                        {journey.date
                          ? new Date(journey.date).toLocaleDateString()
                          : "Date not recorded"}
                      </span>
                      <span>
                        Vehicle:{" "}
                        {journey.vehicle_registration || "Not recorded"}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="p-5 text-center text-sm text-slate-500">
                No previous journeys recorded for this driver.
              </p>
            )}
          </div>
        )}
        <label className="block text-sm font-semibold text-slate-700">
          Reason for re-allocation <span className="text-red-600">*</span>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={4}
            maxLength={2000}
            required
            placeholder="Describe why the currently assigned driver and vehicle must be changed."
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="button"
          disabled={submitting || !driverId || !vehicleId || !reason.trim()}
          onClick={() =>
            onReallocate({
              vehicle_id: Number(vehicleId),
              driver_id: Number(driverId),
              reason: reason.trim(),
            })
          }
          className="w-full rounded-xl bg-amber-600 px-4 py-3 font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Re-allocating..."
            : "Re-allocate both and request fresh approval"}
        </button>
      </div>
    </section>
  );
}
export default function ApprovalWorkspace() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [error, setError] = useState("");
  const [allocating, setAllocating] = useState(false);
  const [reallocating, setReallocating] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [allocationMessage, setAllocationMessage] = useState("");
  const [allocation, setAllocation] = useState({
    driver_id: null,
    vehicle_id: null,
  });
  useEffect(() => {
    const load = async () => {
      try {
        const response = await getApprovalVehicleRequest(id);
        setRequest(response?.data?.vehicle_request || false);
      } catch (loadError) {
        setError(loadError?.message || "Unable to load request details.");
        setRequest(false);
      }
    };
    load();
  }, [id]);
  const allocate = async () => {
    if (!allocation.driver_id || !allocation.vehicle_id) {
      setAllocationMessage(
        "Select both a driver and a vehicle before allocating this request.",
      );
      return;
    }
    setAllocating(true);
    setAllocationMessage("");
    try {
      const response = await allocateVehicleRequest(id, allocation);
      const updatedRequest = response?.data?.vehicle_request;
      if (updatedRequest) setRequest(updatedRequest);
      setAllocationMessage(
        response?.message || "Vehicle allocated successfully.",
      );
    } catch (allocationError) {
      setAllocationMessage(
        allocationError?.message || "Unable to allocate the vehicle.",
      );
    } finally {
      setAllocating(false);
    }
  };
  const cancelRequest = async () => {
    if (
      !window.confirm(
        "Cancel this vehicle request? Any allocated driver and vehicle will be released.",
      )
    ) {
      return;
    }

    setCancelling(true);
    setAllocationMessage("");
    try {
      const response = await cancelMyVehicleRequest(id);
      const updatedRequest = response?.data?.vehicle_request;
      if (updatedRequest) setRequest(updatedRequest);
      setAllocationMessage(response?.message || "Request cancelled successfully.");
    } catch (cancelError) {
      setAllocationMessage(
        cancelError?.message || "Unable to cancel this request.",
      );
    } finally {
      setCancelling(false);
    }
  };
  const reallocate = async (payload) => {
    setReallocating(true);
    setAllocationMessage("");
    try {
      const response = await reallocateVehicleRequest(id, payload);
      const updatedRequest = response?.data?.vehicle_request;
      if (updatedRequest) setRequest(updatedRequest);
      setAllocationMessage(
        response?.message || "Vehicle re-allocated successfully.",
      );
    } catch (reallocationError) {
      setAllocationMessage(
        reallocationError?.message || "Unable to re-allocate the vehicle.",
      );
    } finally {
      setReallocating(false);
    }
  };
  if (request === null)
    return (
      <DashboardLayout>
        <div className="p-6 text-slate-500">Loading request details...</div>
      </DashboardLayout>
    );
  if (request === false)
    return (
      <DashboardLayout>
        <div className="m-6 rounded-xl border border-red-100 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      </DashboardLayout>
    );
  const allocated = ["vehicle_allocated", "approved"].includes(request.status);
  const cancelled = request.status === "cancelled";
  const completed = request.status === "completed";
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <RequestHeader request={request} />
        {allocationMessage && (
          <div
            className={`mt-4 rounded-xl border px-4 py-3 text-sm font-medium ${allocated ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}
          >
            {allocationMessage}
          </div>
        )}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <RequestOverview request={request} />
            <DatabaseRecommendation request={request} />
          </div>
          <div className="space-y-6 lg:col-span-5">
            {cancelled || completed ? (
              <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 text-slate-700">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                    ×
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">
                      {cancelled ? "Request Cancelled" : "Journey Complete"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      This request cannot be allocated or processed further.
                    </p>
                  </div>
                </div>
              </section>
            ) : allocated ? (
              <>
                <AllocatedVehicleDetails request={request} />
                {!request.journey_started_at &&
                  !["ongoing", "issue", "completed"].includes(
                    request.journey_status,
                  ) && (
                    <VehicleReallocationPanel
                      request={request}
                      onReallocate={reallocate}
                      submitting={reallocating}
                    />
                  )}
                <ApprovalActions
                  onAllocate={allocate}
                  allocating={allocating}
                  allocated
                  allocationReady
                  onCancel={cancelRequest}
                  cancelling={cancelling}
                />
              </>
            ) : (
              <>
                <DatabaseAllocationPanel onAllocationChange={setAllocation} request={request} />
                <ApprovalActions
                  onAllocate={allocate}
                  allocating={allocating}
                  allocated={false}
                  allocationReady={Boolean(
                    allocation.driver_id && allocation.vehicle_id,
                  )}
                  onCancel={cancelRequest}
                  cancelling={cancelling}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
