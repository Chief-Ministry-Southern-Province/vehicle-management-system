import {
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
} from "react-icons/fi";

const stats = [
  {
    title: "TOTAL FLEET",
    value: "42",
    icon: <FiTruck />,
  },
  {
    title: "CURRENTLY AVAILABLE",
    value: "28",
    icon: <FiCheckCircle />,
  },
  {
    title: "UNDER MAINTENANCE",
    value: "05",
    icon: <FiClock />,
  },
  {
    title: "URGENT REPAIRS",
    value: "02",
    icon: <FiAlertTriangle />,
    danger: true,
  },
];

export default function VehicleStats() {
  return (
    <div className="grid lg:grid-cols-4 gap-5">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white border rounded-2xl p-5 shadow-sm"
        >
          <div className="flex justify-between items-center">

            <div>
              <p className="text-xs text-gray-500 font-medium">
                {item.title}
              </p>

              <h2
                className={`text-4xl font-bold mt-2 ${
                  item.danger
                    ? "text-red-500"
                    : "text-gray-900"
                }`}
              >
                {item.value}
              </h2>
            </div>

            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
              {item.icon}
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}