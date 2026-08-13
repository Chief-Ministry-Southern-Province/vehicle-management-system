import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle, FiCheckCircle, FiEye, FiMapPin, FiNavigation, FiPlay, FiTruck, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getDriverScheduledJourneys, updateDriverJourneyStatus } from "../../../api/authApi";
import { formatLocalDate as formatDate, formatLocalTime as formatTime } from "../../../utils/dateTime";
import LocationMapPicker from "../../employee/LocationMapPicker";

const statusStyle = {
  Pending: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
  Ongoing: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200",
  Issue: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200",
};

const Detail = ({ label, children }) => (
  <div>
    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</dt>
    <dd className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">{children || "Not recorded"}</dd>
  </div>
);

const routeDistance = (distance) => {
  if (distance == null || distance === "") return "Distance not available";
  const numericDistance = Number(distance);
  return Number.isFinite(numericDistance) ? `${numericDistance.toFixed(2)} km` : "Distance not available";
};

const routePoint = (latitude, longitude) => {
  const lat = Number(latitude);
  const lng = Number(longitude);
  return latitude != null && longitude != null && Number.isFinite(lat) && Number.isFinite(lng)
    ? { lat, lng }
    : null;
};

const VehicleImage = ({ vehicle, className = "h-44 sm:h-52" }) => (
  <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${className}`}>
    {vehicle?.image_url ? (
      <img
        src={vehicle.image_url}
        alt={`${vehicle.make || "Assigned"} ${vehicle.model || "vehicle"}`}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.display = "none";
          event.currentTarget.nextElementSibling?.classList.remove("hidden");
        }}
      />
    ) : null}
    <div className={`${vehicle?.image_url ? "hidden" : ""} flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400`}>
      <FiTruck className="text-4xl" />
      <span className="text-sm font-semibold">Vehicle image not available</span>
    </div>
    {vehicle && (
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950/85 to-transparent px-4 pb-3 pt-10 text-white">
        <p className="font-bold">{vehicle.make} {vehicle.model}</p>
        <p className="text-xs text-slate-200">{vehicle.registration_number}</p>
      </div>
    )}
  </div>
);

export default function ScheduledJourney() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getDriverScheduledJourneys()
      .then((response) => active && setTrips(response?.data?.trips || []))
      .catch((requestError) => active && setError(requestError?.message || "Unable to load scheduled journeys."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const changeStatus = async (trip) => {
    const action = ["ongoing", "issue"].includes(trip.journey_status) ? "complete" : "start";
    setUpdatingId(trip.id);
    try {
      const response = await updateDriverJourneyStatus(trip.id, action);
      if (action === "complete") {
        setTrips((current) => current.filter((item) => item.id !== trip.id));
        setSelectedTrip(null);
      } else {
        setTrips((current) => current.map((item) => item.id === trip.id ? response.data.trip : item));
      }
      toast.success(response.message);
    } catch (requestError) {
      toast.error(requestError?.message || "Unable to update the trip.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-[18px] border border-slate-100 bg-white/80 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)] backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-linear-to-r from-white to-blue-50/60 p-4 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Active Assignments
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Scheduled Journey</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">All incomplete trips assigned to you.</p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
          {trips.length} Active
        </span>
      </div>

      <div className="p-3 sm:p-6">
        {loading && <p className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">Loading journeys...</p>}
        {error && <p className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</p>}
        {!loading && !error && trips.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            No incomplete journeys are scheduled.
          </p>
        )}

        <div className="space-y-4">
          {trips.map((trip) => (
            <article
              key={trip.id}
              className={`group relative overflow-hidden rounded-[18px] border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-20px_rgba(15,23,42,0.22)] dark:border-slate-700 ${
                trip.status === "Ongoing"
                  ? "border-blue-200 bg-blue-50/60 dark:bg-blue-950/30"
                  : "border-slate-100 bg-white dark:bg-slate-900"
              }`}
            >
              <div className="lg:hidden">
                <VehicleImage vehicle={trip.vehicle} />
              </div>
              <div className="absolute inset-y-0 right-0 hidden w-80 border-l border-slate-100 lg:block dark:border-slate-700 xl:w-96">
                <VehicleImage vehicle={trip.vehicle} className="h-full" />
              </div>

              <div className="flex flex-wrap items-start justify-between gap-3 p-4 pb-0 sm:p-5 sm:pb-0 lg:mr-80 xl:mr-96">
                <div>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{trip.reference}</p>
                  <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{trip.purpose}</h3>
                  {trip.is_consolidated && <p className="mt-1 text-sm font-semibold text-emerald-700">One trip covering {trip.request_count} requests</p>}
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[trip.status] || "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
                  {trip.status}
                </span>
              </div>

              <div className="mx-4 mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white sm:mx-5 sm:mt-5 lg:mr-[21.25rem] xl:mr-[25.25rem] dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-linear-to-r from-blue-50 to-indigo-50/70 px-4 py-3 dark:border-slate-700 dark:from-blue-950/50 dark:to-indigo-950/30">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300"><FiNavigation /> Journey route</p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-200">{routeDistance(trip.distance_km)}</span>
                </div>
                <div className="grid gap-4 p-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <div className="flex items-start gap-3"><span className="mt-0.5 rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950"><FiMapPin /></span><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Starting location</p><p className="mt-1 break-words text-sm font-bold text-slate-900 dark:text-white">{trip.starting_location || "Starting location not recorded"}</p></div></div>
                  <span className="hidden h-px w-10 bg-slate-300 sm:block dark:bg-slate-600" />
                  <div className="flex items-start gap-3"><span className="mt-0.5 rounded-xl bg-rose-50 p-2.5 text-rose-600 dark:bg-rose-950"><FiMapPin /></span><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Ending location</p><p className="mt-1 break-words text-sm font-bold text-slate-900 dark:text-white">{trip.destination || "Ending location not recorded"}</p></div></div>
                </div>
                {trip.route_geometry?.length > 0 && (
                  <div className="border-t border-slate-100 p-3 dark:border-slate-700">
                    <LocationMapPicker
                      start={routePoint(trip.starting_latitude, trip.starting_longitude)}
                      end={routePoint(trip.destination_latitude, trip.destination_longitude)}
                      routeCoordinates={trip.route_geometry}
                      readOnly
                    />
                  </div>
                )}
              </div>

              <dl className="mx-4 mt-4 grid gap-x-5 gap-y-4 rounded-2xl bg-slate-50/70 p-4 sm:mx-5 sm:grid-cols-2 lg:mr-[21.25rem] lg:grid-cols-3 xl:mr-[25.25rem] dark:bg-slate-800/70">
                <Detail label="Requester">{trip.requester_name}</Detail>
                <Detail label="Purpose">{trip.purpose}</Detail>
                <Detail label="Date">{formatDate(trip.departure_at)}</Detail>
                <Detail label="Time">{formatTime(trip.departure_at)} - {formatTime(trip.expected_return_at)}</Detail>
                <Detail label="Number of Passengers">{trip.passenger_count}</Detail>
                <Detail label="Journey Status">{trip.status}</Detail>
                <Detail label="Vehicle Type">{trip.vehicle?.vehicle_type}</Detail>
                <Detail label="Vehicle Number">{trip.vehicle?.registration_number}</Detail>
                <Detail label="Parking Location">{trip.parking_location}</Detail>
                {trip.reallocation_reason && (
                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/40">
                    <Detail label="Vehicle re-allocation reason">
                      {trip.reallocation_reason}
                    </Detail>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Previous vehicle:{" "}
                      {trip.previous_vehicle?.registration_number || "Not recorded"}
                    </p>
                  </div>
                )}
              </dl>

              {trip.is_consolidated && (
                <div className="mx-4 mt-4 overflow-hidden rounded-2xl border border-blue-100 sm:mx-5 lg:mr-[21.25rem] xl:mr-[25.25rem]">
                  <div className="bg-blue-50 px-4 py-3 text-sm font-bold text-blue-900">Passenger pickup and drop details</div>
                  <div className="divide-y divide-slate-100">
                    {trip.requests.map((item) => (
                      <div key={item.id} className="grid gap-2 p-4 text-sm sm:grid-cols-4">
                        <div><span className="text-xs text-slate-400">Request</span><p className="font-semibold">{item.reference}</p></div>
                        <div><span className="text-xs text-slate-400">Passengers</span><p className="font-semibold">{item.passenger_names || `${item.passenger_count} passenger(s)`}</p></div>
                        <div><span className="text-xs text-slate-400">Pickup</span><p className="font-semibold">{item.pickup_place || "Not recorded"}</p></div>
                        <div><span className="text-xs text-slate-400">Drop-off</span><p className="font-semibold">{item.drop_place || "Not recorded"}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 grid grid-cols-1 gap-2 border-t border-slate-100 p-4 sm:flex sm:flex-wrap sm:gap-3 sm:p-5 lg:mr-80 xl:mr-96 dark:border-slate-700">
                <button type="button" disabled={updatingId === trip.id} onClick={() => changeStatus(trip)} className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:opacity-60 sm:w-auto ${["ongoing", "issue"].includes(trip.journey_status) ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-700 hover:bg-blue-800"}`}>
                  {["ongoing", "issue"].includes(trip.journey_status) ? <FiCheckCircle /> : <FiPlay />}
                  {updatingId === trip.id ? "Updating..." : ["ongoing", "issue"].includes(trip.journey_status) ? "Complete Trip" : "Start Trip"}
                </button>
                <button type="button" onClick={() => setSelectedTrip(trip)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"><FiEye /> View Details</button>
                <button type="button" onClick={() => navigate(`/reportvehicle?journey=${trip.id}`)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 sm:w-auto dark:border-amber-900 dark:bg-slate-800 dark:text-amber-200 dark:hover:bg-amber-950"><FiAlertTriangle /> Report Issue</button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="journey-details-title" onMouseDown={(event) => event.target === event.currentTarget && setSelectedTrip(null)}>
          <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-t-[22px] bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-[18px] dark:bg-slate-900">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{selectedTrip.reference}</p>
                <h3 id="journey-details-title" className="text-xl font-bold text-slate-900 dark:text-white">Journey Details</h3>
              </div>
              <button type="button" onClick={() => setSelectedTrip(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Close details"><FiX size={22} /></button>
            </div>
            <VehicleImage vehicle={selectedTrip.vehicle} className="h-52 sm:h-64" />
            {selectedTrip.route_geometry?.length > 0 && (
              <div className="border-b border-slate-100 p-4 sm:p-6 dark:border-slate-700">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"><FiNavigation className="text-blue-600" /> Saved road route</p>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-200">{routeDistance(selectedTrip.distance_km)}</span>
                </div>
                <LocationMapPicker
                  start={routePoint(selectedTrip.starting_latitude, selectedTrip.starting_longitude)}
                  end={routePoint(selectedTrip.destination_latitude, selectedTrip.destination_longitude)}
                  routeCoordinates={selectedTrip.route_geometry}
                  readOnly
                />
              </div>
            )}
            <dl className="grid gap-5 p-4 sm:grid-cols-2 sm:p-6">
              <Detail label="Requester">{selectedTrip.requester_name}</Detail>
              <Detail label="Purpose">{selectedTrip.purpose}</Detail>
              <Detail label="Starting Location">{selectedTrip.starting_location}</Detail>
              <Detail label="Ending Location">{selectedTrip.destination}</Detail>
              <Detail label="Calculated Distance">{routeDistance(selectedTrip.distance_km)}</Detail>
              <Detail label="Journey Status">{selectedTrip.status}</Detail>
              <Detail label="Journey Date">{formatDate(selectedTrip.departure_at)}</Detail>
              <Detail label="Departure Time">{formatTime(selectedTrip.departure_at)}</Detail>
              <Detail label="Expected Return">{formatTime(selectedTrip.expected_return_at)}</Detail>
              <Detail label="Number of Passengers">{selectedTrip.passenger_count}</Detail>
              <Detail label="Passenger Names">{selectedTrip.passenger_names}</Detail>
              <Detail label="Vehicle">{selectedTrip.vehicle ? `${selectedTrip.vehicle.make} ${selectedTrip.vehicle.model}` : null}</Detail>
              <Detail label="Vehicle Type">{selectedTrip.vehicle?.vehicle_type}</Detail>
              <Detail label="Vehicle Number">{selectedTrip.vehicle?.registration_number}</Detail>
              <Detail label="Parking Location">{selectedTrip.parking_location}</Detail>
              <Detail label="Fuel Type">{selectedTrip.vehicle?.fuel_type}</Detail>
              <Detail label="Fuel Level">{selectedTrip.vehicle ? `${selectedTrip.vehicle.fuel_level ?? 0}%` : null}</Detail>
              <Detail label="Fuel Capacity">{selectedTrip.vehicle?.fuel_capacity ? `${selectedTrip.vehicle.fuel_capacity} L` : null}</Detail>
              <Detail label="Seat Capacity">{selectedTrip.vehicle?.seat_capacity}</Detail>
              <Detail label="Revenue Licence Expiry">{selectedTrip.vehicle?.revenue_license_expiry ? formatDate(selectedTrip.vehicle.revenue_license_expiry) : null}</Detail>
              <Detail label="Registration Expiry">{selectedTrip.vehicle?.registration_expiry ? formatDate(selectedTrip.vehicle.registration_expiry) : null}</Detail>
              <Detail label="Insurance Provider">{selectedTrip.vehicle?.insurance_provider}</Detail>
              <Detail label="Insurance Policy">{selectedTrip.vehicle?.insurance_policy}</Detail>
              <Detail label="Vehicle Status">{selectedTrip.vehicle?.status}</Detail>
              <Detail label="Vehicle Re-allocation Reason">{selectedTrip.reallocation_reason}</Detail>
              <Detail label="Previous Vehicle">{selectedTrip.previous_vehicle?.registration_number}</Detail>
              <Detail label="Technical Notes">{selectedTrip.vehicle?.technical_notes}</Detail>
              {selectedTrip.is_consolidated && (
                <div className="sm:col-span-2">
                  <p className="mb-3 font-bold text-slate-900">All merged requests</p>
                  <div className="space-y-3">
                    {selectedTrip.requests.map((item) => (
                      <div key={item.id} className="rounded-xl border border-slate-200 p-4 text-sm">
                        <p className="font-bold text-blue-700">{item.reference} — {item.purpose}</p>
                        <p className="mt-2"><b>Passengers:</b> {item.passenger_names || `${item.passenger_count} passenger(s)`}</p>
                        <p><b>Starting location:</b> {item.starting_location || item.pickup_place || "Not recorded"}</p>
                        <p><b>Ending location:</b> {item.drop_place || "Not recorded"}</p>
                        <p><b>Distance:</b> {routeDistance(item.distance_km)}</p>
                        <p><b>Requested time:</b> {formatTime(item.departure_at)} - {formatTime(item.expected_return_at)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
