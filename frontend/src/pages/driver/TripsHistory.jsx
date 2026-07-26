import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { getDriverTripHistory } from "../../api/authApi";
import { formatLocalDateTime as formatDate } from "../../utils/dateTime";

export default function TripsHistory() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getDriverTripHistory()
      .then((response) => {
        if (active) setTrips(response?.data?.trips || []);
      })
      .catch((requestError) => {
        if (active) setError(requestError?.message || "Unable to load trip history.");
      })
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, []);

  return (
    <DashboardLayout>
      <div className="bg-slate-50 min-h-screen p-6">
        <div className="bg-white border rounded-2xl overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="text-2xl font-bold">Recent Trip History</h2>
          </div>

          {loading && <p className="p-10 text-center text-sm text-slate-500">Loading trip history...</p>}
          {error && <p className="m-5 rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</p>}
          {!loading && !error && trips.length === 0 && (
            <p className="p-10 text-center text-sm text-slate-500">No completed journeys yet.</p>
          )}

          {!loading && !error && trips.length > 0 && <div className="overflow-x-auto"><table className="w-full min-w-[760px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-sm">
                <th className="p-4">Trip ID</th>
                <th>Journey Date</th>
                <th>Destination</th>
                <th>Purpose</th>
                <th>Vehicle</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id} className="border-t">
                  <td className="p-4 text-blue-600">{trip.reference}</td>

                  <td>{formatDate(trip.departure_at)}</td>

                  <td>{trip.destination}</td>

                  <td>{trip.purpose}</td>

                  <td>{trip.vehicle?.registration_number || "Not assigned"}</td>

                  <td>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>}
        </div>
      </div>
    </DashboardLayout>
  );
}
