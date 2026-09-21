import { FiDatabase, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";

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
  const items = createStats({
    total_records: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
    ...stats,
  });
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.title}
          className="group relative min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl sm:p-5"
        >
          {/* Top Gradient */}
          <div
            className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${item.accent}`}
          />

          {/* Decorative Glow */}
          <div
            className={`absolute -right-6 -top-6 h-20 w-20 rounded-full ${item.bg} opacity-70 sm:-right-8 sm:-top-8 sm:h-24 sm:w-24`}
          />

          <div className="relative">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs sm:tracking-widest">
                  {item.title}
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:mt-3 sm:text-4xl">
                  {item.value}
                </h2>
              </div>

              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.iconColor} sm:h-12 sm:w-12 sm:rounded-2xl`}
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
