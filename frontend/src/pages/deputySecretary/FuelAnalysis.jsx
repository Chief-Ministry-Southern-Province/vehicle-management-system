import { formatLocalDateTime } from "../../utils/dateTime";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiCheckCircle,
  FiMapPin,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { getApprovedJourneys } from "../../api/authApi";
import DashboardLayout from "../../layouts/DashboardLayout";

import { actualJourneyDistance, totalActualJourneyDistance, allocatedJourneyDistance, totalAllocatedJourneyDistance, extraJourneyFuel, totalExtraJourneyFuel } from "../../utils/journeyDistance";
import { useLanguage } from "../../context/useLanguage";
import { filterFuelJourneys } from "../../utils/fuelJourneyFilters";

const requestNumber = (id) => `REQ-${String(id).padStart(4, "0")}`;

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
  const { t } = useLanguage();
  const formatDistance = (distance) => distance == null
    ? t("odometer.notRecorded")
    : `${distance.toFixed(2)} km`;
  const [journeys, setJourneys] = useState([]);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const invalidRange = Boolean(from && to && from > to);
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

  const filteredJourneys = useMemo(() => filterFuelJourneys(journeys, { vehicleNumber, driverName, from, to }),
    [journeys, vehicleNumber, driverName, from, to]);

  const summary = useMemo(() => {
    return {
      totalDistance: totalActualJourneyDistance(journeys),
      allocatedDistance: totalAllocatedJourneyDistance(journeys),
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

  const totalExtraFuel = totalExtraJourneyFuel(filteredJourneys);

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
            {t("odometer.reviewCompleted")}
          </p>
        </header>

        <section
          className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"
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
            label={t("odometer.totalActual")}
            value={formatDistance(summary.totalDistance)}
            detail={t("odometer.totalDetail")}
          />
          <SummaryCard icon={<FiMapPin size={21} />} label={t("fuel.totalAllocated")} value={formatDistance(summary.allocatedDistance)} detail={t("fuel.allocatedDetail")} />
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
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Completed journey details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredJourneys.length} completed trip records
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto]">
              {[
                ["vehicle", "search", vehicleNumber, setVehicleNumber],
                ["driverName", "search", driverName, setDriverName],
                ["completedFrom", "date", from, setFrom],
                ["completedTo", "date", to, setTo],
              ].map(([key, type, value, setValue]) => (
                <label key={key} className="min-w-0 text-xs font-semibold text-slate-600">
                  {t(`fuel.${key}`)}
                  <input type={type} value={value} onChange={(event) => setValue(event.target.value)}
                    max={key === "completedFrom" ? to || undefined : undefined}
                    min={key === "completedTo" ? from || undefined : undefined}
                    aria-invalid={type === "date" && invalidRange}
                    aria-describedby={type === "date" && invalidRange ? "fuel-date-error" : undefined}
                    className="mt-1 w-full min-w-0 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </label>
              ))}
              <button type="button" onClick={() => { setVehicleNumber(""); setDriverName(""); setFrom(""); setTo(""); }}
                className="self-end rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-500">
                {t("fuel.clearFilters")}
              </button>
            </div>
            {invalidRange && <p id="fuel-date-error" role="alert" className="text-sm text-red-700">{t("fuel.invalidRange")}</p>}
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
                    <th className="px-5 py-3 font-semibold">{t("fuel.driverName")}</th>
                    <th className="px-5 py-3 font-semibold">Journey Route</th>
                    <th className="px-5 py-3 text-right font-semibold">{t("odometer.allocated")}</th>
                    <th className="px-5 py-3 text-right font-semibold">{t("odometer.actual")}</th>
                    <th className="px-5 py-3 text-right font-semibold">{t("fuel.extraFuel")}</th>
                    <th className="px-5 py-3 font-semibold">{t("nav.details")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredJourneys.map((journey) => {
                    const vehicle = journey.allocated_vehicle;
                    const driver = journey.allocated_driver;
                    const extraFuel = extraJourneyFuel(journey);
                    return (
                      <tr key={journey.id} className="align-top hover:bg-blue-50/40">
                        <td className="whitespace-nowrap px-5 py-4 font-bold text-blue-700">
                          {requestNumber(journey.id)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">
                          {vehicle?.registration_number || "Not assigned"}
                        </td>
                        <td className="px-5 py-4 font-semibold">{driver?.full_name || t("odometer.notRecorded")}</td>
                        <td className="min-w-64 px-5 py-4">{locationLabel(journey, "starting", t, true)} - {locationLabel(journey, "destination", t, true)}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-right font-bold text-blue-700">{formatDistance(allocatedJourneyDistance(journey))}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-right">
                          <p className="font-bold text-emerald-700">
                            {formatDistance(actualJourneyDistance(journey))}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-right font-semibold">
                          {extraFuel == null ? t("odometer.notRecorded") : `${extraFuel.toFixed(2)} L`}
                        </td>
                        <td className="px-5 py-4"><button type="button" onClick={() => setSelectedJourney(journey)}
                          className="whitespace-nowrap rounded-lg border border-blue-200 px-3 py-2 font-semibold text-blue-700 hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500">
                          {t("fuel.view")}</button></td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="border-t border-slate-200 bg-blue-50 font-bold"><tr>
                  <th colSpan={4} className="px-5 py-4">{t("fuel.filteredTotals")}</th>
                  <td className="whitespace-nowrap px-5 py-4 text-right">{formatDistance(totalAllocatedJourneyDistance(filteredJourneys))}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-right">{formatDistance(totalActualJourneyDistance(filteredJourneys))}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-right">{totalExtraFuel == null ? t("odometer.notRecorded") : `${totalExtraFuel.toFixed(2)} L`}</td><td />
                </tr></tfoot>
              </table>
            </div>
          )}
        </section>
      </div>
      {selectedJourney && <JourneyDetails journey={selectedJourney} onClose={() => setSelectedJourney(null)} />}
    </DashboardLayout>
  );
}

function locationLabel(journey, prefix, t, short = false) {
  const label = prefix === "starting" ? journey.starting_location : journey.destination;
  if (label) return short ? label.split(",")[0].trim() : label;
  const lat = journey[`${prefix}_latitude`], lng = journey[`${prefix}_longitude`];
  return lat != null && lng != null && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))
    ? `${Number(lat).toFixed(6)}, ${Number(lng).toFixed(6)}` : t("odometer.notRecorded");
}
function JourneyDetails({ journey: j, onClose }) {
  const { t } = useLanguage();
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => element.close();
  }, []);
  const fields = [
    ["requester", j.requester_name || j.user?.name], ["department", j.user?.department],
    ["purpose", j.purpose], ["starting", locationLabel(j, "starting", t)], ["destination", locationLabel(j, "destination", t)],
    ["passengers", j.passenger_count], ["passengerNames", Array.isArray(j.passenger_names) ? j.passenger_names.join(", ") : j.passenger_names],
    ["driverName", j.allocated_driver?.full_name], ["driverId", j.allocated_driver?.driver_id],
    ["vehicle", j.allocated_vehicle?.registration_number], ["parking", j.parking_location],
    ["recommender", j.recommender?.name], ["notes", j.recommendation_notes], ["allocator", j.allocator?.name], ["approver", j.approver?.name],
    ...["departure_at", "expected_return_at", "journey_started_at", "journey_completed_at", "recommended_at", "allocated_at", "approved_at", "reallocated_at"]
      .map(key => [key, formatLocalDateTime(j[key], t("odometer.notRecorded"))]), ["reallocation", j.reallocation_reason],
  ].map(([key, value]) => [t(`fuel.${key}`), value]);
  fields.push(...[["allocated", allocatedJourneyDistance(j)], ["actual", actualJourneyDistance(j)], ["start", j.start_odometer_km], ["end", j.end_odometer_km]]
    .map(([key, value]) => [t(`odometer.${key}`), value == null ? t("odometer.notRecorded") : `${Number(value).toFixed(2)} km`]));
  return <dialog ref={dialog} onCancel={onClose} aria-labelledby="fuel-journey-title"
    className="fixed inset-0 m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl backdrop:bg-slate-950/50">
    <header className="mb-5 flex items-center justify-between gap-4"><h2 id="fuel-journey-title" className="text-lg font-bold">{requestNumber(j.id)} — {t("nav.details")}</h2>
      <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 focus-visible:ring-2">{t("fuel.close")}</button></header>
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{fields.map(([label, value]) => <div key={label} className="min-w-0">
      <dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm font-medium">{value == null || value === "" ? t("odometer.notRecorded") : value}</dd></div>)}</dl>
    {j.attachment_url && <a className="mt-4 inline-block text-blue-700 underline" href={j.attachment_url} target="_blank" rel="noreferrer">{t("fuel.attachment")}</a>}
  </dialog>;
}
