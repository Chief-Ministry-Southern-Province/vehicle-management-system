import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Admin", value: 35 },
  { name: "Logistics", value: 25 },
  { name: "Security", value: 20 },
  { name: "Executive", value: 15 },
  { name: "IT", value: 5 },
];

const COLORS = [
  "#2563eb",
  "#22d3ee",
  "#60a5fa",
  "#1d4ed8",
  "#64748b",
];

export default function DepartmentConsumption() {
  return (
    <div className="bg-white rounded-2xl border p-6">

      <h2 className="font-bold text-xl">
        Department Consumption
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        Distribution of trips by organizational unit.
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={70}
            outerRadius={110}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-2 text-sm">
        {data.map((item) => (
          <div key={item.name}>
            • {item.name} ({item.value}%)
          </div>
        ))}
      </div>
    </div>
  );
}