import { useEffect, useMemo, useState } from "react";
import { FiChevronDown, FiInfo, FiTruck, FiUser } from "react-icons/fi";
import DashboardLayout from "../../layouts/DashboardLayout";
import { DRIVERS } from "./DriverDetails";
import {
  allocateVehicleRequest,
  getApprovalVehicleRequest,
  getDrivers,
  getVehicles,
} from "../../api/authApi";
import { useParams } from "react-router-dom";
import RequestHeader from "../../components/deputySecretary/approvalWorkspace/RequestHeader";
import RequestOverview from "../../components/deputySecretary/approvalWorkspace/RequestOverview";
import ApprovalActions from "../../components/deputySecretary/approvalWorkspace/ApprovalActions";
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
              ? new Date(request.recommended_at).toLocaleString()
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
function DatabaseAllocationPanel({ onAllocationChange }) {
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
          getDrivers(),
          getVehicles(),
        ]);
        setDrivers(
          (driverResponse?.data?.drivers || []).filter(
            (driver) => driver.status === "available",
          ),
        );
        setVehicles(vehicleResponse?.data?.vehicles || []);
      } catch (loadError) {
        setError(loadError?.message || "Unable to load allocation data.");
      }
    };
    load();
  }, []);
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
          item.status === "available" ||
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
            <option value="">Select an available driver</option>
            {drivers.map((item) => (
              <option key={item.driver_id} value={item.driver_id}>
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
            <option value="">Select another available vehicle</option>
            {selectableVehicles.map((item) => (
              <option key={item.id} value={item.registration_number}>
                {item.make} {item.model} — {item.registration_number}
                {item.status !== "available" ? ` (${item.status})` : ""}
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
                <span className="capitalize">{vehicle.status}</span>
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
                ? new Date(request.allocated_at).toLocaleString()
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
                    ? new Date(request.approved_at).toLocaleString()
                    : "—"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
export default function ApprovalWorkspace() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [error, setError] = useState("");
  const [allocating, setAllocating] = useState(false);
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
            {allocated ? (
              <AllocatedVehicleDetails request={request} />
            ) : (
              <>
                <DatabaseAllocationPanel onAllocationChange={setAllocation} />
                <ApprovalActions
                  onAllocate={allocate}
                  allocating={allocating}
                  allocated={false}
                  allocationReady={Boolean(
                    allocation.driver_id && allocation.vehicle_id,
                  )}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
