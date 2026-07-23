import { useEffect, useState } from "react";
import { getDriverTodaySchedule } from "../../../api/authApi";

const statusStyle = {
  Completed: "bg-emerald-50 text-emerald-700",
  Ongoing: "bg-blue-100 text-blue-700",
  Pending: "bg-amber-50 text-amber-700",
};

const formatTime = (value) => new Intl.DateTimeFormat("en-LK", {
  hour: "2-digit",
  minute: "2-digit",
}).format(new Date(value));

export default function TodaySchedule() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getDriverTodaySchedule()
      .then((response) => {
        if (active) setTrips(response?.data?.trips || []);
      })
      .catch((requestError) => {
        if (active) setError(requestError?.message || "Unable to load today's schedule.");
      })
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, []);

  return (
    <div className="rounded-2xl border bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Today&apos;s Schedule</h2>
          <p className="mt-1 text-sm text-slate-500">Approved trips assigned to you today.</p>
        </div>
        <span className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">Today</span>
      </div>

      {loading && <p className="py-10 text-center text-sm text-slate-500">Loading schedule...</p>}
      {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</p>}
      {!loading && !error && trips.length === 0 && (
        <p className="rounded-xl bg-slate-50 py-10 text-center text-sm text-slate-500">No trips are scheduled for today.</p>
      )}

      <div className="space-y-5">
        {trips.map((trip) => (
          <div key={trip.id} className={`rounded-2xl border p-5 ${trip.status === "Ongoing" ? "border-blue-200 bg-blue-50" : ""}`}>
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <p className="text-xs text-slate-400">{trip.reference}</p>
                <h3 className="mt-1 font-bold">{formatTime(trip.departure_at)} - {formatTime(trip.expected_return_at)}</h3>
                <h4 className="mt-1 text-lg font-semibold">{trip.purpose}</h4>
              </div>
              <span className={`h-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[trip.status] || "bg-slate-100 text-slate-600"}`}>{trip.status}</span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><p className="text-xs text-slate-400">DESTINATION</p><p>{trip.destination}</p></div>
              <div><p className="text-xs text-slate-400">REQUESTED BY</p><p>{trip.requester_name}</p></div>
              <div><p className="text-xs text-slate-400">VEHICLE</p><p>{trip.vehicle ? `${trip.vehicle.make} ${trip.vehicle.model} (${trip.vehicle.registration_number})` : "Not assigned"}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
