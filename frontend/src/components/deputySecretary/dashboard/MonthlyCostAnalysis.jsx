import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FiBarChart2, FiCalendar } from "react-icons/fi";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const COSTS_BY_YEAR = {
  2024: {
    fuel: [
      185000, 192000, 178000, 205000, 214000, 198000, 226000, 219000, 208000,
      231000, 224000, 242000,
    ],
    maintenance: [
      92000, 78000, 118000, 86000, 132000, 97000, 145000, 108000, 126000,
      101000, 154000, 116000,
    ],
  },
  2025: {
    fuel: [
      210000, 218000, 202000, 229000, 238000, 221000, 247000, 241000, 233000,
      254000, 248000, 263000,
    ],
    maintenance: [
      105000, 91000, 127000, 98000, 144000, 112000, 158000, 121000, 139000,
      115000, 166000, 129000,
    ],
  },
  2026: {
    fuel: [
      236000, 244000, 231000, 257000, 265000, 252000, 274000, 268000, 281000,
      276000, 289000, 297000,
    ],
    maintenance: [
      116000, 103000, 139000, 112000, 153000, 124000, 171000, 133000, 148000,
      129000, 179000, 142000,
    ],
  },
};

function formatCurrency(value) {
  return `LKR ${Number(value).toLocaleString()}`;
}

function formatAxisValue(value) {
  if (value >= 1000000) return `${value / 1000000}M`;
  if (value >= 1000) return `${value / 1000}K`;
  return value;
}

export default function MonthlyCostAnalysis() {
  const years = Object.keys(COSTS_BY_YEAR).sort((a, b) => b - a);
  const [year, setYear] = useState(years[0]);
  const data = useMemo(
    () =>
      MONTHS.map((month, index) => ({
        month,
        fuelCost: COSTS_BY_YEAR[year].fuel[index],
        maintenanceCost: COSTS_BY_YEAR[year].maintenance[index],
      })),
    [year],
  );

  return (
    <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FiBarChart2 />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Monthly Cost Analysis
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Fuel and maintenance expenditure by month
            </p>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
          <FiCalendar className="text-slate-400" /> Year
          <select
            value={year}
            onChange={(event) => setYear(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
          >
            {years.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <div
        className="mt-5 h-[380px] w-full"
        role="img"
        aria-label={`Monthly fuel and maintenance costs for ${year}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 12, right: 20, left: 16, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={{ stroke: "#cbd5e1" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatAxisValue}
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              label={{
                value: "Cost (LKR)",
                angle: -90,
                position: "insideLeft",
                fill: "#64748b",
                offset: -4,
              }}
            />
            <Tooltip
              formatter={(value, name) => [
                formatCurrency(value),
                name === "fuelCost" ? "Fuel Cost" : "Maintenance Cost",
              ]}
              labelFormatter={(label) => `${label} ${year}`}
              contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }}
            />
            <Legend
              formatter={(value) =>
                value === "fuelCost" ? "Fuel Cost" : "Maintenance Cost"
              }
            />
            <Line
              type="monotone"
              dataKey="fuelCost"
              stroke="#0ea5e9"
              strokeWidth={3}
              dot={{ r: 3, fill: "#0ea5e9" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="maintenanceCost"
              stroke="#d946ef"
              strokeWidth={3}
              dot={{ r: 3, fill: "#d946ef" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
