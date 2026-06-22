import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  FiTrendingUp,
  FiActivity,
} from "react-icons/fi";

const data = [
  { month: "Jan", km: 1200 },
  { month: "Feb", km: 1500 },
  { month: "Mar", km: 1100 },
  { month: "Apr", km: 1800 },
  { month: "May", km: 1400 },
];

export default function UtilizationChart() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

        <div>
          <h3 className="font-semibold text-slate-900">
            Monthly Utilization
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Distance covered over the last 5 months
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5">
          <FiTrendingUp
            size={14}
            className="text-green-600"
          />

          <span className="text-xs font-medium text-green-600">
            +12.4%
          </span>
        </div>

      </div>

      {/* KPI */}
      <div className="px-5 pt-4">

        <div className="inline-flex items-center gap-3 rounded-2xl bg-blue-50 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FiActivity />
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Average Monthly Distance
            </p>

            <h4 className="font-bold text-slate-900">
              1,400 km
            </h4>
          </div>
        </div>

      </div>

      {/* Chart */}
      <div className="p-5">
        <ResponsiveContainer
          width="100%"
          height={260}
        >
          <LineChart data={data}>

            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#e2e8f0"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow:
                  "0 8px 24px rgba(0,0,0,0.08)",
              }}
            />

            <Line
              type="monotone"
              dataKey="km"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#2563eb",
              }}
              activeDot={{
                r: 7,
              }}
            />

          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}