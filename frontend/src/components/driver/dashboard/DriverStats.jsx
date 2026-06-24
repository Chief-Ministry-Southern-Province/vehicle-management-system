import {
  FiNavigation,
  FiClock,
  FiCheckCircle,
  FiDroplet,
  FiMapPin,
  FiAlertTriangle,
} from "react-icons/fi";

const stats = [
  {
    title: "Today's Trips",
    value: "04",
    icon: <FiNavigation />,
    badge: "+1",
    color: "text-blue-600",
  },
  {
    title: "Upcoming",
    value: "03",
    icon: <FiClock />,
    badge: "Next 2PM",
    color: "text-blue-600",
  },
  {
    title: "Completed",
    value: "01",
    icon: <FiCheckCircle />,
    badge: "85%",
    color: "text-green-600",
  },
  {
    title: "Fuel Usage",
    value: "12.4L",
    icon: <FiDroplet />,
    badge: "-2%",
    color: "text-blue-600",
  },
  {
    title: "Distance",
    value: "184km",
    icon: <FiMapPin />,
    badge: "+18km",
    color: "text-green-600",
  },
  {
    title: "Alerts",
    value: "01",
    icon: <FiAlertTriangle />,
    badge: "Service",
    color: "text-red-500",
  },
];

export default function DriverStats() {
  return (
    <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white border rounded-2xl p-5"
        >
          <div className="flex justify-between mb-4">
            <div className={item.color}>{item.icon}</div>

            <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
              {item.badge}
            </span>
          </div>

          <p className="text-sm text-slate-500">{item.title}</p>

          <h3 className="text-3xl font-bold mt-2">
            {item.value}
          </h3>
        </div>
      ))}
    </div>
  );
}