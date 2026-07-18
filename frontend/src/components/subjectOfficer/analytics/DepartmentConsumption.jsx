import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Administration", value: 35 },
  { name: "Logistics", value: 25 },
  { name: "Security", value: 20 },
  { name: "Executive", value: 15 },
  { name: "IT Services", value: 5 },
];

const COLORS = ["#2563eb", "#06b6d4", "#60a5fa", "#1d4ed8", "#64748b"];

export default function DepartmentConsumption() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Department Consumption
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Vehicle utilization distribution by department.
        </p>
      </div>

      {/* Chart */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={75}
              outerRadius={110}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-bold text-slate-900">100%</span>

          <span className="text-xs uppercase tracking-wider text-slate-500">
            Fleet Usage
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-3">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: COLORS[index],
                }}
              />

              <span className="text-sm font-medium text-slate-700">
                {item.name}
              </span>
            </div>

            <span className="text-sm font-semibold text-slate-900">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
