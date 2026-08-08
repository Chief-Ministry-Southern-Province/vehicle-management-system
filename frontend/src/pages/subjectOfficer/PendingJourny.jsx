import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiRefreshCw,
  FiSearch,
  FiTruck,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { getRecommendedRequests } from "../../api/authApi";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatLocalDateTime } from "../../utils/dateTime";

const requestNumber = (id) => `REQ-${String(id).padStart(4, "0")}`;
const display = (value) => value || "—";
const statusStyles = {
  recommended: "bg-blue-100 text-blue-700",
  vehicle_allocated: "bg-indigo-100 text-indigo-700",
  approved: "bg-emerald-100 text-emerald-700",
  completed: "bg-cyan-100 text-cyan-700",
  rejected: "bg-rose-100 text-rose-700",
  cancelled: "bg-slate-200 text-slate-700",
};

const statusLabel = (status) =>
  display(status).replaceAll("_", " ").replace(/\b\w/g, (letter) =>
    letter.toUpperCase(),
  );

export default function PendingJourny() {
  const [requests, setRequests] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getRecommendedRequests();
      setRequests(response?.data?.requests || []);
    } catch (requestError) {
      setRequests([]);
      setError(requestError?.message || "Unable to load recommended requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(loadRequests, 0);
    return () => clearTimeout(timeoutId);
  }, [loadRequests]);

  const visibleRequests = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return requests;

    return requests.filter((request) =>
      [
        requestNumber(request.id),
        request.requester_name,
        request.user?.name,
        request.user?.department,
        request.destination,
        request.status,
        request.allocated_vehicle?.registration_number,
        request.allocated_vehicle?.make,
        request.allocated_vehicle?.model,
      ].some((value) => String(value || "").toLowerCase().includes(search)),
    );
  }, [query, requests]);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Recommended Requests
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              All journey requests that have received a recommendation.
            </p>
          </div>
          <div className="rounded-2xl bg-blue-50 px-5 py-3 text-blue-700">
            <p className="text-xs font-semibold uppercase tracking-wide">
              Total recommended
            </p>
            <p className="text-2xl font-bold">{requests.length}</p>
          </div>
        </header>

        <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <label className="relative min-w-0 flex-1 sm:min-w-80">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search requester, destination, request, or status..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <button
            type="button"
            onClick={loadRequests}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
            Loading recommended requests...
          </div>
        )}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        )}
        {!loading && !error && visibleRequests.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
            {query
              ? "No recommended requests match your search."
              : "No recommended requests found."}
          </div>
        )}
        {!loading && !error && visibleRequests.length > 0 && (
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1250px]">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Requester</th>
                    <th className="px-6 py-4">Destination</th>
                    <th className="px-6 py-4">Departure Time</th>
                    <th className="px-6 py-4">Expected Arrival Time</th>
                    <th className="px-6 py-4">Passengers</th>
                    <th className="px-6 py-4">Vehicle Allocation</th>
                    <th className="px-6 py-4">Request Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-blue-50/40">
                      <td className="px-6 py-5">
                        <p className="flex items-center gap-2 font-semibold text-slate-800">
                          <FiUser className="text-blue-500" />
                          {display(request.requester_name || request.user?.name)}
                        </p>
                        <p className="mt-1 text-xs font-medium text-blue-600">
                          {requestNumber(request.id)}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {display(request.user?.department)}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="flex items-center gap-2 font-medium text-slate-700">
                          <FiMapPin className="shrink-0 text-blue-500" />
                          {display(request.destination)}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600">
                        <span className="flex items-center gap-2">
                          <FiClock className="text-blue-500" />
                          {formatLocalDateTime(request.departure_at)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600">
                        <span className="flex items-center gap-2">
                          <FiCalendar className="text-blue-500" />
                          {formatLocalDateTime(request.expected_return_at)}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
                          <FiUsers className="text-blue-500" />
                          {request.passenger_count ?? "—"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        {request.allocated_vehicle ? (
                          <div>
                            <p className="flex items-center gap-2 font-semibold text-slate-800">
                              <FiTruck className="text-indigo-500" />
                              {display(
                                request.allocated_vehicle.registration_number,
                              )}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {display(
                                [
                                  request.allocated_vehicle.make,
                                  request.allocated_vehicle.model,
                                ]
                                  .filter(Boolean)
                                  .join(" "),
                              )}
                            </p>
                            {request.parking_location && (
                              <p className="mt-1 text-xs text-slate-400">
                                Parking: {request.parking_location}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">
                            Not allocated
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[request.status] || "bg-amber-100 text-amber-700"}`}
                        >
                          {statusLabel(request.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-sm text-slate-500">
              Showing {visibleRequests.length} of {requests.length} recommended
              requests
            </div>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
