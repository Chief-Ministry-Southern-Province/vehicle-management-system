import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", km: 1200 },
  { month: "Feb", km: 1500 },
  { month: "Mar", km: 1100 },
  { month: "Apr", km: 1800 },
  { month: "May", km: 1400 },
];

export default function UtilizationChart() {
  return (
    <div className="bg-white border rounded-2xl p-6">

      <h3 className="text-xl font-bold">
        Monthly Utilization
      </h3>

      <p className="text-gray-500 mb-6">
        Distance covered during last 5 months
      </p>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="km"
            stroke="#2563eb"
            strokeWidth={4}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}