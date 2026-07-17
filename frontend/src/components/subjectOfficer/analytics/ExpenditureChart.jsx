import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", fuel: 4200, maintenance: 1200 },
  { month: "Feb", fuel: 3900, maintenance: 1500 },
  { month: "Mar", fuel: 4500, maintenance: 2800 },
  { month: "Apr", fuel: 4100, maintenance: 1300 },
  { month: "May", fuel: 5000, maintenance: 1100 },
  { month: "Jun", fuel: 5300, maintenance: 1700 },
];

export default function ExpenditureChart() {
  const totalFuel = data.reduce((sum, item) => sum + item.fuel, 0);

  const totalMaintenance = data.reduce(
    (sum, item) => sum + item.maintenance,
    0,
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Monthly Expenditure Trends
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Fuel expenses versus maintenance costs over the last 6 months.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="flex gap-3">
          <div className="rounded-2xl bg-blue-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-blue-600">
              Fuel Cost
            </p>

            <h4 className="font-bold text-blue-700">
              ${totalFuel.toLocaleString()}
            </h4>
          </div>

          <div className="rounded-2xl bg-cyan-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-cyan-600">
              Maintenance
            </p>

            <h4 className="font-bold text-cyan-700">
              ${totalMaintenance.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis dataKey="month" tickLine={false} axisLine={false} />

          <YAxis tickLine={false} axisLine={false} />

          <Tooltip
            contentStyle={{
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            }}
          />

          <Legend />

          <Bar
            dataKey="fuel"
            fill="#2563eb"
            radius={[8, 8, 0, 0]}
            name="Fuel Expenses"
          />

          <Bar
            dataKey="maintenance"
            fill="#06b6d4"
            radius={[8, 8, 0, 0]}
            name="Maintenance Cost"
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Footer Metrics */}
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Highest Fuel Month
          </p>

          <h4 className="mt-1 font-semibold text-slate-900">June ($5,300)</h4>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Highest Maintenance Month
          </p>

          <h4 className="mt-1 font-semibold text-slate-900">March ($2,800)</h4>
        </div>
      </div>
    </div>
  );
}
