import {
  FiCheckSquare,
  FiTruck,
  FiMap,
  FiClock,
} from "react-icons/fi";

export default function QuickActions() {
  const actions = [
    {
      title: "Bulk Approval",
      subtitle: "Approve recurring requests",
      icon: <FiCheckSquare />,
    },
    {
      title: "Asset Inventory",
      subtitle: "Premium fleet vehicles",
      icon: <FiTruck />,
    },
    {
      title: "Utilization Map",
      subtitle: "Vehicle usage heatmap",
      icon: <FiMap />,
    },
    {
      title: "Next Fleet Review",
      subtitle: "Sept 24, 2024",
      icon: <FiClock />,
    },
  ];

  return (
    <div className="grid lg:grid-cols-4 gap-5 mt-6">

      {actions.map((item) => (
        <div
          key={item.title}
          className="bg-white border rounded-2xl p-5 hover:shadow-md transition"
        >
          <div className="text-blue-600 text-xl mb-3">
            {item.icon}
          </div>

          <h3 className="font-semibold">
            {item.title}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {item.subtitle}
          </p>
        </div>
      ))}

    </div>
  );
}