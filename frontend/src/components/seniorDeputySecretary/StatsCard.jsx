import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiArrowUpRight,
  FiTool,
  FiTruck,
  FiUsers,
} from "react-icons/fi";
import { getDrivers, getExecutiveStats, getVehicles } from "../../api/authApi";

const CURRENT_YEAR = new Date().getFullYear();

const sumAnnualCosts = (vehicles, detailsKey, dateKey) =>
  vehicles.reduce((total, vehicle) => {
    const records = Array.isArray(vehicle[detailsKey])
      ? vehicle[detailsKey]
      : [];

    return (
      total +
      records.reduce((recordTotal, record) => {
        const date = new Date(record[dateKey]);
        if (
          Number.isNaN(date.getTime()) ||
          date.getFullYear() !== CURRENT_YEAR
        ) {
          return recordTotal;
        }
        return recordTotal + (Number(record.cost) || 0);
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
    title: "Pending Final Approvals",
    value: data.pending_approvals ?? 0,
    icon: <FiClock />,
    path: "/pendingfinalapprovals",
    tone: "amber",
  },
  {
    title: "Total Vehicles",
    value: data.total_vehicles ?? 0,
    icon: <FiTruck />,
    path: "/totalvehicles",
    tone: "emerald",
  },
  {
    title: "Total Drivers",
    value: data.total_drivers ?? 0,
    icon: <FiUsers />,
    path: "/driverdetails",
    tone: "blue",
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
        "group relative cursor-pointer overflow-hidden rounded-[18px]",
        "border border-slate-100 bg-white/80 backdrop-blur-sm p-5 dark:border-slate-700 dark:bg-slate-800",
        "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(15,23,42,0.18)]",
        "hover:border-slate-200 active:translate-y-0 active:scale-[0.99]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        palette.ring,
      ].join(" ")}
    >
      {/* ambient glow */}
      <div
        className={[
          "pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full blur-2xl",
          "opacity-60 transition-opacity duration-300 group-hover:opacity-100",
          palette.glow,
        ].join(" ")}
      />

      <div className="relative flex items-start justify-between">
        <div
          className={[
            "flex h-11 w-11 items-center justify-center rounded-xl text-white text-lg shadow-md",
            "bg-linear-to-br transition-transform duration-300",
            "group-hover:scale-110 group-hover:rotate-3",
            palette.icon,
          ].join(" ")}
        >
          {icon}
        </div>

        <FiArrowUpRight
          className={[
            "h-4 w-4 opacity-0 -translate-x-1 translate-y-1",
            "transition-all duration-300",
            "group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0",
            palette.text,
          ].join(" ")}
        />
      </div>

      <p className="relative mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <h2 className="relative mt-1 text-[26px] leading-tight font-bold text-slate-800 dark:text-white tabular-nums">
        {animatedValue}
      </h2>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Row wrapper — label + responsive grid                             */
/* ------------------------------------------------------------------ */
function StatRow({ label, items }) {
  return (
    <div className="mb-6 last:mb-0">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-300">
        {label}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported section                                                  */
/* ------------------------------------------------------------------ */
export default function StatsCard() {
  const [data, setData] = useState({
    pending_approvals: 0,
    total_vehicles: 0,
    total_drivers: 0,
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

        if (!Array.isArray(vehicles) || !Array.isArray(drivers)) {
          throw new Error("Unable to read fleet statistics.");
        }

        setData({
          ...(statsResponse?.data || {}),
          total_vehicles: vehicles.length,
          total_drivers: drivers.length,
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
    <div>
      <StatRow label="Executive Overview" items={createOverviewStats(data)} />
      <StatRow
        label={`Fleet Costs (${CURRENT_YEAR})`}
        items={createCostStats(data)}
      />
      {error && (
        <p className="mt-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
