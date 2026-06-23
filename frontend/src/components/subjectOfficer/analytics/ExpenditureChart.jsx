import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
  return (
    <div className="bg-white rounded-2xl border p-6">

      <div className="flex justify-between mb-6">

        <div>
          <h2 className="text-xl font-bold">
            Monthly Expenditure Trends
          </h2>

          <p className="text-gray-500 text-sm">
            Fuel vs Maintenance comparison
          </p>
        </div>

      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="fuel" fill="#2563eb" />
          <Bar dataKey="maintenance" fill="#22d3ee" />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}