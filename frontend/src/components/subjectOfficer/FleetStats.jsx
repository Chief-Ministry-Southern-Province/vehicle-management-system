import {
  FiCheckCircle,
  FiTruck,
  FiDroplet,
  FiTool,
  FiAlertTriangle,
} from "react-icons/fi";

const stats = [
  {
    title: "Fleet Utilization",
    value: "82%",
    subtitle: "Avg. daily active deployment",
    icon: <FiCheckCircle />,
    color: "text-blue-600",
  },
  {
    title: "Available Now",
    value: "14",
    subtitle: "Ready for immediate allocation",
    icon: <FiTruck />,
    color: "text-blue-600",
  },
  {
    title: "Monthly Fuel",
    value: "$12.4k",
    subtitle: "Fuel costs since last month",
    icon: <FiDroplet />,
    color: "text-blue-600",
  },
  {
    title: "Service Costs",
    value: "$8.2k",
    subtitle: "Scheduled maintenance expenses",
    icon: <FiTool />,
    color: "text-blue-600",
  },
  {
    title: "Repair Expense",
    value: "$4.1k",
    subtitle: "Unscheduled damage repairs",
    icon: <FiAlertTriangle />,
    color: "text-red-600",
  },
];

export default function FleetStats() {
  return (
    <div className="grid lg:grid-cols-5 gap-5">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white border rounded-2xl p-5 shadow-sm"
        >
          <div className="flex justify-between">

            <div className={`w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center ${item.color}`}>
              {item.icon}
            </div>

            <span className="text-xs text-gray-500">
              ↗ 4.2%
            </span>

          </div>

          <p className="text-gray-500 text-sm mt-4">
            {item.title}
          </p>

          <h2 className="text-3xl font-bold mt-1">
            {item.value}
          </h2>

          <p className="text-xs text-gray-400 mt-2">
            {item.subtitle}
          </p>

        </div>
      ))}
    </div>
  );
}