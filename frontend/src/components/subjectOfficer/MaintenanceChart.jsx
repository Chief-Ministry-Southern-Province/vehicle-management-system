import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  FiTool,
  FiTrendingUp,
} from "react-icons/fi";

const data = [
  { month: "Jan", service: 5, repair: 3 },
  { month: "Feb", service: 6, repair: 4 },
  { month: "Mar", service: 5, repair: 2 },
  { month: "Apr", service: 7, repair: 5 },
  { month: "May", service: 7, repair: 4 },
  { month: "Jun", service: 8, repair: 6 },
];

export default function MaintenanceChart() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <FiTool size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Maintenance Trends
            </h2>

            <p className="text-sm text-slate-500">
              Service & repair activities by month
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1.5">
          <FiTrendingUp className="text-green-600" size={14} />
          <span className="text-xs font-medium text-green-600">
            +18% Growth
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 px-6 pt-5">
        <div className="rounded-2xl bg-blue-50 p-4">
          <p className="text-sm text-slate-500">
            Total Services
          </p>

          <h3 className="mt-1 text-2xl font-bold text-blue-600">
            38
          </h3>
        </div>

        <div className="rounded-2xl bg-cyan-50 p-4">
          <p className="text-sm text-slate-500">
            Total Repairs
          </p>

          <h3 className="mt-1 text-2xl font-bold text-cyan-600">
            24
          </h3>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            barGap={8}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "14px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              }}
            />

            <Legend />

            <Bar
              dataKey="service"
              name="Services"
              fill="#2563eb"
              radius={[8, 8, 0, 0]}
            />

            <Bar
              dataKey="repair"
              name="Repairs"
              fill="#06b6d4"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 bg-slate-50 px-6 py-3">
        <p className="text-xs text-slate-500">
          Last updated: Today • Fleet Maintenance Analytics
        </p>
      </div>
    </div>
  );
}