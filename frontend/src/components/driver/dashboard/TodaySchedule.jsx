import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle, FiCheckCircle, FiEye, FiPlay, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getDriverScheduledJourneys, updateDriverJourneyStatus } from "../../../api/authApi";
import { formatLocalDate as formatDate, formatLocalTime as formatTime } from "../../../utils/dateTime";

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
      <div className="flex flex-col gap-4 border-b border-slate-100 bg-linear-to-r from-white to-blue-50/60 p-6 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Active Assignments
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Scheduled Journey</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">All incomplete trips assigned to you.</p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
          {trips.length} Active
        </span>
      </div>

      <div className="p-6">
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
              className={`group rounded-[18px] border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-20px_rgba(15,23,42,0.22)] dark:border-slate-700 ${
                trip.status === "Ongoing"
                  ? "border-blue-200 bg-blue-50/60 dark:bg-blue-950/30"
                  : "border-slate-100 bg-white dark:bg-slate-900"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{trip.reference}</p>
                  <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{trip.purpose}</h3>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[trip.status] || "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
                  {trip.status}
                </span>
              </div>

              <dl className="mt-5 grid gap-x-5 gap-y-4 rounded-2xl bg-slate-50/70 p-4 sm:grid-cols-2 lg:grid-cols-3 dark:bg-slate-800/70">
                <Detail label="Requester">{trip.requester_name}</Detail>
                <Detail label="Journey Details">{trip.purpose}</Detail>
                <Detail label="Destination">{trip.destination}</Detail>
                <Detail label="Date">{formatDate(trip.departure_at)}</Detail>
                <Detail label="Time">{formatTime(trip.departure_at)} - {formatTime(trip.expected_return_at)}</Detail>
                <Detail label="Number of Passengers">{trip.passenger_count}</Detail>
                <Detail label="Vehicle Type">{trip.vehicle?.vehicle_type}</Detail>
                <Detail label="Vehicle Number">{trip.vehicle?.registration_number}</Detail>
              </dl>

              <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
                <button type="button" disabled={updatingId === trip.id} onClick={() => changeStatus(trip)} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:opacity-60 ${["ongoing", "issue"].includes(trip.journey_status) ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-700 hover:bg-blue-800"}`}>
                  {["ongoing", "issue"].includes(trip.journey_status) ? <FiCheckCircle /> : <FiPlay />}
                  {updatingId === trip.id ? "Updating..." : ["ongoing", "issue"].includes(trip.journey_status) ? "Complete Trip" : "Start Trip"}
                </button>
                <button type="button" onClick={() => setSelectedTrip(trip)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"><FiEye /> View Details</button>
                <button type="button" onClick={() => navigate(`/reportvehicle?journey=${trip.id}`)} className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 dark:border-amber-900 dark:bg-slate-800 dark:text-amber-200 dark:hover:bg-amber-950"><FiAlertTriangle /> Report Issue</button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="journey-details-title" onMouseDown={(event) => event.target === event.currentTarget && setSelectedTrip(null)}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[18px] bg-white shadow-2xl dark:bg-slate-900">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{selectedTrip.reference}</p>
                <h3 id="journey-details-title" className="text-xl font-bold text-slate-900 dark:text-white">Journey Details</h3>
              </div>
              <button type="button" onClick={() => setSelectedTrip(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Close details"><FiX size={22} /></button>
            </div>
            <dl className="grid gap-5 p-6 sm:grid-cols-2">
              <Detail label="Requester">{selectedTrip.requester_name}</Detail>
              <Detail label="Purpose">{selectedTrip.purpose}</Detail>
              <Detail label="Destination">{selectedTrip.destination}</Detail>
              <Detail label="Journey Date">{formatDate(selectedTrip.departure_at)}</Detail>
              <Detail label="Departure Time">{formatTime(selectedTrip.departure_at)}</Detail>
              <Detail label="Expected Return">{formatTime(selectedTrip.expected_return_at)}</Detail>
              <Detail label="Number of Passengers">{selectedTrip.passenger_count}</Detail>
              <Detail label="Passenger Names">{selectedTrip.passenger_names}</Detail>
              <Detail label="Vehicle">{selectedTrip.vehicle ? `${selectedTrip.vehicle.make} ${selectedTrip.vehicle.model}` : null}</Detail>
              <Detail label="Vehicle Type">{selectedTrip.vehicle?.vehicle_type}</Detail>
              <Detail label="Vehicle Number">{selectedTrip.vehicle?.registration_number}</Detail>
              <Detail label="Fuel Type">{selectedTrip.vehicle?.fuel_type}</Detail>
              <Detail label="Fuel Level">{selectedTrip.vehicle ? `${selectedTrip.vehicle.fuel_level ?? 0}%` : null}</Detail>
              <Detail label="Fuel Capacity">{selectedTrip.vehicle?.fuel_capacity ? `${selectedTrip.vehicle.fuel_capacity} L` : null}</Detail>
              <Detail label="Seat Capacity">{selectedTrip.vehicle?.seat_capacity}</Detail>
              <Detail label="Revenue Licence Expiry">{selectedTrip.vehicle?.revenue_license_expiry ? formatDate(selectedTrip.vehicle.revenue_license_expiry) : null}</Detail>
              <Detail label="Registration Expiry">{selectedTrip.vehicle?.registration_expiry ? formatDate(selectedTrip.vehicle.registration_expiry) : null}</Detail>
              <Detail label="Insurance Provider">{selectedTrip.vehicle?.insurance_provider}</Detail>
              <Detail label="Insurance Policy">{selectedTrip.vehicle?.insurance_policy}</Detail>
              <Detail label="Vehicle Status">{selectedTrip.vehicle?.status}</Detail>
              <Detail label="Technical Notes">{selectedTrip.vehicle?.technical_notes}</Detail>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
