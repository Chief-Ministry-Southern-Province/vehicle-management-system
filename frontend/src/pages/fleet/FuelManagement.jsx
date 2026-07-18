import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FiBarChart2, FiDroplet } from "react-icons/fi";
import DashboardLayout from "../../layouts/DashboardLayout";
import FuelFilters from "../../components/subjectOfficer/fuel/FuelFilters";
import FuelTable from "../../components/subjectOfficer/fuel/FuelTable";
import { getVehicles } from "../../api/authApi";

const EMPTY_FILTERS = { search: "", date: "", fuelType: "" };

export default function FuelManagement() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadFuelRecords = async () => {
      try {
        const response = await getVehicles();
        const vehicles = response?.data?.vehicles;
        if (!Array.isArray(vehicles)) {
          throw new Error("Unable to read vehicle records.");
        }

        const records = vehicles.flatMap((vehicle) =>
          (Array.isArray(vehicle.fuel_details) ? vehicle.fuel_details : []).map(
            (fuel, index) => ({
              ...fuel,
              id: `${vehicle.id}-${fuel.date || "fuel"}-${index}`,
              vehicle: vehicle.registration_number,
              model: [vehicle.make, vehicle.model].filter(Boolean).join(" "),
            }),
          ),
        );

        records.sort(
          (first, second) =>
            new Date(second.date || 0).getTime() -
            new Date(first.date || 0).getTime(),
        );
        if (active) setLogs(records);
      } catch (loadError) {
        if (active) {
          setError(
            loadError?.message || "Unable to load fuel records from the database.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadFuelRecords();
    return () => {
      active = false;
    };
  }, []);

  const filteredLogs = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return logs.filter((log) => {
      const matchesSearch =
        !search ||
        `${log.vehicle || ""} ${log.model || ""}`
          .toLowerCase()
          .includes(search);
      const matchesDate = !filters.date || log.date === filters.date;
      const matchesFuelType =
        !filters.fuelType || log.fuel_type === filters.fuelType;
      return matchesSearch && matchesDate && matchesFuelType;
    });
  }, [filters, logs]);

  const monthlyData = useMemo(() => {
    const totals = new Map();
    filteredLogs.forEach((log) => {
      const date = new Date(log.date);
      if (Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const current = totals.get(key) || { cost: 0, liters: 0 };
      current.cost += Number(log.cost) || 0;
      current.liters += Number(log.capacity) || 0;
      totals.set(key, current);
    });

    return [...totals.entries()]
      .sort(([first], [second]) => first.localeCompare(second))
      .map(([key, values]) => {
        const [year, month] = key.split("-");
        return {
          ...values,
          month: new Date(Number(year), Number(month) - 1).toLocaleDateString(
            undefined,
            { month: "short", year: "numeric" },
          ),
        };
      });
  }, [filteredLogs]);

  const updateFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-100 opacity-60 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-cyan-100 opacity-40 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              <FiDroplet size={14} />
              Fuel Operations Center
            </div>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              Fuel Management
            </h1>
            <p className="mt-2 text-slate-500">
              Monitor monthly fuel costs, consumption, and vehicle fuel records.
            </p>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FiBarChart2 size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Monthly Fuel Analysis</h2>
              <p className="text-sm text-slate-500">
                Monthly fuel cost and liters consumed
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex h-80 items-center justify-center text-sm text-slate-500">
              Loading chart…
            </div>
          ) : error ? (
            <div className="flex h-80 items-center justify-center text-sm font-medium text-red-600">
              {error}
            </div>
          ) : monthlyData.length === 0 ? (
            <div className="flex h-80 items-center justify-center text-sm text-slate-500">
              No fuel data is available for the selected filters.
            </div>
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData} margin={{ top: 10, right: 15, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis
                    yAxisId="cost"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    tickFormatter={(value) => `LKR ${Number(value).toLocaleString()}`}
                    width={90}
                  />
                  <YAxis
                    yAxisId="liters"
                    orientation="right"
                    tick={{ fill: "#0891b2", fontSize: 12 }}
                    tickFormatter={(value) => `${value} L`}
                    width={60}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "Cost (LKR)"
                        ? `LKR ${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                        : `${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })} L`,
                      name,
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="cost" dataKey="cost" name="Cost (LKR)" fill="#2563eb" radius={[7, 7, 0, 0]} />
                  <Line yAxisId="liters" dataKey="liters" name="Liters" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <FuelFilters
            filters={filters}
            onChange={updateFilter}
            onClear={() => setFilters(EMPTY_FILTERS)}
          />
          <FuelTable logs={filteredLogs} loading={loading} error={error} />
        </section>
      </div>
    </DashboardLayout>
  );
}
