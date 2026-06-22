export default function VehicleTabs() {
  const tabs = [
    "Overview",
    "Fuel Log",
    "Service Records",
    "Repair Records",
    "Assignment History",
  ];

  return (
    <div className="border-b flex gap-10">

      {tabs.map((tab, index) => (
        <button
          key={tab}
          className={`pb-4 font-medium ${
            index === 0
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          {tab}
        </button>
      ))}

    </div>
  );
}