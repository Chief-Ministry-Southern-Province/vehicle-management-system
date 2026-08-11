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
const EMPTY_VEHICLES = [];

function formatCurrency(value) {
  return `LKR ${Number(value).toLocaleString()}`;
}

function formatAxisValue(value) {
  if (value >= 1000000) return `${value / 1000000}M`;
  if (value >= 1000) return `${value / 1000}K`;
  return value;
}

export default function MonthlyCostAnalysis({
  vehicles = EMPTY_VEHICLES,
  loading = false,
  error = "",
}) {
  const fleet = Array.isArray(vehicles) ? vehicles : EMPTY_VEHICLES;

  const years = useMemo(() => {
    const availableYears = new Set([new Date().getFullYear()]);
    fleet.forEach((vehicle) => {
      [
        [vehicle.fuel_details, "date"],
        [vehicle.service_details, "service_date"],
        [vehicle.repair_details, "repair_date"],
      ].forEach(([records, dateField]) => {
        if (!Array.isArray(records)) return;
        records.forEach((record) => {
          const date = new Date(record[dateField]);
          if (!Number.isNaN(date.getTime())) availableYears.add(date.getFullYear());
        });
      });
    });
    return [...availableYears].sort((a, b) => b - a).map(String);
  }, [fleet]);

  const [year, setYear] = useState(String(new Date().getFullYear()));
  const data = useMemo(() => {
    const monthlyCosts = MONTHS.map((month) => ({
      month,
      fuelCost: 0,
      maintenanceCost: 0,
      repairCost: 0,
    }));

    const addCosts = (records, dateField, costField) => {
      if (!Array.isArray(records)) return;
      records.forEach((record) => {
        const date = new Date(record[dateField]);
        if (Number.isNaN(date.getTime()) || String(date.getFullYear()) !== year) return;
        monthlyCosts[date.getMonth()][costField] += Number(record.cost) || 0;
      });
    };

    fleet.forEach((vehicle) => {
      addCosts(vehicle.fuel_details, "date", "fuelCost");
      addCosts(vehicle.service_details, "service_date", "maintenanceCost");
      addCosts(vehicle.repair_details, "repair_date", "repairCost");
    });
    return monthlyCosts;
  }, [fleet, year]);

  const costLabels = {
    fuelCost: "Fuel Cost",
    maintenanceCost: "Service Cost",
    repairCost: "Repair Cost",
  };

  return (
    <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-5">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:items-center">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 sm:h-11 sm:w-11">
            <FiBarChart2 />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
              Monthly Cost Analysis
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400 sm:text-sm">
              Fuel, service, and repair expenditure by month
            </p>
          </div>
        </div>
        <label className="flex w-full items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 sm:w-auto">
          <FiCalendar className="text-slate-400" /> Year
          <select
            value={year}
            onChange={(event) => setYear(event.target.value)}
            className="min-h-11 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:min-h-0 sm:flex-none"
          >
            {years.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <div
        className="mt-4 h-[280px] min-w-0 w-full sm:mt-5 sm:h-[340px] lg:h-[380px]"
        role="img"
        aria-label={`Monthly fuel, service, and repair costs for ${year}`}
      >
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Loading monthly costs...
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center text-sm font-medium text-red-600">
            {error}
          </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 12, right: 4, left: 0, bottom: 8 }}
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
              minTickGap={14}
            />
            <YAxis
              tickFormatter={formatAxisValue}
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <Tooltip
              formatter={(value, name) => [
                formatCurrency(value),
                costLabels[name] || name,
              ]}
              labelFormatter={(label) => `${label} ${year}`}
              contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }}
            />
            <Legend
              formatter={(value) => costLabels[value] || value}
              wrapperStyle={{ fontSize: 12, lineHeight: "20px" }}
            />
            <Line
              type="monotone"
              dataKey="fuelCost"
              stroke="#0ea5e9"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="maintenanceCost"
              stroke="#d946ef"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="repairCost"
              stroke="#ef4444"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
