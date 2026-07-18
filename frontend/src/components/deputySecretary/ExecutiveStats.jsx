import { FiFileText, FiTruck, FiUsers, FiArrowUpRight } from "react-icons/fi";

const stats = [
  {
    title: "Pending Requests",
    value: "12",
    icon: <FiFileText />,
    trend: "+14%",
  },
  {
    title: "Available Vehicles",
    value: "08",
    icon: <FiTruck />,
    trend: "+2",
  },
  {
    title: "Driver Availability",
    value: "100%",
    icon: <FiUsers />,
    trend: "Stable",
  },
];

export default function ExecutiveStats() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {stats.map((item) => (
        <div
          key={item.title}
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          {/* Decorative Circle */}
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-50 group-hover:bg-blue-100 transition" />

          <div className="relative">
            {/* Top */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {item.value}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-blue-600">
                {item.icon}
              </div>
            </div>

            {/* Bottom */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">Updated now</span>

              <div className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1">
                <FiArrowUpRight size={12} className="text-blue-600" />

                <span className="text-xs font-semibold text-blue-600">
                  {item.trend}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
