import {
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
} from "react-icons/fi";

export default function VehicleStats({ vehicles = [] }) {
  const stats = [
    {
      title: "Total",
      value: vehicles.length,
      icon: <FiTruck size={18} />,
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Available",
      value: vehicles.filter((vehicle) => vehicle.status === "Available")
        .length,
      icon: <FiCheckCircle size={18} />,
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      title: "Maintenance",
      value: vehicles.filter((vehicle) => vehicle.status === "Maintenance")
        .length,
      icon: <FiClock size={18} />,
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
    {
      title: "Scheduled Trip",
      value: vehicles.filter((vehicle) => vehicle.status === "Scheduled Trip")
        .length,
      icon: <FiAlertTriangle size={18} />,
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="group bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">
                {item.title}
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                {String(item.value).padStart(2, "0")}
              </h2>
            </div>

            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center ${item.bg} ${item.text}`}
            >
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
