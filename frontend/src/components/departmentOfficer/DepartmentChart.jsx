import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { name: "Finance", value: 12 },
  { name: "Operations", value: 18 },
  { name: "Legal", value: 8 },
  { name: "HR", value: 14 },
];

export default function DepartmentChart() {
  return (
    <div className="bg-white border rounded-xl p-5">

      <h2 className="font-semibold text-lg">
        Sub-team Volume
      </h2>

      <p className="text-gray-500 text-sm mb-4">
        Request distribution by department units
      </p>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>

      <div className="border-t mt-4 pt-4 text-sm">

        <div className="flex justify-between">
          <span>Total Department Staff</span>
          <span className="font-semibold">
            142 Members
          </span>
        </div>

        <div className="flex justify-between mt-2">
          <span>Approval Efficiency</span>
          <span className="font-semibold">
            92%
          </span>
        </div>

      </div>

    </div>
  );
}