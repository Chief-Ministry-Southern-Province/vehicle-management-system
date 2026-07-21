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
import { FiBarChart2, FiTool } from "react-icons/fi";
import DashboardLayout from "../../layouts/DashboardLayout";
import ServiceFilters from "../../components/subjectOfficer/service/ServiceFilters";
import ServiceScheduleTable from "../../components/subjectOfficer/service/ServiceScheduleTable";
import { getVehicles } from "../../api/authApi";

const EMPTY_FILTERS = { search: "", serviceType: "" };
const START_YEAR = 2025;
const END_YEAR = Math.max(2030, new Date().getFullYear() + 5);
const YEAR_OPTIONS = Array.from(
  { length: END_YEAR - START_YEAR + 1 },
  (_, index) => START_YEAR + index,
);

export default function ServiceRecords() {
  const [records, setRecords] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedYear, setSelectedYear] = useState(
    String(Math.max(START_YEAR, new Date().getFullYear())),
  );
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadServiceRecords = async () => {
      try {
        const response = await getVehicles();
        const vehicles = response?.data?.vehicles;
        if (!Array.isArray(vehicles)) {
          throw new Error("Unable to read vehicle records.");
        }

        const serviceRecords = vehicles.flatMap((vehicle) =>
          (Array.isArray(vehicle.service_details)
            ? vehicle.service_details
            : []
          ).map((service, index) => ({
            ...service,
            id: `${vehicle.id}-${service.service_date || "service"}-${index}`,
            vehicle: vehicle.registration_number,
            model: [vehicle.make, vehicle.model].filter(Boolean).join(" "),
          })),
        );

        serviceRecords.sort(
          (first, second) =>
            new Date(second.service_date || 0).getTime() -
            new Date(first.service_date || 0).getTime(),
        );
        if (active) setRecords(serviceRecords);
      } catch (loadError) {
        if (active) {
          setError(
            loadError?.message ||
              "Unable to load service records from the database.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadServiceRecords();
    return () => {
      active = false;
    };
  }, []);

  const serviceTypes = useMemo(
    () =>
      [...new Set(records.map((record) => record.service_type).filter(Boolean))]
        .sort((first, second) => first.localeCompare(second)),
    [records],
  );

  const filteredRecords = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return records.filter((record) => {
      const matchesSearch =
        !search ||
        `${record.vehicle || ""} ${record.model || ""} ${record.service_type || ""}`
          .toLowerCase()
          .includes(search);
      const matchesType =
        !filters.serviceType || record.service_type === filters.serviceType;
      return matchesSearch && matchesType;
    });
  }, [filters, records]);

  const yearRecords = useMemo(
    () =>
      filteredRecords.filter((record) => {
        const date = new Date(record.service_date);
        return (
          !Number.isNaN(date.getTime()) &&
          String(date.getFullYear()) === selectedYear
        );
      }),
    [filteredRecords, selectedYear],
  );

  const displayedRecords = useMemo(() => {
    if (!selectedMonth) return yearRecords;
    return yearRecords.filter((record) => {
      const date = new Date(record.service_date);
      if (Number.isNaN(date.getTime())) return false;
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}` === selectedMonth;
    });
  }, [selectedMonth, yearRecords]);

  const monthlyData = useMemo(() => {
    const totals = new Map(
      Array.from({ length: 12 }, (_, monthIndex) => [
        `${selectedYear}-${String(monthIndex + 1).padStart(2, "0")}`,
        { cost: 0, services: 0 },
      ]),
    );

    yearRecords.forEach((record) => {
      const date = new Date(record.service_date);
      if (Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const current = totals.get(key) || { cost: 0, services: 0 };
      current.cost += Number(record.cost) || 0;
      current.services += 1;
      totals.set(key, current);
    });

    return [...totals.entries()].map(([key, values]) => {
      const [year, month] = key.split("-");
      return {
        ...values,
        monthKey: key,
        month: new Date(Number(year), Number(month) - 1).toLocaleDateString(
          undefined,
          { month: "short", year: "numeric" },
        ),
      };
    });
  }, [selectedYear, yearRecords]);

  const updateFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const changeMonth = (month) => {
    setSelectedMonth(month);
    if (month) setSelectedYear(month.slice(0, 4));
  };

  const selectChartMonth = (chartData) => {
    const monthKey =
      chartData?.monthKey ||
      chartData?.payload?.monthKey ||
      chartData?.activePayload?.[0]?.payload?.monthKey;
    if (monthKey) {
      setSelectedMonth((current) => (current === monthKey ? "" : monthKey));
    }
  };

  const selectedMonthLabel = monthlyData.find(
    (item) => item.monthKey === selectedMonth,
  )?.month;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-100 opacity-60 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-cyan-100 opacity-40 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              <FiTool size={14} />
              Fleet Maintenance Center
            </div>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              Service &amp; Maintenance Records
            </h1>
            <p className="mt-2 text-slate-500">
              Monitor monthly service costs and vehicle maintenance records.
            </p>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiBarChart2 size={20} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Monthly Service Analysis</h2>
                <p className="text-sm text-slate-500">Monthly service cost and completed services</p>
              </div>
            </div>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-600">
              Select Year
              <select
                value={selectedYear}
                onChange={(event) => {
                  setSelectedYear(event.target.value);
                  setSelectedMonth("");
                }}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                {YEAR_OPTIONS.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </label>
          </div>

          {loading ? (
            <div className="flex h-80 items-center justify-center text-sm text-slate-500">Loading chart...</div>
          ) : error ? (
            <div className="flex h-80 items-center justify-center text-sm font-medium text-red-600">{error}</div>
          ) : yearRecords.length === 0 ? (
            <div className="flex h-80 items-center justify-center text-sm text-slate-500">No service data is available for {selectedYear}.</div>
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData} margin={{ top: 10, right: 15, left: 10, bottom: 5 }} onClick={selectChartMonth} style={{ cursor: "pointer" }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis yAxisId="cost" tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={(value) => `LKR ${Number(value).toLocaleString()}`} width={90} />
                  <YAxis yAxisId="services" orientation="right" allowDecimals={false} tick={{ fill: "#0891b2", fontSize: 12 }} width={45} />
                  <Tooltip formatter={(value, name) => [name === "Cost (LKR)" ? `LKR ${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : Number(value).toLocaleString(), name]} />
                  <Legend />
                  <Bar yAxisId="cost" dataKey="cost" name="Cost (LKR)" fill="#2563eb" radius={[7, 7, 0, 0]} cursor="pointer" />
                  <Line yAxisId="services" dataKey="services" name="Services" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, cursor: "pointer" }} activeDot={{ r: 6, cursor: "pointer" }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <ServiceFilters
            filters={filters}
            serviceTypes={serviceTypes}
            onChange={updateFilter}
            selectedMonth={selectedMonth}
            onMonthChange={changeMonth}
            onClear={() => {
              setFilters(EMPTY_FILTERS);
              setSelectedMonth("");
            }}
          />
          {selectedMonthLabel ? (
            <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-5 py-3 text-sm text-blue-700">
              <span>Showing service records for <strong>{selectedMonthLabel}</strong></span>
              <button type="button" onClick={() => setSelectedMonth("")} className="font-semibold hover:text-blue-900">Show all months</button>
            </div>
          ) : !loading && !error ? (
            <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 text-sm text-slate-600">
              Showing all service records for <strong>{selectedYear}</strong>. Click a chart month to filter the records.
            </div>
          ) : null}
          <ServiceScheduleTable records={displayedRecords} loading={loading} error={error} />
        </section>
      </div>
    </DashboardLayout>
  );
}
