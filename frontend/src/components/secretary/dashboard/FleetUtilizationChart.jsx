import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

const data = [
  { dept: "Health", active: 24, maintenance: 3 },
  { dept: "Education", active: 18, maintenance: 4 },
  { dept: "Works", active: 30, maintenance: 6 },
  { dept: "Finance", active: 12, maintenance: 1 },
  { dept: "Interior", active: 22, maintenance: 5 },
];

export default function FleetUtilizationChart() {
  return (
    <div className="bg-white rounded-2xl border p-6 h-[420px]">

      <h3 className="text-2xl font-bold mb-1">
        Fleet Utilization
      </h3>

      <p className="text-slate-500 mb-6">
        Active vs Maintenance
      </p>

      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data}>
          <XAxis dataKey="dept" />
          <Tooltip />
          <Bar dataKey="active" fill="#3b82f6" />
          <Bar dataKey="maintenance" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}