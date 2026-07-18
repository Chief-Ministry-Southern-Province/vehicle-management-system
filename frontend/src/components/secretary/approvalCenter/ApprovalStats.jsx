import { FiClock, FiTruck, FiDollarSign, FiCheckCircle } from "react-icons/fi";

const stats = [
  {
    title: "Awaiting Sign-off",
    value: "14",
    badge: "8 urgent",
    icon: <FiClock />,
    color: "text-blue-600",
  },
  {
    title: "Fleet Utilization",
    value: "84.2%",
    badge: "+2.4%",
    icon: <FiTruck />,
    color: "text-blue-600",
  },
  {
    title: "Monthly Budget Used",
    value: "$42,390",
    badge: "72% cap",
    icon: <FiDollarSign />,
    color: "text-green-600",
  },
  {
    title: "Requests Resolved",
    value: "128",
    badge: "Today",
    icon: <FiCheckCircle />,
    color: "text-blue-600",
  },
];

export default function ApprovalStats() {
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-5">
      {stats.map((item) => (
        <div key={item.title} className="bg-white border rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <div className={`p-3 rounded-xl bg-slate-50 ${item.color}`}>
              {item.icon}
            </div>

            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              {item.badge}
            </span>
          </div>

          <p className="text-sm text-slate-500">{item.title}</p>

          <h2 className="text-3xl font-bold mt-2">{item.value}</h2>
        </div>
      ))}
    </div>
  );
}
