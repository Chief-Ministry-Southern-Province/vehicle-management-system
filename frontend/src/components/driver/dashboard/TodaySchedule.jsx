import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle, FiCheckCircle, FiEye, FiPlay, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getDriverScheduledJourneys, updateDriverJourneyStatus } from "../../../api/authApi";
import { formatLocalDate as formatDate, formatLocalTime as formatTime } from "../../../utils/dateTime";

const statusStyle = {
  Scheduled: "bg-amber-50 text-amber-700",
  Ongoing: "bg-blue-100 text-blue-700",
};

const Detail = ({ label, children }) => (
  <div>
    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
    <dd className="mt-1 text-sm font-medium text-slate-800">{children || "Not recorded"}</dd>
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
    <div className="rounded-2xl border bg-white p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Scheduled Journey</h2>
          <p className="mt-1 text-sm text-slate-500">All incomplete trips assigned to you.</p>
        </div>
        <span className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">{trips.length} Active</span>
      </div>

      {loading && <p className="py-10 text-center text-sm text-slate-500">Loading journeys...</p>}
      {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</p>}
      {!loading && !error && trips.length === 0 && (
        <p className="rounded-xl bg-slate-50 py-10 text-center text-sm text-slate-500">No incomplete journeys are scheduled.</p>
      )}

      <div className="space-y-5">
        {trips.map((trip) => (
          <article key={trip.id} className={`rounded-2xl border p-5 ${trip.status === "Ongoing" ? "border-blue-200 bg-blue-50/50" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-blue-600">{trip.reference}</p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">{trip.purpose}</h3>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[trip.status] || "bg-slate-100 text-slate-600"}`}>{trip.status}</span>
            </div>

            <dl className="mt-5 grid gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              <Detail label="Requester">{trip.requester_name}</Detail>
              <Detail label="Journey Details">{trip.purpose}</Detail>
              <Detail label="Destination">{trip.destination}</Detail>
              <Detail label="Date">{formatDate(trip.departure_at)}</Detail>
              <Detail label="Time">{formatTime(trip.departure_at)} – {formatTime(trip.expected_return_at)}</Detail>
              <Detail label="Number of Passengers">{trip.passenger_count}</Detail>
              <Detail label="Vehicle Type">{trip.vehicle?.vehicle_type}</Detail>
              <Detail label="Vehicle Number">{trip.vehicle?.registration_number}</Detail>
            </dl>

            <div className="mt-6 flex flex-wrap gap-3 border-t pt-4">
              <button type="button" disabled={updatingId === trip.id} onClick={() => changeStatus(trip)} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 ${["ongoing", "issue"].includes(trip.journey_status) ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-700 hover:bg-blue-800"}`}>
                {["ongoing", "issue"].includes(trip.journey_status) ? <FiCheckCircle /> : <FiPlay />}
                {updatingId === trip.id ? "Updating..." : ["ongoing", "issue"].includes(trip.journey_status) ? "Complete Trip" : "Start Trip"}
              </button>
              <button type="button" onClick={() => setSelectedTrip(trip)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><FiEye /> View Details</button>
              <button type="button" onClick={() => navigate(`/reportvehicle?journey=${trip.id}`)} className="inline-flex items-center gap-2 rounded-xl border border-amber-200 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-50"><FiAlertTriangle /> Report Issue</button>
            </div>
          </article>
        ))}
      </div>

      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="journey-details-title" onMouseDown={(event) => event.target === event.currentTarget && setSelectedTrip(null)}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white p-5">
              <div><p className="text-xs font-semibold text-blue-600">{selectedTrip.reference}</p><h3 id="journey-details-title" className="text-xl font-bold">Journey Details</h3></div>
              <button type="button" onClick={() => setSelectedTrip(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close details"><FiX size={22} /></button>
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
