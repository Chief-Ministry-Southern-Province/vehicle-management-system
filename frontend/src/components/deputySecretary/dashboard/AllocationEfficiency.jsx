import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { day: "Mon", req: 40, ok: 35 },
  { day: "Tue", req: 55, ok: 48 },
  { day: "Wed", req: 45, ok: 42 },
  { day: "Thu", req: 70, ok: 62 },
  { day: "Fri", req: 65, ok: 58 },
  { day: "Sat", req: 25, ok: 20 },
  { day: "Sun", req: 15, ok: 13 },
];

export default function AllocationEfficiency() {
  return (
    <div className="bg-white border rounded-2xl p-5">

      <h2 className="text-3xl font-bold mb-6">
        Allocation Efficiency
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />

          <Line
            dataKey="req"
            stroke="#2563eb"
            strokeWidth={3}
          />

          <Line
            dataKey="ok"
            stroke="#60a5fa"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}