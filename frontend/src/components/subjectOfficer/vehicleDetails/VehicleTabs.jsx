import {
  FiGrid,
  FiDroplet,
  FiTool,
  FiAlertTriangle,
  FiClock,
} from "react-icons/fi";

export default function VehicleTabs() {
  const tabs = [
    {
      name: "Overview",
      icon: <FiGrid size={15} />,
    },
    {
      name: "Fuel Log",
      icon: <FiDroplet size={15} />,
    },
    {
      name: "Service",
      icon: <FiTool size={15} />,
    },
    {
      name: "Repairs",
      icon: <FiAlertTriangle size={15} />,
    },
    {
      name: "Assignments",
      icon: <FiClock size={15} />,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab, index) => (
          <button
            key={tab.name}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              index === 0
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
}
