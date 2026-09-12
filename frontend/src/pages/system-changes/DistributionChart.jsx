import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { chartColors } from "./constants";

export default function DistributionChart({ data, emptyMessage, layout = "vertical" }) {
  if (!data.length) return <div className="flex h-72 items-center justify-center text-sm text-slate-500">{emptyMessage}</div>;
  const vertical = layout === "vertical";
  return (
    <div className="h-72 w-full" role="img" aria-label="Employee distribution chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout={layout} margin={vertical ? { top: 8, right: 24, bottom: 8, left: 22 } : { top: 8, right: 12, bottom: 42, left: 0 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" horizontal={!vertical} vertical={vertical} />
          {vertical ? <><XAxis type="number" allowDecimals={false} tick={{ fill: "#64748b", fontSize: 12 }} /><YAxis type="category" dataKey="name" width={132} tick={{ fill: "#475569", fontSize: 11 }} /></> : <><XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} height={68} tick={{ fill: "#475569", fontSize: 10 }} /><YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 12 }} /></>}
          <Tooltip formatter={(value) => [`${value} ${value === 1 ? "employee" : "employees"}`, "Employees"]} />
          <Bar dataKey="count" radius={vertical ? [0, 6, 6, 0] : [6, 6, 0, 0]} maxBarSize={34}>{data.map((entry, index) => <Cell key={entry.key} fill={chartColors[index % chartColors.length]} />)}</Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
