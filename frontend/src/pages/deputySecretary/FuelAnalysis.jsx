import { useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiMapPin,
  FiSearch,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { getApprovedJourneys } from "../../api/authApi";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatLocalDateTime } from "../../utils/dateTime";

const requestNumber = (id) => `REQ-${String(id).padStart(4, "0")}`;

const estimatedCompletedDistance = (journey) => {
  const oneWayDistance = Number(journey.distance_km);
  return journey.distance_km == null || !Number.isFinite(oneWayDistance)
    ? null
    : oneWayDistance * 2;
};

const formatDistance = (distance) =>
  distance == null
    ? "Not available"
    : `${distance.toLocaleString(undefined, { maximumFractionDigits: 2 })} km`;

function SummaryCard({ icon, label, value, detail }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          {icon}
        </span>
      </div>
    </article>
  );
}

export default function FuelAnalysis() {
  const [journeys, setJourneys] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getApprovedJourneys()
      .then((response) => {
        if (!active) return;
        const requests = response?.data?.requests;
        if (!Array.isArray(requests)) {
          throw new Error("Unable to read completed trip details.");
        }
        setJourneys(
          requests.filter(
            (journey) =>
              journey.status === "completed" ||
              journey.journey_status === "completed",
          ),
        );
      })
      .catch((requestError) => {
        if (active) {
          setError(
            requestError?.message || "Unable to load completed trip details.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredJourneys = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return journeys;

    return journeys.filter((journey) =>
      [
        requestNumber(journey.id),
        journey.requester_name,
        journey.user?.name,
        journey.purpose,
        journey.starting_location,
        journey.destination,
        journey.allocated_vehicle?.registration_number,
        journey.allocated_driver?.driver_id,
        journey.allocated_driver?.full_name,
      ].some((value) => String(value || "").toLowerCase().includes(query)),
    );
  }, [journeys, search]);

  const summary = useMemo(() => {
    const distances = journeys
      .map(estimatedCompletedDistance)
      .filter((distance) => distance != null);

    return {
      totalDistance: distances.length
        ? distances.reduce((total, distance) => total + distance, 0)
        : null,
      vehicles: new Set(
        journeys
          .map((journey) => journey.allocated_vehicle?.registration_number)
          .filter(Boolean),
      ).size,
      drivers: new Set(
        journeys
          .map((journey) => journey.allocated_driver?.driver_id)
          .filter(Boolean),
      ).size,
    };
  }, [journeys]);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1600px] space-y-6 pb-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Completed trip records
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Fuel Analysis
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Review completed trips and their estimated round-trip distances.
          </p>
        </header>

        <section
          className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Completed trip summary"
        >
          <SummaryCard
            icon={<FiCheckCircle size={21} />}
            label="Total completed trips"
            value={journeys.length.toLocaleString()}
            detail="Completed vehicle requests"
          />
          <SummaryCard
            icon={<FiMapPin size={21} />}
            label="Total estimated distance"
            value={formatDistance(summary.totalDistance)}
            detail="Estimated round-trip kilometers"
          />
          <SummaryCard
            icon={<FiTruck size={21} />}
            label="Vehicles used"
            value={summary.vehicles.toLocaleString()}
            detail="Distinct registration numbers"
          />
          <SummaryCard
            icon={<FiUser size={21} />}
            label="Drivers assigned"
            value={summary.drivers.toLocaleString()}
            detail="Distinct driver numbers"
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Completed journey details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredJourneys.length} completed trip records
              </p>
            </div>
            <label className="relative w-full sm:max-w-md">
              <span className="sr-only">Search completed trips</span>
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by request, vehicle, driver, requester, or route"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          {loading && (
            <p className="p-10 text-center text-sm text-slate-500">
              Loading completed trip details...
            </p>
          )}
          {error && (
            <p className="m-5 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700" role="alert">
              {error}
            </p>
          )}
          {!loading && !error && filteredJourneys.length === 0 && (
            <p className="p-10 text-center text-sm text-slate-500">
              No completed trips found.
            </p>
          )}

          {!loading && !error && filteredJourneys.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Vehicle Request Number</th>
                    <th className="px-5 py-3 font-semibold">Vehicle Registration Number</th>
                    <th className="px-5 py-3 font-semibold">Driver Number</th>
                    <th className="px-5 py-3 font-semibold">Requester and Purpose</th>
                    <th className="px-5 py-3 font-semibold">Journey Route</th>
                    <th className="px-5 py-3 font-semibold">Completed At</th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Estimated Completed Journey Distance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredJourneys.map((journey) => {
                    const vehicle = journey.allocated_vehicle;
                    const driver = journey.allocated_driver;
                    return (
                      <tr key={journey.id} className="align-top hover:bg-blue-50/40">
                        <td className="whitespace-nowrap px-5 py-4 font-bold text-blue-700">
                          {requestNumber(journey.id)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">
                          {vehicle?.registration_number || "Not assigned"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <p className="font-semibold text-slate-800">
                            {driver?.driver_id || "Not assigned"}
                          </p>
                          {driver?.full_name && (
                            <p className="mt-1 text-xs text-slate-500">{driver.full_name}</p>
                          )}
                        </td>
                        <td className="min-w-56 px-5 py-4">
                          <p className="font-semibold text-slate-800">
                            {journey.requester_name || journey.user?.name || "Not recorded"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {journey.purpose || "Not recorded"}
                          </p>
                        </td>
                        <td className="min-w-64 px-5 py-4 text-slate-700">
                          <p>{journey.starting_location || "Not recorded"}</p>
                          <p className="my-1 text-xs font-semibold text-blue-600">to</p>
                          <p>{journey.destination || "Not recorded"}</p>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                          {formatLocalDateTime(journey.journey_completed_at)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-right">
                          <p className="font-bold text-emerald-700">
                            {formatDistance(estimatedCompletedDistance(journey))}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Estimated round trip from saved one-way route distance
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
