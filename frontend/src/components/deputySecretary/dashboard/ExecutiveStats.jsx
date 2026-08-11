import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiArrowUpRight,
  FiClipboard,
  FiTool,
  FiTruck,
  FiUsers,
} from "react-icons/fi";
import {
  getDrivers,
  getExecutiveStats,
  getVehicles,
} from "../../../api/authApi";

const CURRENT_YEAR = new Date().getFullYear();

const sumAnnualCosts = (vehicles, detailsKey, dateKey) =>
  vehicles.reduce((total, vehicle) => {
    const details = Array.isArray(vehicle[detailsKey])
      ? vehicle[detailsKey]
      : [];

    return (
      total +
      details.reduce((detailTotal, detail) => {
        const date = new Date(detail[dateKey]);
        if (
          Number.isNaN(date.getTime()) ||
          date.getFullYear() !== CURRENT_YEAR
        ) {
          return detailTotal;
        }
        return detailTotal + (Number(detail.cost) || 0);
      }, 0)
    );
  }, 0);

/* ------------------------------------------------------------------ */
/*  Animated counter — counts up from 0 to the numeric part of value  */
/*  on mount, preserving any prefix/suffix ("$", "L", "h", etc.)      */
/* ------------------------------------------------------------------ */
function useCountUp(value, duration = 900) {
  const raw = String(value ?? "");
  const hasNumericValue = /-?\d[\d,]*\.?\d*/.test(raw);
  const [display, setDisplay] = useState(() => (hasNumericValue ? "0" : raw));
  const frameRef = useRef(null);

  useEffect(() => {
    const raw = String(value ?? "");
    const match = raw.match(/-?\d[\d,]*\.?\d*/);
    if (!match) return;

    const target = parseFloat(match[0].replace(/,/g, ""));
    const prefix = raw.slice(0, match.index);
    const suffix = raw.slice(match.index + match[0].length);
    const decimals = (match[0].split(".")[1] || "").length;

    if (Number.isNaN(target)) return;

    let start = null;
    cancelAnimationFrame(frameRef.current);

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = (target * eased).toFixed(decimals);
      setDisplay(`${prefix}${current}${suffix}`);
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return hasNumericValue ? display : raw;
}

/* ------------------------------------------------------------------ */
/*  Color tones — icon gradient, glow, ring, and trend badge colors   */
/*  Keep this map in sync with any tone used below in `stats`         */
/* ------------------------------------------------------------------ */
const TONES = {
  blue: {
    icon: "from-blue-500 to-blue-600",
    glow: "bg-blue-500/10",
    ring: "ring-blue-100",
    text: "text-blue-600",
  },
  emerald: {
    icon: "from-emerald-500 to-emerald-600",
    glow: "bg-emerald-500/10",
    ring: "ring-emerald-100",
    text: "text-emerald-600",
  },
  rose: {
    icon: "from-rose-500 to-rose-600",
    glow: "bg-rose-500/10",
    ring: "ring-rose-100",
    text: "text-rose-600",
  },
  amber: {
    icon: "from-amber-400 to-amber-500",
    glow: "bg-amber-500/10",
    ring: "ring-amber-100",
    text: "text-amber-600",
  },
  indigo: {
    icon: "from-indigo-500 to-indigo-600",
    glow: "bg-indigo-500/10",
    ring: "ring-indigo-100",
    text: "text-indigo-600",
  },
  red: {
    icon: "from-red-500 to-red-600",
    glow: "bg-red-500/10",
    ring: "ring-red-100",
    text: "text-red-600",
  },
  orange: {
    icon: "from-orange-500 to-orange-600",
    glow: "bg-orange-500/10",
    ring: "ring-orange-100",
    text: "text-orange-600",
  },
  cyan: {
    icon: "from-cyan-500 to-cyan-600",
    glow: "bg-cyan-500/10",
    ring: "ring-cyan-100",
    text: "text-cyan-600",
  },
  teal: {
    icon: "from-teal-500 to-teal-600",
    glow: "bg-teal-500/10",
    ring: "ring-teal-100",
    text: "text-teal-600",
  },
  fuchsia: {
    icon: "from-fuchsia-500 to-fuchsia-600",
    glow: "bg-fuchsia-500/10",
    ring: "ring-fuchsia-100",
    text: "text-fuchsia-600",
  },
};

/* ------------------------------------------------------------------ */
/*  Data — grouped into 3 rows. Only `path` is wired up; the actual   */
/*  destination pages are built separately.                           */
/* ------------------------------------------------------------------ */
const createOverviewStats = (data) => [
  {
    title: "Available Vehicles",
    value: data.available_vehicles ?? 0,
    icon: <FiTruck />,
    path: "/totalvehicles?status=available",
    tone: "emerald",
  },
  {
    title: "Available Drivers",
    value: data.available_drivers ?? 0,
    icon: <FiUsers />,
    path: "/driverdetails?status=available",
    tone: "blue",
  },
  {
    title: "Pending Approvals",
    value: data.pending_approvals ?? 0,
    icon: <FiClock />,
    path: "/pendingapprovals",
    tone: "amber",
  },
  {
    title: "Pending Recommendation",
    value: data.pending_recommendations ?? 0,
    icon: <FiClipboard />,
    path: "/deputy/pending-recommendations",
    tone: "indigo",
  },
];

const createCostStats = (data) => [
  {
    title: `Fuel Cost (${CURRENT_YEAR})`,
    value: `LKR ${Number(data.fuel_cost || 0).toLocaleString()}`,
    icon: <FiCreditCard />,
    path: "/fuelmanagement",
    tone: "teal",
  },
  {
    title: `Service Cost (${CURRENT_YEAR})`,
    value: `LKR ${Number(data.maintenance_cost || 0).toLocaleString()}`,
    icon: <FiTool />,
    path: "/servicerecords",
    tone: "fuchsia",
  },
  {
    title: `Repair Cost (${CURRENT_YEAR})`,
    value: `LKR ${Number(data.repair_cost || 0).toLocaleString()}`,
    icon: <FiDollarSign />,
    path: "/repairrecords",
    tone: "red",
  },
];

/* ------------------------------------------------------------------ */
/*  Single card                                                       */
/* ------------------------------------------------------------------ */
function StatCard({ title, value, icon, path, tone }) {
  const navigate = useNavigate();
  const palette = TONES[tone] || TONES.blue;
  const animatedValue = useCountUp(value);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(path)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && navigate(path)}
      aria-label={`View ${title} details`}
      className={[
        "group relative min-h-[150px] cursor-pointer overflow-hidden rounded-[22px]",
        "border border-white/80 bg-linear-to-br from-white via-white to-slate-50/80 p-4 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 sm:min-h-[176px] sm:p-5",
        "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_14px_35px_-20px_rgba(15,23,42,0.28)]",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:border-slate-200 hover:shadow-[0_24px_48px_-20px_rgba(15,23,42,0.3)]",
        "active:translate-y-0 active:scale-[0.985]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        palette.ring,
      ].join(" ")}
    >
      {/* ambient glow */}
      <div
        className={[
          "pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full blur-3xl",
          "opacity-70 transition-all duration-500 group-hover:scale-125 group-hover:opacity-100",
          palette.glow,
        ].join(" ")}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div
          className={[
            "flex h-11 w-11 items-center justify-center rounded-[14px] text-lg text-white shadow-lg shadow-slate-900/10 sm:h-12 sm:w-12 sm:text-xl",
            "bg-linear-to-br transition-transform duration-300",
            "group-hover:scale-110 group-hover:rotate-3",
            palette.icon,
          ].join(" ")}
        >
          {icon}
        </div>

        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/80 bg-white/80 shadow-sm transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105 dark:border-slate-700 dark:bg-slate-800/80">
          <FiArrowUpRight className={`h-4 w-4 ${palette.text}`} />
        </span>
      </div>

      <p className="relative mt-4 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400 sm:mt-5 sm:text-[13px]">
        {title}
      </p>
      <h2 className="relative mt-1.5 break-words text-[22px] font-extrabold leading-tight tracking-tight text-slate-900 tabular-nums dark:text-white sm:text-[28px]">
        {animatedValue}
      </h2>
      <p className="relative mt-3 flex items-center gap-2 text-[10px] font-semibold text-slate-400 sm:text-xs">
        <span className={`h-1.5 w-1.5 rounded-full ${palette.glow}`} />
        Tap to view details
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Row wrapper — label + responsive grid                             */
/* ------------------------------------------------------------------ */
function StatRow({ label, items, columns = 4 }) {
  return (
    <section className="mb-7 last:mb-0">
      <div className="mb-3 flex items-center gap-3 sm:mb-4">
        <h3 className="shrink-0 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 sm:text-xs">{label}</h3>
        <div className="h-px flex-1 bg-linear-to-r from-slate-200 to-transparent dark:from-slate-700" />
      </div>
      <div
        className={`grid gap-3 sm:grid-cols-2 sm:gap-4 ${columns === 3 ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-2 lg:grid-cols-4"}`}
      >
        {items.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported section                                                  */
/* ------------------------------------------------------------------ */
export default function ExecutiveStats() {
  const [data, setData] = useState({
    pending_approvals: 0,
    available_vehicles: 0,
    available_drivers: 0,
    pending_recommendations: 0,
    fuel_cost: 0,
    maintenance_cost: 0,
    repair_cost: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [statsResponse, vehiclesResponse, driversResponse] =
          await Promise.all([
            getExecutiveStats(),
            getVehicles(),
            getDrivers(),
          ]);
        const vehicles = vehiclesResponse?.data?.vehicles;
        const drivers = driversResponse?.data?.drivers;
        if (!Array.isArray(vehicles)) {
          throw new Error("Unable to read vehicle cost records.");
        }
        if (!Array.isArray(drivers)) {
          throw new Error("Unable to read driver records.");
        }

        setData({
          ...(statsResponse?.data || {}),
          available_drivers: drivers.filter(
            (driver) => driver.status?.toLowerCase() === "available",
          ).length,
          fuel_cost: sumAnnualCosts(vehicles, "fuel_details", "date"),
          maintenance_cost: sumAnnualCosts(
            vehicles,
            "service_details",
            "service_date",
          ),
          repair_cost: sumAnnualCosts(
            vehicles,
            "repair_details",
            "repair_date",
          ),
        });
      } catch (loadError) {
        setError(loadError?.message || "Unable to load dashboard statistics.");
      }
    };
    loadStats();
  }, []);

  return (
    <div className="rounded-[26px] border border-white/80 bg-white/60 p-3 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50 sm:p-5 lg:p-6">
      <StatRow
        label="Fleet & Approvals"
        items={createOverviewStats(data)}
      />
      <StatRow
        label={`Fleet Costs (${CURRENT_YEAR})`}
        items={createCostStats(data)}
        columns={3}
      />
      {error && (
        <p className="mt-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
