import {
  FiAlertTriangle,
  FiTool,
  FiDollarSign,
} from "react-icons/fi";

export default function ServiceStats() {
  const stats = [
    {
      title: "Overdue Services",
      value: "08",
      icon: <FiAlertTriangle />,
      color: "text-red-500",
      border: "border-red-500",
    },
    {
      title: "Active Maintenance",
      value: "14",
      icon: <FiTool />,
      color: "text-blue-500",
      border: "border-blue-500",
    },
    {
      title: "Monthly Savings",
      value: "$4,850",
      icon: <FiDollarSign />,
      color: "text-green-500",
      border: "border-green-500",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-5">
      {stats.map((item) => (
        <div
          key={item.title}
          className={`bg-white border-l-4 ${item.border} rounded-xl p-6`}
        >
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                {item.title}
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {item.value}
              </h2>
            </div>

            <div className={`${item.color} text-2xl`}>
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}