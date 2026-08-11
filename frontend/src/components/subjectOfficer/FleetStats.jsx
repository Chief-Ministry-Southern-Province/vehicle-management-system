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
      subtitle: translate("Registered fleet"),
      icon: <FiTruck />,
      bg: "from-blue-500 to-blue-700",
    },
    {
      title: translate("Available Now"),
      value: hasStatus("available"),
      subtitle: translate("Ready for allocation"),
      icon: <FiTruck />,
      bg: "from-emerald-500 to-teal-600",
    },
    {
      title: translate("Unavailable Now"),
      value: hasStatus("unavailable"),
      subtitle: translate("Currently unavailable"),
      icon: <FiTruck />,
      bg: "from-slate-500 to-slate-700",
    },
    {
      title: translate("Maintenance"),
      value: hasStatus("maintenance"),
      subtitle: translate("In maintenance"),
      icon: <FiTool />,
      bg: "from-amber-500 to-orange-600",
    },
    {
      title: translate("Fuel Cost"),
      value: money(fuelCost),
      subtitle: translate("Recorded fuel spending"),
      icon: <FiDroplet />,
      bg: "from-cyan-500 to-sky-600",
    },
    {
      title: translate("Service Costs"),
      value: money(serviceCost),
      subtitle: translate("Recorded service spending"),
      icon: <FiTool />,
      bg: "from-indigo-500 to-violet-600",
    },
    {
      title: translate("Repair Expense"),
      value: money(repairCost),
      subtitle: translate("Recorded repair spending"),
      icon: <FiAlertTriangle />,
      bg: "from-red-500 to-rose-600",
    },
  ];

  if (loading)
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className={`h-36 animate-pulse rounded-[22px] border border-white bg-white/80 dark:border-slate-800 dark:bg-slate-900 sm:h-44 ${index === 6 ? "col-span-2 sm:col-span-1" : ""}`}
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
    <section className="rounded-[26px] border border-white/80 bg-white/60 p-3 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50 sm:p-5 lg:p-6">
      <div className="mb-3 flex items-center gap-3 sm:mb-4">
        <h2 className="shrink-0 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 sm:text-xs">Fleet performance</h2>
        <div className="h-px flex-1 bg-linear-to-r from-slate-200 to-transparent dark:from-slate-700" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
       {stats.map((item, index) => (
        <div
          key={item.title}
          className={`group relative min-h-[150px] min-w-0 overflow-hidden rounded-[22px] border border-white/80 bg-linear-to-br from-white via-white to-slate-50/80 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_14px_35px_-20px_rgba(15,23,42,0.28)] transition-all duration-300 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 sm:min-h-[176px] sm:p-5 sm:hover:-translate-y-1 sm:hover:border-slate-200 sm:hover:shadow-[0_24px_48px_-20px_rgba(15,23,42,0.3)] ${index === stats.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}
        >
          <div className={`pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-linear-to-br opacity-[0.12] blur-3xl transition-transform duration-500 group-hover:scale-125 ${item.bg}`} />
          <div className="relative flex min-w-0 items-start justify-between gap-2 sm:block">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-linear-to-br text-lg text-white shadow-lg shadow-slate-900/10 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110 sm:h-12 sm:w-12 sm:text-xl ${item.bg}`}
            >
              {item.icon}
            </div>
            <h3 className="min-w-0 break-words text-right text-[20px] font-extrabold leading-tight tracking-tight text-slate-900 tabular-nums dark:text-white sm:mt-4 sm:text-left sm:text-[26px]">
              {item.value}
            </h3>
          </div>
          <p className="relative mt-3 break-words text-[10px] font-bold uppercase leading-4 tracking-[0.08em] text-slate-500 dark:text-slate-400 sm:text-[13px]">
            {item.title}
          </p>
          <p className="relative mt-1 line-clamp-2 break-words text-[10px] leading-4 text-slate-400 dark:text-slate-500 sm:text-xs">{item.subtitle}</p>
          <div
            className={`absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r sm:h-1 ${item.bg}`}
          />
        </div>
       ))}
      </div>
    </section>
  );
}
