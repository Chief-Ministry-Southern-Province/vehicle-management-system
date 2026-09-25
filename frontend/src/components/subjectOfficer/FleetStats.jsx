import { FiAlertTriangle, FiDroplet, FiTool, FiTruck } from "react-icons/fi";
import { useEffect, useState } from "react";
import { getVehicles } from "../../api/authApi";
import { useLanguage } from "../../context/useLanguage";

const money = (value) =>
  `LKR ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const getErrorMessage = (error) => {
  const message = error?.message || error?.error;
  return typeof message === "string"
    ? message
    : "Unable to load the fleet overview.";
};

export default function FleetStats() {
  const { translate } = useLanguage();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadFleetStats = async () => {
      try {
        const response = await getVehicles();
        const records = response?.data?.vehicles ?? response?.vehicles;

        if (!Array.isArray(records)) {
          throw new Error("Unable to read vehicle records.");
        }

        if (active) {
          setVehicles(records);
          setError("");
        }
      } catch (loadError) {
        if (active) {
          setVehicles([]);
          setError(getErrorMessage(loadError));
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadFleetStats();

    return () => {
      active = false;
    };
  }, []);

  const serviceRecords = vehicles.flatMap((vehicle) =>
    Array.isArray(vehicle.service_details) ? vehicle.service_details : [],
  );
  const repairRecords = vehicles.flatMap((vehicle) =>
    Array.isArray(vehicle.repair_details) ? vehicle.repair_details : [],
  );
  const fuelRecords = vehicles.flatMap((vehicle) =>
    Array.isArray(vehicle.fuel_details) ? vehicle.fuel_details : [],
  );
  const repairCost = repairRecords.reduce(
    (total, repair) => total + (Number(repair.cost) || 0),
    0,
  );
  const serviceCost = serviceRecords.reduce(
    (total, service) => total + (Number(service.cost) || 0),
    0,
  );
  const fuelCost = fuelRecords.reduce(
    (total, fuel) => total + (Number(fuel.cost) || 0),
    0,
  );
  const hasStatus = (status) =>
    vehicles.filter(
      (vehicle) => vehicle.status?.toLowerCase() === status,
    ).length;

  const stats = [
    {
      title: translate("Total Vehicles"),
      value: vehicles.length,
      icon: <FiTruck />,
      iconClass: "bg-blue-600",
      accentClass: "bg-blue-600",
    },
    {
      title: translate("Available Now"),
      value: hasStatus("available"),
      icon: <FiTruck />,
      iconClass: "bg-emerald-500",
      accentClass: "bg-emerald-500",
    },
    {
      title: translate("Unavailable Now"),
      value: hasStatus("unavailable"),
      icon: <FiTruck />,
      iconClass: "bg-slate-500",
      accentClass: "bg-slate-500",
    },
    {
      title: translate("Maintenance"),
      value: hasStatus("maintenance"),
      icon: <FiTool />,
      iconClass: "bg-amber-500",
      accentClass: "bg-amber-500",
    },
    {
      title: translate("Fuel Cost"),
      value: money(fuelCost),
      icon: <FiDroplet />,
      iconClass: "bg-teal-500",
      accentClass: "bg-teal-500",
    },
    {
      title: translate("Service Costs"),
      value: money(serviceCost),
      icon: <FiTool />,
      iconClass: "bg-fuchsia-600",
      accentClass: "bg-fuchsia-600",
    },
    {
      title: translate("Repair Expense"),
      value: money(repairCost),
      icon: <FiAlertTriangle />,
      iconClass: "bg-rose-500",
      accentClass: "bg-rose-500",
    },
  ];

  if (loading)
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="h-[126px] animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:h-[152px] sm:rounded-[24px]"
          />
        ))}
      </div>
    );
  if (error)
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {error}
      </div>
    );

  return (
    <section className="space-y-7">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="shrink-0 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 sm:text-xs">Fleet overview</h2>
          <div className="h-px flex-1 bg-linear-to-r from-slate-300/90 to-transparent dark:from-slate-700" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {stats.slice(0, 4).map((item) => (
            <StatCard key={item.title} item={item} />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="shrink-0 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 sm:text-xs">Fleet costs</h2>
          <div className="h-px flex-1 bg-linear-to-r from-slate-300/90 to-transparent dark:from-slate-700" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
          {stats.slice(4).map((item) => (
            <StatCard key={item.title} item={item} compactValue />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ item, compactValue = false }) {
  return (
    <article className="group relative min-h-[120px] min-w-0 overflow-hidden rounded-[20px] border border-slate-200 bg-white px-4 py-4 shadow-[0_5px_14px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_24px_rgba(15,23,42,0.12)] sm:min-h-[152px] sm:rounded-[24px] sm:px-6 sm:py-7 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="flex min-w-0 items-start justify-between gap-3 sm:gap-4">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg text-white shadow-[0_8px_16px_-8px_rgba(15,23,42,0.7)] transition-transform duration-200 group-hover:scale-105 sm:h-12 sm:w-12 sm:rounded-[15px] sm:text-xl ${item.iconClass}`}>
          {item.icon}
        </span>
        <strong className={`min-w-0 break-words text-right font-extrabold leading-tight tracking-tight text-slate-900 tabular-nums dark:text-white ${compactValue ? "text-xl sm:text-[30px]" : "text-3xl sm:text-4xl"}`}>
          {item.value}
        </strong>
      </div>
      <p className="mt-5 text-[11px] font-extrabold uppercase tracking-wide text-slate-600 sm:mt-6 sm:text-sm dark:text-slate-300">
        {item.title}
      </p>
      <span className={`absolute inset-x-0 bottom-0 h-[3px] ${item.accentClass}`} />
    </article>
  );
}
