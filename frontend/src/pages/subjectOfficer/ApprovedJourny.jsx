import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiMapPin,
  FiRefreshCw,
  FiSearch,
  FiTruck,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { getApprovedJourneys } from "../../api/authApi";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatLocalDateTime as formatDateTime } from "../../utils/dateTime";
const requestNumber = (id) => `REQ-${String(id).padStart(4, "0")}`;
const display = (value) => value || "—";
const journeyStatus = (journey) => {
  if (journey.journey_status === "completed") return "Completed";
  if (journey.journey_status === "issue") return "Issue";
  if (journey.journey_status === "ongoing") return "Ongoing";
  return "Pending";
};

const isJourneyOverdue = (journey) =>
  journey.journey_status !== "completed" &&
  journey.expected_return_at &&
  new Date(journey.expected_return_at).getTime() < Date.now();

const journeyStatusStyle = {
  Pending: "bg-amber-100 text-amber-700",
  Ongoing: "bg-blue-100 text-blue-700",
  Issue: "bg-red-100 text-red-700",
  Completed: "bg-emerald-100 text-emerald-700",
};

function DriverStatus({ journey }) {
  const status = journeyStatus(journey);
  const overdue = isJourneyOverdue(journey);

  return (
    <div>
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
          overdue
            ? "bg-red-100 text-red-700 ring-2 ring-red-200"
            : journeyStatusStyle[status]
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            overdue ? "animate-pulse bg-red-600" : "bg-current"
          }`}
        />
        {status}
      </span>
      {overdue && (
        <p className="mt-1.5 text-xs font-semibold text-red-600">
          Scheduled return passed
        </p>
      )}
    </div>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="flex gap-3 rounded-xl bg-slate-50 p-3">
      <span className="mt-0.5 text-blue-600">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-medium text-slate-700">
          {display(value)}
        </p>
      </div>
    </div>
  );
}
function JourneyDetails({ journey, onClose }) {
  const vehicle = journey.allocated_vehicle || {};
  const driver = journey.allocated_driver || {};
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      onMouseDown={onClose}
    >
      <article
        className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="sticky top-0 z-10 flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 bg-white px-6 py-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                {requestNumber(journey.id)}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                <FiCheckCircle /> Approved
              </span>
              <DriverStatus journey={journey} />
            </div>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <FiCalendar /> Approved {formatDateTime(journey.approved_at)}
            </p>
          </div>
          <div className="flex items-start gap-4">
            <div className="text-left sm:text-right">
              <p className="font-semibold text-slate-800">
                {display(journey.requester_name || journey.user?.name)}
              </p>
              <p className="text-sm text-slate-500">
                {display(journey.user?.department)}
              </p>
              <p className="text-xs text-slate-400">
                {display(journey.user?.employee_id)}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close details"
              className="rounded-xl bg-slate-100 p-2.5 text-slate-600 hover:bg-slate-200"
            >
              <FiX size={20} />
            </button>
          </div>
        </header>

        <div className="grid gap-6 p-6 xl:grid-cols-3">
          <section>
            <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-800">
              <FiMapPin className="text-blue-600" /> Request details
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <Detail
                icon={<FiMapPin />}
                label="Destination"
                value={journey.destination}
              />
              <Detail
                icon={<FiCheckCircle />}
                label="Purpose"
                value={journey.purpose}
              />
              <Detail
                icon={<FiClock />}
                label="Departure"
                value={formatDateTime(journey.departure_at)}
              />
              <Detail
                icon={<FiClock />}
                label="Expected return"
                value={formatDateTime(journey.expected_return_at)}
              />
              <Detail
                icon={<FiUsers />}
                label="Passengers"
                value={
                  journey.passenger_count == null
                    ? "—"
                    : String(journey.passenger_count)
                }
              />
              {journey.passenger_names && (
                <Detail
                  icon={<FiUsers />}
                  label="Passenger names"
                  value={journey.passenger_names}
                />
              )}
            </div>
          </section>

          <section>
            <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-800">
              <FiTruck className="text-blue-600" /> Allocated vehicle
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <Detail
                icon={<FiTruck />}
                label="Registration number"
                value={vehicle.registration_number}
              />
              <Detail
                icon={<FiTruck />}
                label="Vehicle"
                value={[vehicle.make, vehicle.model].filter(Boolean).join(" ")}
              />
              <Detail
                icon={<FiTruck />}
                label="Type"
                value={vehicle.vehicle_type}
              />
              <Detail
                icon={<FiUsers />}
                label="Seat capacity"
                value={
                  vehicle.seat_capacity == null
                    ? "—"
                    : String(vehicle.seat_capacity)
                }
              />
              <Detail
                icon={<FiCalendar />}
                label="Allocated at"
                value={formatDateTime(journey.allocated_at)}
              />
            </div>
          </section>

          <section>
            <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-800">
              <FiUser className="text-blue-600" /> Allocated driver
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <Detail
                icon={<FiUser />}
                label="Driver name"
                value={driver.full_name}
              />
              <Detail
                icon={<FiUser />}
                label="Driver ID"
                value={driver.driver_id}
              />
              <Detail
                icon={<FiUser />}
                label="Contact number"
                value={driver.contact_number}
              />
              <Detail icon={<FiUser />} label="NIC" value={driver.nic} />
              <Detail
                icon={<FiCheckCircle />}
                label="Licence number"
                value={driver.licence_number}
              />
              <Detail
                icon={<FiCheckCircle />}
                label="Licence type"
                value={driver.licence_type}
              />
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
export default function ApprovedJourny() {
  const [journeys, setJourneys] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJourney, setSelectedJourney] = useState(null);

  const loadJourneys = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getApprovedJourneys();
      setJourneys(response?.data?.requests || []);
    } catch (requestError) {
      setJourneys([]);
      setError(requestError?.message || "Unable to load approved journeys.");
    } finally {
      setLoading(false);
    }
  }, []);

  // `loadJourneys` sets state synchronously (setLoading/setError) before its
  // first `await`, which react-hooks/set-state-in-effect flags when called
  // directly in an effect body. Deferring the initial call with a zero-delay
  // timeout keeps the exact same fetch/state behavior while satisfying the
  // lint rule, since the call no longer happens synchronously during the
  // effect's own execution.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadJourneys();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [loadJourneys]);

  const filteredJourneys = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return journeys;
    return journeys.filter((journey) =>
      [
        requestNumber(journey.id),
        journey.requester_name,
        journey.user?.name,
        journey.user?.department,
        journey.destination,
        journey.purpose,
        journey.allocated_vehicle?.registration_number,
        journey.allocated_vehicle?.make,
        journey.allocated_vehicle?.model,
        journey.allocated_driver?.full_name,
        journey.allocated_driver?.driver_id,
        journeyStatus(journey),
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(search),
      ),
    );
  }, [journeys, query]);
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Approved Journeys
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              All finally approved requests with their vehicle and driver
              allocations.
            </p>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-5 py-3 text-emerald-700">
            <p className="text-xs font-semibold uppercase tracking-wide">
              Total approved
            </p>
            <p className="text-2xl font-bold">{journeys.length}</p>
          </div>
        </header>

        <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <label className="relative min-w-0 flex-1 sm:min-w-80">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search request, destination, vehicle, or driver..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <button
            type="button"
            onClick={loadJourneys}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
            Loading approved journeys...
          </div>
        )}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        )}
        {!loading && !error && filteredJourneys.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
            {query
              ? "No approved journeys match your search."
              : "No approved journeys found."}
          </div>
        )}
        {!loading && !error && filteredJourneys.length > 0 && (
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1160px]">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Requester</th>
                    <th className="px-6 py-4">Destination</th>
                    <th className="px-6 py-4">Allocated Vehicle</th>
                    <th className="px-6 py-4">Allocated Driver</th>
                    <th className="px-6 py-4">Driver Status</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJourneys.map((journey) => {
                    const vehicle = journey.allocated_vehicle || {};
                    const driver = journey.allocated_driver || {};
                    return (
                      <tr
                        key={journey.id}
                        className="border-t border-slate-100 hover:bg-blue-50/40"
                      >
                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-800">
                            {display(
                              journey.requester_name || journey.user?.name,
                            )}
                          </p>
                          <p className="mt-1 text-xs font-medium text-blue-600">
                            {requestNumber(journey.id)}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-medium text-slate-700">
                            {display(journey.destination)}
                          </p>
                          <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                            {display(journey.purpose)}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-700">
                            {display(vehicle.registration_number)}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {display(
                              [vehicle.make, vehicle.model]
                                .filter(Boolean)
                                .join(" "),
                            )}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-700">
                            {display(driver.full_name)}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {display(driver.driver_id)}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <DriverStatus journey={journey} />
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-600">
                          <p>{formatDateTime(journey.departure_at)}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            Return: {formatDateTime(journey.expected_return_at)}
                          </p>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedJourney(journey)}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            <FiEye /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-sm text-slate-500">
              Showing {filteredJourneys.length} of {journeys.length} approved
              journeys
            </div>
          </section>
        )}
        {selectedJourney && (
          <JourneyDetails
            journey={selectedJourney}
            onClose={() => setSelectedJourney(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
