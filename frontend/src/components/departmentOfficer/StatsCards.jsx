import {
  FiDatabase,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";

const createStats = (stats) => [
  {
    title: "TOTAL RECORDS",
    value: stats.total_records,
    icon: <FiDatabase size={18} />,
    accent: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "APPROVED",
    value: stats.approved,
    icon: <FiCheckCircle size={18} />,
    accent: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    title: "REJECTED",
    value: stats.rejected,
    icon: <FiXCircle size={18} />,
    accent: "from-red-500 to-rose-600",
    bg: "bg-red-50",
    iconColor: "text-red-600",
  },
  {
    title: "PENDING",
    value: stats.pending,
    icon: <FiClock size={18} />,
    accent: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

export default function StatsCards({ stats = {} }) {
  const items = createStats({ total_records: 0, approved: 0, rejected: 0, pending: 0, ...stats });
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

      {items.map((item) => (
        <div
          key={item.title}
          className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >

          {/* Top Gradient */}
          <div
            className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${item.accent}`}
          />

          {/* Decorative Glow */}
          <div
            className={`absolute -right-8 -top-8 h-24 w-24 rounded-full ${item.bg} opacity-70`}
          />

          <div className="relative">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  {item.title}
                </p>

                <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                  {item.value}
                </h2>

              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg} ${item.iconColor}`}
              >
                {item.icon}
              </div>

            </div>

          </div>

        </div>
      ))}

    </div>
  );
}
