import {
  FiDroplet,
  FiDollarSign,
  FiTrendingUp,
  FiTruck,
} from "react-icons/fi";

const stats = [
  {
    title: "Total Liters Consumed",
    value: "1,452 L",
    icon: <FiDroplet />,
    color: "text-blue-600",
    change: "+8.4%",
  },
  {
    title: "Total Fuel Spend",
    value: "$1,816",
    icon: <FiDollarSign />,
    color: "text-green-600",
    change: "-4.2%",
  },
  {
    title: "Average Efficiency",
    value: "12.8 km/L",
    icon: <FiTrendingUp />,
    color: "text-purple-600",
    change: "+2.1%",
  },
  {
    title: "Vehicles Refueled",
    value: "28",
    icon: <FiTruck />,
    color: "text-orange-600",
    change: "+5",
  },
];

export default function FuelStats() {
  return (
    <div className="grid lg:grid-cols-4 gap-5">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white border rounded-2xl p-6 shadow-sm"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                {item.title}
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {item.value}
              </h2>

              <p className="text-xs text-gray-400 mt-2">
                {item.change} from last month
              </p>
            </div>

            <div
              className={`w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl ${item.color}`}
            >
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}