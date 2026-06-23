import {
  FiClipboard,
  FiTruck,
  FiUsers,
  FiArrowUpRight,
} from "react-icons/fi";

const stats = [
  {
    title: "Awaiting Approval",
    value: "24",
    note: "12 urgent requests",
    icon: <FiClipboard size={18} />,
    color: "blue",
    accent: "bg-blue-500",
    soft: "bg-blue-50",
  },
  {
    title: "Available Fleet",
    value: "18",
    note: "Ready for allocation",
    icon: <FiTruck size={18} />,
    color: "emerald",
    accent: "bg-emerald-500",
    soft: "bg-emerald-50",
  },
  {
    title: "Drivers on Standby",
    value: "09",
    note: "Verified for duty",
    icon: <FiUsers size={18} />,
    color: "violet",
    accent: "bg-violet-500",
    soft: "bg-violet-50",
  },
];

export default function ApprovalStats() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">

      {stats.map((item) => (
        <div
          key={item.title}
          className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >

          {/* Decorative Glow */}
          <div
            className={`absolute -right-8 -top-8 h-24 w-24 rounded-full ${item.soft} opacity-80`}
          />

          {/* Top Accent */}
          <div
            className={`absolute top-0 left-0 h-1 w-full ${item.accent}`}
          />

          <div className="relative">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs uppercase tracking-wider font-medium text-slate-500">
                  {item.title}
                </p>

                <h2 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                  {item.value}
                </h2>

              </div>

              <div
                className={`h-11 w-11 rounded-2xl ${item.soft} flex items-center justify-center text-slate-700`}
              >
                {item.icon}
              </div>

            </div>

            <div className="mt-5 flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-700">
                  {item.note}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Updated 5 mins ago
                </p>

              </div>

              <div className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5">

                <FiArrowUpRight
                  size={12}
                  className="text-emerald-600"
                />

                <span className="text-xs font-semibold text-emerald-600">
                  Active
                </span>

              </div>

            </div>

          </div>

        </div>
      ))}

    </div>
  );
}