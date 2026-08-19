import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiMapPin,
  FiRefreshCw,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { getApprovedJourneys, getDrivers } from "../../api/authApi";
import DashboardLayout from "../../layouts/DashboardLayout";

const DAY_START = 6;
const DAY_END = 22;
const HOUR_COLUMNS = Array.from(
  { length: DAY_END - DAY_START },
  (_, index) => DAY_START + index,
);

const STATUS = {
  scheduled: {
    label: "Scheduled Trip",
    card: "border-amber-300 bg-amber-100 text-amber-950",
    dot: "bg-amber-500",
  },
  ongoing: {
    label: "Ongoing Trip",
    card: "border-blue-400 bg-blue-100 text-blue-950",
    dot: "bg-blue-500",
  },
  completed: {
    label: "Completed Trip",
    card: "border-emerald-400 bg-emerald-100 text-emerald-950",
    dot: "bg-emerald-500",
  },
};

const toDateInput = (date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const formatHour = (hour) => {
  const value = hour % 12 || 12;
  return `${value}:00 ${hour < 12 ? "AM" : "PM"}`;
};

const formatTime = (value) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const requestNumber = (id) => `REQ-${String(id).padStart(4, "0")}`;

const getJourneyStatus = (journey) => {
  if (journey.journey_status === "completed" || journey.status === "completed") {
    return "completed";
  }
  if (["ongoing", "issue"].includes(journey.journey_status)) return "ongoing";
  return "scheduled";
};

const getDriverKey = (journey) =>
  journey.allocated_driver?.id ||
  journey.allocated_driver_id ||
  journey.allocated_driver?.driver_id ||
  `unassigned-${journey.id}`;

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {Object.entries(STATUS).map(([key, item]) => (
        <span key={key} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
          <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function TripCard({ journey, dayStart }) {
  const status = getJourneyStatus(journey);
  const style = STATUS[status];
  const start = Math.max(new Date(journey.departure_at).getTime(), dayStart.getTime());
  const end = Math.min(
    new Date(journey.expected_return_at).getTime(),
    dayStart.getTime() + 24 * 60 * 60 * 1000,
  );
  const visibleStart = Math.max(DAY_START, (start - dayStart.getTime()) / 3600000);
  const visibleEnd = Math.min(DAY_END, (end - dayStart.getTime()) / 3600000);
  const left = ((visibleStart - DAY_START) / (DAY_END - DAY_START)) * 100;
  const width = Math.max(((visibleEnd - visibleStart) / (DAY_END - DAY_START)) * 100, 3.5);
  const vehicle = journey.allocated_vehicle || {};

  return (
    <article
      className={`absolute top-2 bottom-2 overflow-hidden rounded-lg border px-2.5 py-2 shadow-sm transition hover:z-20 hover:min-w-52 hover:shadow-md ${style.card}`}
      style={{ left: `${left}%`, width: `${Math.min(width, 100 - left)}%` }}
      title={`${journey.purpose || "Trip"} • ${formatTime(journey.departure_at)} – ${formatTime(journey.expected_return_at)}`}
    >
      <div className="flex items-center gap-1.5 truncate text-xs font-bold">
        <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
        {formatTime(journey.departure_at)} – {formatTime(journey.expected_return_at)}
      </div>
      <p className="mt-1 truncate text-xs font-semibold">
        {journey.purpose || journey.destination || requestNumber(journey.id)}
      </p>
      <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] opacity-80">
        <FiTruck className="shrink-0" />
        {vehicle.registration_number || "Vehicle not recorded"}
      </p>
    </article>
  );
}

export default function DailyScheduleTrips() {
  const [selectedDate, setSelectedDate] = useState(() => toDateInput(new Date()));
  const [journeys, setJourneys] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadJourneys = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [journeysResponse, driversResponse] = await Promise.all([
        getApprovedJourneys(),
        getDrivers(),
      ]);
      setJourneys(journeysResponse?.data?.requests || []);
      setDrivers(driversResponse?.data?.drivers || []);
    } catch (requestError) {
      setJourneys([]);
      setDrivers([]);
      setError(requestError?.message || "Unable to load the daily trip schedule.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(loadJourneys, 0);
    return () => clearTimeout(timeoutId);
  }, [loadJourneys]);

  const dayStart = useMemo(() => new Date(`${selectedDate}T00:00:00`), [selectedDate]);
  const dayEnd = useMemo(
    () => new Date(dayStart.getTime() + 24 * 60 * 60 * 1000),
    [dayStart],
  );

  const dailyJourneys = useMemo(
    () =>
      journeys.filter((journey) => {
        // The endpoint also serves cancelled records to another screen. This
        // schedule intentionally permits only finally approved/completed trips.
        if (!["approved", "completed"].includes(journey.status)) return false;
        if (!journey.approved_at || !journey.allocated_driver) return false;
        const departure = new Date(journey.departure_at);
        const expectedReturn = new Date(journey.expected_return_at);
        return departure < dayEnd && expectedReturn > dayStart;
      }),
    [dayEnd, dayStart, journeys],
  );

  const driverRows = useMemo(() => {
    const journeysByDriver = new Map();
    dailyJourneys.forEach((journey) => {
      const key = getDriverKey(journey);
      if (!journeysByDriver.has(key)) journeysByDriver.set(key, []);
      journeysByDriver.get(key).push(journey);
    });

    return drivers
      .map((driver) => ({
        driver,
        journeys: (journeysByDriver.get(driver.id) || []).sort(
          (a, b) => new Date(a.departure_at) - new Date(b.departure_at),
        ),
      }))
      .sort((a, b) =>
        (a.driver.driver_id || "").localeCompare(b.driver.driver_id || "", undefined, {
          numeric: true,
          sensitivity: "base",
        }),
      );
  }, [dailyJourneys, drivers]);

  const totals = useMemo(
    () =>
      dailyJourneys.reduce(
        (result, journey) => {
          result[getJourneyStatus(journey)] += 1;
          return result;
        },
        { scheduled: 0, ongoing: 0, completed: 0 },
      ),
    [dailyJourneys],
  );

  const changeDay = (amount) => {
    const next = new Date(`${selectedDate}T12:00:00`);
    next.setDate(next.getDate() + amount);
    setSelectedDate(toDateInput(next));
  };

  const dateHeading = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(dayStart);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1600px] space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Fleet operations</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">Daily Journey Schedule</h1>
            <p className="mt-2 text-sm text-slate-500">Compare every driver’s approved journeys, assigned vehicle, and trip progress.</p>
          </div>
          <button type="button" onClick={loadJourneys} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60">
            <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => changeDay(-1)} aria-label="Previous day" className="rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"><FiChevronLeft /></button>
              <label className="relative">
                <FiCalendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" />
                <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </label>
              <button type="button" onClick={() => changeDay(1)} aria-label="Next day" className="rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"><FiChevronRight /></button>
              <button type="button" onClick={() => setSelectedDate(toDateInput(new Date()))} className="rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100">Today</button>
            </div>
            <Legend />
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4">
          <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-linear-to-br from-white to-blue-50 p-3 shadow-sm sm:rounded-2xl sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm text-white shadow-sm sm:h-9 sm:w-9">
                <FiCalendar />
              </span>
              <p className="text-2xl font-extrabold leading-none text-slate-900 sm:text-3xl">{dailyJourneys.length}</p>
            </div>
            <p className="mt-3 text-[10px] font-bold uppercase leading-4 tracking-wide text-blue-700 sm:text-xs">Approved trips</p>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500" />
          </div>
          {Object.entries(STATUS).map(([key, item]) => (
            <div key={key} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.card}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
                </span>
                <p className="text-2xl font-extrabold leading-none text-slate-900 sm:text-3xl">{totals[key]}</p>
              </div>
              <p className="mt-3 text-[10px] font-bold uppercase leading-4 tracking-wide text-slate-600 sm:text-xs">{item.label}</p>
              <div className={`absolute inset-x-0 bottom-0 h-0.5 ${item.dot}`} />
            </div>
          ))}
        </div>

        {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4"><h2 className="font-bold text-slate-900">{dateHeading}</h2><p className="mt-1 text-xs text-slate-500">Only approved journeys are shown. Cancelled trips are excluded.</p></div>
          {loading ? (
            <div className="p-14 text-center text-sm text-slate-500">Loading approved journeys…</div>
          ) : !error && driverRows.length === 0 ? (
            <div className="p-14 text-center"><FiUser className="mx-auto text-3xl text-slate-300" /><p className="mt-3 font-semibold text-slate-700">No drivers recorded</p><p className="mt-1 text-sm text-slate-500">Add drivers to view the daily schedule.</p></div>
          ) : !error ? (
            <div className="overflow-x-auto">
              <div className="min-w-[1180px]">
                <div className="grid grid-cols-[220px_1fr] border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-2 border-r border-slate-200 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500"><FiUser /> Driver</div>
                  <div className="grid" style={{ gridTemplateColumns: `repeat(${HOUR_COLUMNS.length}, minmax(0, 1fr))` }}>
                    {HOUR_COLUMNS.map((hour) => <div key={hour} className="border-r border-slate-200 px-1 py-3 text-center text-[11px] font-semibold text-slate-500 last:border-r-0">{formatHour(hour)}</div>)}
                  </div>
                </div>
                {driverRows.map(({ driver, journeys: driverJourneys }, index) => (
                  <div key={driver.id || driver.driver_id || index} className="grid min-h-24 grid-cols-[220px_1fr] border-b border-slate-100 last:border-b-0">
                    <div className="flex flex-col justify-center border-r border-slate-200 bg-white px-4 py-3">
                      <p className="truncate text-sm font-bold text-slate-800">{driver.full_name || "Driver not recorded"}</p>
                      <p className="mt-1 text-xs text-slate-500">{driver.driver_id || "No driver ID"}</p>
                      <p className="mt-1 text-xs font-semibold text-blue-600">{driverJourneys.length} {driverJourneys.length === 1 ? "trip" : "trips"}</p>
                    </div>
                    <div className="relative bg-white" style={{ backgroundImage: `repeating-linear-gradient(to right, transparent 0, transparent calc(${100 / HOUR_COLUMNS.length}% - 1px), rgb(226 232 240) calc(${100 / HOUR_COLUMNS.length}% - 1px), rgb(226 232 240) ${100 / HOUR_COLUMNS.length}%)` }}>
                      {driverJourneys.map((journey) => <TripCard key={journey.id} journey={journey} dayStart={dayStart} />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        {!loading && !error && dailyJourneys.length > 0 && (
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">Journey details</h2>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {[...dailyJourneys].sort((a, b) => new Date(a.departure_at) - new Date(b.departure_at)).map((journey) => {
                const status = getJourneyStatus(journey); const style = STATUS[status];
                return <article key={journey.id} className={`rounded-2xl border p-4 ${style.card}`}><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="font-bold">{journey.allocated_driver?.full_name}</p><p className="mt-0.5 text-xs opacity-75">{requestNumber(journey.id)}</p></div><span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-bold">{style.label}</span></div><p className="mt-3 flex items-center gap-2 text-sm font-semibold"><FiClock /> {formatTime(journey.departure_at)} – {formatTime(journey.expected_return_at)}</p><p className="mt-2 flex items-center gap-2 text-sm"><FiMapPin /> {journey.purpose || "Trip"}{journey.destination ? ` • ${journey.destination}` : ""}</p><p className="mt-2 flex items-center gap-2 text-sm"><FiTruck /> {journey.allocated_vehicle?.registration_number || "Vehicle not recorded"}</p></article>;
              })}
            </div>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
