import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", requests: 120, approvals: 95 },
  { month: "Feb", requests: 145, approvals: 120 },
  { month: "Mar", requests: 175, approvals: 160 },
  { month: "Apr", requests: 135, approvals: 118 },
  { month: "May", requests: 220, approvals: 205 },
  { month: "Jun", requests: 250, approvals: 230 },
];

export default function RequestApprovalTrend() {
  return (
    <div className="bg-white rounded-2xl border p-6 h-[420px]">

      <div className="flex justify-between mb-5">
        <div>
          <h3 className="text-2xl font-bold">
            Request & Approval Trends
          </h3>

          <p className="text-slate-500">
            Consolidated volume comparison
          </p>
        </div>

        <button className="border px-4 py-2 rounded-xl">
          Last 6 Months
        </button>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="requests"
            stroke="#2563eb"
            fill="#bfdbfe"
          />

          <Area
            type="monotone"
            dataKey="approvals"
            stroke="#16a34a"
            fill="#bbf7d0"
          />
        </AreaChart>
      </ResponsiveContainer>

    </div>
  );
}