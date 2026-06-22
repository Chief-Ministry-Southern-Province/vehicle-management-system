import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

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
    <div className="bg-white border rounded-2xl p-6">
      <h2 className="font-semibold mb-4">
        Maintenance Cost Trends
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <Tooltip />
          <Bar dataKey="service" fill="#2563eb" />
          <Bar dataKey="repair" fill="#22d3ee" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}