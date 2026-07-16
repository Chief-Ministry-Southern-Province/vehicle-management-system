import { FiAlertTriangle, FiDroplet, FiTool, FiTruck } from "react-icons/fi";
import { useLanguage } from "../../context/useLanguage";

const money = (value) => `LKR ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function FleetStats({ vehicles = [], loading, error }) {
  const { translate } = useLanguage();
  const serviceRecords = vehicles.flatMap((vehicle) => Array.isArray(vehicle.service_details) ? vehicle.service_details : []);
  const repairCost = serviceRecords.reduce((total, service) => /repair/i.test(service.service_type || "") ? total + (Number(service.cost) || 0) : total, 0);
  const serviceCost = serviceRecords.reduce((total, service) => !/repair/i.test(service.service_type || "") ? total + (Number(service.cost) || 0) : total, 0);

  const stats = [
    { title: translate("Total Vehicles"), value: vehicles.length, subtitle: translate("Registered fleet"), icon: <FiTruck />, bg: "from-blue-500 to-blue-700" },
    { title: translate("Available Now"), value: vehicles.filter((vehicle) => vehicle.status === "available").length, subtitle: translate("Ready for allocation"), icon: <FiTruck />, bg: "from-emerald-500 to-teal-600" },
    { title: translate("Unavailable Now"), value: vehicles.filter((vehicle) => vehicle.status === "unavailable").length, subtitle: translate("Currently unavailable"), icon: <FiTruck />, bg: "from-slate-500 to-slate-700" },
    { title: translate("Maintenance"), value: vehicles.filter((vehicle) => vehicle.status === "maintenance").length, subtitle: translate("In maintenance"), icon: <FiTool />, bg: "from-amber-500 to-orange-600" },
    { title: translate("Fuel Cost"), value: money(0), subtitle: translate("No stored fuel transactions"), icon: <FiDroplet />, bg: "from-cyan-500 to-sky-600" },
    { title: translate("Service Costs"), value: money(serviceCost), subtitle: translate("Recorded service spending"), icon: <FiTool />, bg: "from-indigo-500 to-violet-600" },
    { title: translate("Repair Expense"), value: money(repairCost), subtitle: translate("Recorded repair spending"), icon: <FiAlertTriangle />, bg: "from-red-500 to-rose-600" },
  ];

  if (loading) return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 7 }).map((_, index) => <div key={index} className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white" />)}</div>;
  if (error) return <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stats.map((item) => <div key={item.title} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-r text-white shadow-md ${item.bg}`}>{item.icon}</div><p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{item.title}</p><h2 className="mt-1 text-2xl font-bold text-slate-900">{item.value}</h2><p className="mt-1 text-xs text-slate-400">{item.subtitle}</p><div className={`absolute inset-x-0 bottom-0 h-1 bg-linear-to-r ${item.bg}`} /></div>)}
    </div>
  );
}
