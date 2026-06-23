import {
  FiActivity,
  FiDroplet,
  FiTool,
  FiTruck,
} from "react-icons/fi";

const stats = [
  {
    title: "Avg. Fleet Utilization",
    value: "72.4%",
    icon: <FiActivity />,
    trend: "+4.2%",
  },
  {
    title: "Total Fuel Expense",
    value: "$12,450",
    icon: <FiDroplet />,
    trend: "-2.1%",
  },
  {
    title: "Maintenance Cost",
    value: "$8,920",
    icon: <FiTool />,
    trend: "+12.5%",
  },
  {
    title: "Active Vehicles",
    value: "42 / 48",
    icon: <FiTruck />,
    trend: "Stable",
  },
];

export default function AnalyticsStats() {
  return (
    <div className="grid lg:grid-cols-4 gap-5">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white rounded-2xl border p-6"
        >
          <div className="flex justify-between">

            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              {item.icon}
            </div>

            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
              {item.trend}
            </span>

          </div>

          <p className="text-gray-500 text-sm mt-5">
            {item.title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
}