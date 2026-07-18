import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

const data = [
  { day: "Mon", requests: 45, success: 38 },
  { day: "Tue", requests: 50, success: 47 },
  { day: "Wed", requests: 48, success: 45 },
  { day: "Thu", requests: 60, success: 55 },
  { day: "Fri", requests: 55, success: 50 },
  { day: "Sat", requests: 20, success: 18 },
  { day: "Sun", requests: 15, success: 15 },
];

export default function AllocationEfficiency() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Decorative Background */}
      <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-blue-100 blur-3xl opacity-40" />
      <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-cyan-100 blur-3xl opacity-30" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              Fleet Operations
            </span>

            <h2 className="mt-3 text-2xl font-bold text-slate-900">
              Allocation Efficiency
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Vehicle request fulfillment and deployment performance.
            </p>
          </div>

          {/* KPI */}
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Success Rate
            </p>

            <h3 className="text-4xl font-bold text-slate-900">92%</h3>

            <span className="text-sm font-medium text-emerald-600">
              ↑ 6.4% from last week
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center gap-2">
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white">
            Weekly
          </button>

          <button className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
            Monthly
          </button>
        </div>

        {/* Chart */}
        <div className="mt-6">
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id="requestGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>

                <linearGradient
                  id="successGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />

              <XAxis dataKey="day" tickLine={false} axisLine={false} />

              <YAxis tickLine={false} axisLine={false} />

              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                }}
              />

              <Area
                type="monotone"
                dataKey="requests"
                stroke="#2563eb"
                fill="url(#requestGradient)"
                strokeWidth={3}
              />

              <Area
                type="monotone"
                dataKey="success"
                stroke="#06b6d4"
                fill="url(#successGradient)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Footer Metrics */}
        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-100 pt-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Total Requests
            </p>

            <h4 className="mt-1 text-xl font-bold text-slate-900">293</h4>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Successful Allocations
            </p>

            <h4 className="mt-1 text-xl font-bold text-slate-900">268</h4>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Efficiency Rate
            </p>

            <h4 className="mt-1 text-xl font-bold text-emerald-600">91.5%</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
