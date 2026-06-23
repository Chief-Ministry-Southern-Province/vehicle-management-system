import {
  FiAlertTriangle,
  FiTool,
  FiDollarSign,
} from "react-icons/fi";

const stats = [
  {
    title: "Overdue",
    value: "08",
    icon: <FiAlertTriangle size={16} />,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    title: "Maintenance",
    value: "14",
    icon: <FiTool size={16} />,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Savings",
    value: "$4.8K",
    icon: <FiDollarSign size={16} />,
    color: "text-green-600",
    bg: "bg-green-50",
  },
];

export default function ServiceStats() {
  return (
    <div className="grid gap-3 md:grid-cols-3">

      {stats.map((item) => (
        <div
          key={item.title}
          className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                {item.title}
              </p>

              <h3 className="mt-1 text-2xl font-bold text-slate-900">
                {item.value}
              </h3>

            </div>

            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg} ${item.color}`}
            >
              {item.icon}
            </div>

          </div>

        </div>
      ))}

    </div>
  );
}