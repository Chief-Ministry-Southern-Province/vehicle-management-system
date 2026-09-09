import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle, FiCalendar, FiCheckCircle, FiClock, FiEye, FiMapPin, FiNavigation, FiPlay, FiTruck, FiUsers, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getDriverScheduledJourneys, updateDriverJourneyStatus } from "../../../api/authApi";
import { formatLocalDate as formatDate, formatLocalTime as formatTime, formatLocalDateTime } from "../../../utils/dateTime";
import LocationMapPicker from "../../employee/LocationMapPicker";
import { useLanguage } from "../../../context/useLanguage";

const statusStyle = {
  Pending: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
  Ongoing: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200",
  Issue: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200",
};

const Detail = ({ label, children }) => (
  <div className="min-w-0 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</dt>
    <dd className="mt-1 break-words whitespace-pre-line text-sm font-semibold leading-6 text-slate-800 dark:text-slate-100">{children == null || children === "" ? "Not recorded" : children}</dd>
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

const tripLocation = (trip, prefix, fallback) => {
  const label = prefix === "starting" ? trip.starting_location : trip.destination;
  const point = routePoint(trip[`${prefix}_latitude`], trip[`${prefix}_longitude`]);
  return label || (point ? `${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}` : fallback);
};

const VehicleImage = ({ vehicle, className = "h-36 sm:h-40", compact = false }) => (
  <div className={`relative overflow-hidden bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 ${className}`}>
    {vehicle?.image_url ? (
      <img
        src={vehicle.image_url}
        alt={`${vehicle.make || "Assigned"} ${vehicle.model || "vehicle"}`}
        className="h-full w-full object-contain p-2"
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.display = "none";
          event.currentTarget.nextElementSibling?.classList.remove("hidden");
        }}
      />
    ) : null}
    <div className={`${vehicle?.image_url ? "hidden" : ""} flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400`}>
      <FiTruck className={compact ? "text-2xl" : "text-3xl"} />
      <span className={compact ? "text-xs font-semibold" : "text-sm font-semibold"}>Vehicle image not available</span>
    </div>
    {vehicle && (
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950/85 to-transparent px-4 pb-3 pt-10 text-white">
        <p className={compact ? "truncate text-sm font-bold" : "font-bold"}>{vehicle.make} {vehicle.model}</p>
        <p className="text-[11px] text-slate-200">{vehicle.registration_number}</p>
      </div>
    )}
  </div>
);

export default function ScheduledJourney() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [readings, setReadings] = useState({});
  const [completedTrip, setCompletedTrip] = useState(null);

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
      const response = await updateDriverJourneyStatus(trip.id, action, readings[trip.id] || {});
      if (action === "complete") {
        setTrips((current) => current.filter((item) => item.id !== trip.id));
        setSelectedTrip(null);
        setCompletedTrip(response.data.trip);
      } else {
        setTrips((current) => current.map((item) => item.id === trip.id ? response.data.trip : item));
      }
      setReadings((current) => ({ ...current, [trip.id]: {} }));
      toast.success(response.message);
    } catch (requestError) {
      toast.error(Object.values(requestError?.errors || {}).flat()[0] || requestError?.message || "Unable to update the trip.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_55px_-38px_rgba(15,23,42,0.4)] dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-linear-to-r from-slate-950 via-blue-950 to-indigo-900 p-5 text-white dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Driver itinerary
          </p>
          <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">Scheduled Journeys</h2>
          <p className="mt-1 text-sm text-blue-100/70">Route, schedule, passengers, vehicle, and actions in one place.</p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-blue-100 ring-1 ring-inset ring-white/15">
          {trips.length} Active
        </span>
      </div>

      <div className="p-3 sm:p-6">
        {completedTrip && <p role="status" className="mb-4 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">{completedTrip.reference}: {t("odometer.actual")} — {routeDistance(completedTrip.actual_distance_km)}</p>}
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
              className={`group relative overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_-24px_rgba(15,23,42,0.28)] dark:border-slate-700 ${
                trip.status === "Ongoing"
                  ? "border-blue-200 bg-blue-50/60 dark:bg-blue-950/30"
                  : "border-slate-100 bg-white dark:bg-slate-900"
              }`}
            >
              <div className="absolute inset-y-0 left-0 z-10 w-1 bg-linear-to-b from-blue-500 via-indigo-500 to-cyan-400" />
              <div className="lg:hidden">
                <VehicleImage vehicle={trip.vehicle} compact />
              </div>
              <div className="absolute right-4 top-4 hidden h-40 w-56 overflow-hidden rounded-2xl border border-slate-100 shadow-sm lg:block dark:border-slate-700 xl:w-64">
                <VehicleImage vehicle={trip.vehicle} className="h-full" compact />
              </div>

              <div className="flex flex-wrap items-start justify-between gap-3 p-4 pb-0 pl-5 sm:p-5 sm:pb-0 sm:pl-6 lg:mr-64 xl:mr-72">
                <div>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{trip.reference}</p>
                  <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{trip.purpose}</h3>
                  {trip.is_consolidated && <p className="mt-1 text-sm font-semibold text-emerald-700">One trip covering {trip.request_count} requests</p>}
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[trip.status] || "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
                  {trip.status}
                </span>
              </div>

              <div className="mx-4 mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white sm:mx-5 sm:mt-5 lg:mr-[17.25rem] xl:mr-[19.25rem] dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-linear-to-r from-blue-50 to-indigo-50/70 px-4 py-3 dark:border-slate-700 dark:from-blue-950/50 dark:to-indigo-950/30">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300"><FiNavigation /> Journey route</p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-200">
                    Journey kilometers: {trip.is_consolidated ? "See each request" : routeDistance(trip.round_trip_distance_km)}
                  </span>
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
                      heightClass="h-64"
                    />
                  </div>
                )}
              </div>

              <div className="mx-4 mt-4 grid gap-2 sm:mx-5 sm:grid-cols-3 lg:mr-[17.25rem] xl:mr-[19.25rem]">
                <div className="flex items-center gap-3 rounded-2xl bg-blue-50/80 p-3 dark:bg-blue-950/30"><span className="rounded-xl bg-white p-2 text-blue-600 shadow-sm dark:bg-slate-800"><FiCalendar /></span><div><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Journey date</p><p className="text-sm font-bold text-slate-900 dark:text-white">{formatDate(trip.departure_at)}</p></div></div>
                <div className="flex items-center gap-3 rounded-2xl bg-amber-50/80 p-3 dark:bg-amber-950/30"><span className="rounded-xl bg-white p-2 text-amber-600 shadow-sm dark:bg-slate-800"><FiClock /></span><div><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Scheduled time</p><p className="text-sm font-bold text-slate-900 dark:text-white">{formatTime(trip.departure_at)} – {formatTime(trip.expected_return_at)}</p></div></div>
                <div className="flex items-center gap-3 rounded-2xl bg-violet-50/80 p-3 dark:bg-violet-950/30"><span className="rounded-xl bg-white p-2 text-violet-600 shadow-sm dark:bg-slate-800"><FiUsers /></span><div><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Passengers</p><p className="text-sm font-bold text-slate-900 dark:text-white">{trip.passenger_count} passenger{trip.passenger_count === 1 ? "" : "s"}</p></div></div>
              </div>

              <dl className="mx-4 mt-4 hidden gap-x-5 gap-y-4 rounded-2xl bg-slate-50/70 p-4 sm:mx-5 lg:mr-[17.25rem] lg:grid lg:grid-cols-3 xl:mr-[19.25rem] dark:bg-slate-800/70">
                <Detail label="Requester">{trip.requester_name}</Detail>
                <Detail label="Purpose">{trip.purpose}</Detail>
                <Detail label="Vehicle Type">{trip.vehicle?.vehicle_type}</Detail>
                <Detail label="Vehicle Number">{trip.vehicle?.registration_number}</Detail>
                <Detail label="Parking Location">{trip.parking_location}</Detail>
              </dl>
              {(trip.start_odometer_km != null || trip.reallocation_reason) && (
              <dl className="mx-4 mt-4 grid gap-4 sm:mx-5 lg:mr-[17.25rem] xl:mr-[19.25rem]">
                {trip.start_odometer_km != null && <Detail label={t("odometer.start")}>{routeDistance(trip.start_odometer_km)}</Detail>}
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
              )}

              {trip.is_consolidated && (
                <div className="mx-4 mt-4 hidden overflow-hidden rounded-2xl border border-blue-100 sm:mx-5 lg:mr-[17.25rem] lg:block xl:mr-[19.25rem]">
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

              <form onSubmit={(event) => { event.preventDefault(); if (updatingId === null) changeStatus(trip); }} className="mt-5 grid grid-cols-1 gap-2 border-t border-slate-100 p-4 sm:flex sm:flex-wrap sm:gap-3 sm:p-5 lg:mr-64 xl:mr-72 dark:border-slate-700">
                <div className="grid w-full gap-3 sm:grid-cols-2">
                  {trip.start_odometer_km == null && <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {t("odometer.start")}
                    <input required type="number" inputMode="decimal" min="0" max="99999999.99" step="0.01" disabled={updatingId !== null} value={readings[trip.id]?.start_odometer_km ?? ""} onChange={(event) => setReadings((current) => ({ ...current, [trip.id]: { ...current[trip.id], start_odometer_km: event.target.value } }))} className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-600 dark:bg-slate-900" />
                  </label>}
                  {["ongoing", "issue"].includes(trip.journey_status) && <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {t("odometer.end")}
                    <input required type="number" inputMode="decimal" min={trip.start_odometer_km ?? readings[trip.id]?.start_odometer_km ?? 0} max="99999999.99" step="0.01" disabled={updatingId !== null} value={readings[trip.id]?.end_odometer_km ?? ""} onChange={(event) => setReadings((current) => ({ ...current, [trip.id]: { ...current[trip.id], end_odometer_km: event.target.value } }))} className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-600 dark:bg-slate-900" />
                  </label>}
                </div>
                {trip.journey_status !== "scheduled" && trip.start_odometer_km == null && <p className="w-full text-sm text-amber-700 dark:text-amber-300">{t("odometer.missingStart")}</p>}
                {trip.is_consolidated && <p className="w-full text-sm text-slate-500 dark:text-slate-400">{t("odometer.shared")}</p>}
                <button type="submit" disabled={updatingId !== null} className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:opacity-60 sm:w-auto ${["ongoing", "issue"].includes(trip.journey_status) ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-700 hover:bg-blue-800"}`}>
                  {["ongoing", "issue"].includes(trip.journey_status) ? <FiCheckCircle /> : <FiPlay />}
                  {updatingId === trip.id ? "Updating..." : ["ongoing", "issue"].includes(trip.journey_status) ? "Complete Trip" : "Start Trip"}
                </button>
                <button type="button" onClick={() => setSelectedTrip(trip)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"><FiEye /> View Details</button>
                <button type="button" onClick={() => navigate(`/reportvehicle?journey=${trip.id}`)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 sm:w-auto dark:border-amber-900 dark:bg-slate-800 dark:text-amber-200 dark:hover:bg-amber-950"><FiAlertTriangle /> Report Issue</button>
              </form>
            </article>
          ))}
        </div>
      </div>

      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="journey-details-title" onMouseDown={(event) => event.target === event.currentTarget && setSelectedTrip(null)}>
          <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-t-[22px] bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-[18px] dark:bg-slate-900">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{selectedTrip.reference}</p>
                <h3 id="journey-details-title" className="text-xl font-bold text-slate-900 dark:text-white">{t("driverView.details")}</h3>
              </div>
              <button type="button" onClick={() => setSelectedTrip(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Close details"><FiX size={22} /></button>
            </div>
            <VehicleImage vehicle={selectedTrip.vehicle} className="h-44 sm:h-52" />
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
                  heightClass="h-72 sm:h-80"
                />
              </div>
            )}
            <div className="space-y-5 p-4 sm:p-6">
              <section className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedTrip.purpose || t("driverView.details")}</h3>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${statusStyle[selectedTrip.status] || "bg-slate-100 text-slate-700"}`}>{selectedTrip.status}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t("fuel.requester")}: {selectedTrip.requester_name || t("odometer.notRecorded")}</p>
                <div className="mt-4 space-y-4 border-l-2 border-blue-200 pl-4">
                  <div><p className="text-xs font-bold text-blue-700 dark:text-blue-300">{t("fuel.starting")}</p><p className="mt-1 break-words text-sm font-semibold leading-6 dark:text-white">{tripLocation(selectedTrip, "starting", t("odometer.notRecorded"))}</p></div>
                  <div><p className="text-xs font-bold text-rose-700 dark:text-rose-300">{t("fuel.destination")}</p><p className="mt-1 break-words text-sm font-semibold leading-6 dark:text-white">{tripLocation(selectedTrip, "destination", t("odometer.notRecorded"))}</p></div>
                </div>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Detail label={t("driverView.oneWay")}>{routeDistance(selectedTrip.distance_km)}</Detail>
                  <Detail label={t("driverView.roundTrip")}>{selectedTrip.is_consolidated ? t("driverView.perRequest") : routeDistance(selectedTrip.round_trip_distance_km)}</Detail>
                </dl>
              </section>
              <section>
                <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-900 dark:text-white"><FiClock className="text-blue-600" />{t("driverView.schedule")}</h3>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <Detail label={t("fuel.departure_at")}>{formatLocalDateTime(selectedTrip.departure_at)}</Detail>
                  <Detail label={t("fuel.expected_return_at")}>{formatLocalDateTime(selectedTrip.expected_return_at)}</Detail>
                </dl>
              </section>
              <section>
                <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-900 dark:text-white"><FiUsers className="text-blue-600" />{t("driverView.passengers")}</h3>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <Detail label={t("fuel.passengers")}>{selectedTrip.passenger_count}</Detail>
                  <Detail label={t("fuel.passengerNames")}>{Array.isArray(selectedTrip.passenger_names) ? selectedTrip.passenger_names.join("\n") : selectedTrip.passenger_names}</Detail>
                </dl>
              </section>
              <section>
                <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-900 dark:text-white"><FiTruck className="text-blue-600" />{t("driverView.vehicle")}</h3>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <Detail label={t("fuel.vehicle")}>{selectedTrip.vehicle?.registration_number}</Detail>
                  <Detail label={t("fuel.parking")}>{selectedTrip.parking_location}</Detail>
                  <Detail label={t("approvalRecords.vehicleModel")}>{[selectedTrip.vehicle?.make, selectedTrip.vehicle?.model].filter(Boolean).join(" ")}</Detail>
                  <Detail label="Vehicle Type">{selectedTrip.vehicle?.vehicle_type}</Detail>
                </dl>
              </section>
              <details className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <summary className="cursor-pointer font-bold text-slate-900 dark:text-white">{t("driverView.moreVehicle")}</summary>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
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
                </dl>
              </details>
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
                        <p><b>Journey kilometers (round trip):</b> {routeDistance(item.round_trip_distance_km)}</p>
                        <p><b>Requested time:</b> {formatTime(item.departure_at)} - {formatTime(item.expected_return_at)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
