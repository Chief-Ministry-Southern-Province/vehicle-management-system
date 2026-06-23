import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
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
    <div className="bg-white border rounded-2xl p-6">

      <div className="flex justify-between mb-4">

        <div>
          <h2 className="font-bold text-xl">
            Allocation Efficiency
          </h2>

          <p className="text-sm text-gray-500">
            Requests vs actual deployment
          </p>
        </div>

        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs rounded bg-gray-100">
            Weekly
          </button>

          <button className="px-3 py-1 text-xs rounded">
            Monthly
          </button>
        </div>

      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="requests"
            stroke="#2563eb"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="success"
            stroke="#06b6d4"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}