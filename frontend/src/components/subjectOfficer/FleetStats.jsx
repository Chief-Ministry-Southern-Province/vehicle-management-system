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
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className={`h-28 animate-pulse rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:h-36 sm:rounded-2xl ${index === 6 ? "col-span-2 sm:col-span-1" : ""}`}
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
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {stats.map((item, index) => (
        <div
          key={item.title}
          className={`relative min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition dark:border-slate-800 dark:bg-slate-900 sm:rounded-2xl sm:p-5 sm:hover:-translate-y-1 sm:hover:shadow-lg ${index === stats.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}
        >
          <div className="flex min-w-0 items-start justify-between gap-2 sm:block">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-r text-sm text-white shadow-md sm:h-11 sm:w-11 sm:rounded-xl sm:text-base ${item.bg}`}
            >
              {item.icon}
            </div>
            <h2 className="min-w-0 break-words text-right text-lg font-bold leading-tight text-slate-900 dark:text-white sm:mt-1 sm:text-left sm:text-2xl">
              {item.value}
            </h2>
          </div>
          <p className="mt-2 break-words text-[10px] font-bold uppercase leading-4 tracking-wide text-slate-500 dark:text-slate-400 sm:mt-4 sm:text-xs sm:font-semibold">
            {item.title}
          </p>
          <p className="mt-0.5 line-clamp-2 break-words text-[10px] leading-4 text-slate-400 dark:text-slate-500 sm:mt-1 sm:text-xs">{item.subtitle}</p>
          <div
            className={`absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r sm:h-1 ${item.bg}`}
          />
        </div>
      ))}
    </div>
  );
}
