import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTruck,
  FiActivity,
  FiUsers,
  FiMapPin,
  FiWatch,
} from "react-icons/fi";

const stats = [
  {
    title: "Pending",
    value: "24",
    icon: <FiClock />,
    badge: "+12%",
    color: "text-blue-600",
  },
  {
    title: "Approved",
    value: "142",
    icon: <FiCheckCircle />,
    badge: "+5%",
    color: "text-green-600",
  },
  {
    title: "Rejected",
    value: "18",
    icon: <FiXCircle />,
    badge: "-2%",
    color: "text-red-500",
  },
  {
    title: "Vehicles",
    value: "18",
    icon: <FiTruck />,
    badge: "95%",
    color: "text-blue-600",
  },
  {
    title: "Allocated",
    value: "32",
    icon: <FiActivity />,
    badge: "+8",
    color: "text-blue-600",
  },
  {
    title: "Drivers",
    value: "09",
    icon: <FiUsers />,
    badge: "Ready",
    color: "text-blue-600",
  },
  {
    title: "Active",
    value: "15",
    icon: <FiMapPin />,
    badge: "Live",
    color: "text-blue-600",
  },
  {
    title: "Avg Time",
    value: "2.4h",
    icon: <FiWatch />,
    badge: "-15m",
    color: "text-blue-600",
  },
];

export default function ExecutiveStats() {
  return (
    <div className="grid lg:grid-cols-8 md:grid-cols-4 gap-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white rounded-2xl border p-4"
        >
          <div className="flex justify-between">
            <span className={item.color}>{item.icon}</span>

            <span className="text-[10px] px-2 py-1 rounded-full bg-green-50 text-green-600">
              {item.badge}
            </span>
          </div>

          <p className="text-gray-500 text-sm mt-4">
            {item.title}
          </p>

          <h2 className="text-3xl font-bold mt-1">
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
}