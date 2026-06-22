import {
  FiActivity,
  FiMapPin,
  FiTool,
  FiCheckCircle,
} from "react-icons/fi";

export default function VehicleStats() {
  const stats = [
    {
      title: "Status",
      value: "Available",
      icon: <FiCheckCircle size={16} />,
      bg: "bg-green-50",
      color: "text-green-600",
    },
    {
      title: "Odometer",
      value: "45,230 km",
      icon: <FiActivity size={16} />,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      title: "Assigned",
      value: "Public Works",
      icon: <FiMapPin size={16} />,
      bg: "bg-purple-50",
      color: "text-purple-600",
    },
    {
      title: "Service",
      value: "10 Apr 2024",
      icon: <FiTool size={16} />,
      bg: "bg-orange-50",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mt-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className="group bg-white border border-slate-200 rounded-2xl p-3 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">

            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}
            >
              {item.icon}
            </div>

          </div>

          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
            {item.title}
          </p>

          <h4 className="mt-1 font-semibold text-sm text-slate-900 truncate">
            {item.value}
          </h4>

        </div>
      ))}
    </div>
  );
}