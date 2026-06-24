import {
  FiFileText,
  FiCheckCircle,
  FiXCircle,
  FiTruck,
  FiDroplet,
  FiTool,
} from "react-icons/fi";

const stats = [
  {
    title: "Total Requests",
    value: "1,284",
    change: "+12.5%",
    icon: <FiFileText />,
    color: "text-blue-600",
  },
  {
    title: "Pending Final Sign-off",
    value: "24",
    change: "-4",
    icon: <FiCheckCircle />,
    color: "text-yellow-600",
  },
  {
    title: "Fleet Utilization",
    value: "88.2%",
    change: "+2.1%",
    icon: <FiTruck />,
    color: "text-blue-600",
  },
  {
    title: "Total Fuel Costs",
    value: "$42,850",
    change: "+5.2%",
    icon: <FiDroplet />,
    color: "text-green-600",
  },
  {
    title: "Approved Trips",
    value: "1,120",
    change: "87%",
    icon: <FiCheckCircle />,
    color: "text-green-600",
  },
  {
    title: "Rejected Requests",
    value: "140",
    change: "11%",
    icon: <FiXCircle />,
    color: "text-red-600",
  },
  {
    title: "Maintenance Cost",
    value: "$12,400",
    change: "-8.4%",
    icon: <FiTool />,
    color: "text-orange-600",
  },
  {
    title: "Available Vehicles",
    value: "18",
    change: "Ready",
    icon: <FiTruck />,
    color: "text-emerald-600",
  },
];

export default function SecretaryStats() {
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-5">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white rounded-2xl border border-slate-200 p-5"
        >
          <div className="flex justify-between items-center mb-5">
            <div className={`p-3 rounded-xl bg-slate-50 ${item.color}`}>
              {item.icon}
            </div>

            <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
              {item.change}
            </span>
          </div>

          <p className="text-sm text-slate-500">{item.title}</p>

          <h2 className="text-3xl font-bold mt-2">{item.value}</h2>
        </div>
      ))}
    </div>
  );
}