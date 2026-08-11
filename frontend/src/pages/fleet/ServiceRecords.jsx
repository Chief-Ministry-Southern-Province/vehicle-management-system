import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FiActivity, FiArrowUpRight, FiBarChart2, FiCalendar, FiCheckCircle, FiDollarSign, FiDownload, FiTool, FiTrendingUp, FiTruck } from "react-icons/fi";
import DashboardLayout from "../../layouts/DashboardLayout";
import ServiceFilters from "../../components/subjectOfficer/service/ServiceFilters";
import ServiceScheduleTable from "../../components/subjectOfficer/service/ServiceScheduleTable";
import { getVehicles } from "../../api/authApi";
import { generateServiceRecordsPdf } from "../../utils/serviceRecordsPdf";

const EMPTY_FILTERS = { search: "", serviceType: "" };
const START_YEAR = 2025;
const END_YEAR = Math.max(2030, new Date().getFullYear() + 5);
const YEAR_OPTIONS = Array.from(
  { length: END_YEAR - START_YEAR + 1 },
  (_, index) => START_YEAR + index,
);

const formatCurrency = (value, decimals = 0) => `LKR ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
const formatNumber = (value, decimals = 0) => Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

function MetricCard({ icon, label, value, detail, accent }) {
  const accents = {
    blue: "from-blue-600 to-indigo-700 shadow-blue-900/20",
    cyan: "from-cyan-500 to-teal-600 shadow-cyan-900/20",
    amber: "from-amber-400 to-orange-600 shadow-orange-900/20",
    slate: "from-slate-700 to-slate-900 shadow-slate-900/20",
  };

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white p-5 shadow-[0_12px_40px_-20px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${accents[accent]}`} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{label}</p>
          <p className="mt-3 text-2xl font-black tracking-tight text-slate-900">{value}</p>
          <p className="mt-2 text-xs font-medium text-slate-500">{detail}</p>
        </div>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${accents[accent]}`}>{icon}</span>
      </div>
    </article>
  );
}

function ServiceChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const cost = payload.find((item) => item.dataKey === "cost")?.value || 0;
  const services = payload.find((item) => item.dataKey === "services")?.value || 0;

  return (
    <div className="min-w-52 rounded-2xl border border-slate-700 bg-slate-950/95 p-4 text-white shadow-2xl backdrop-blur-xl">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between gap-6 text-sm"><span className="text-blue-300">Service cost</span><strong>{formatCurrency(cost, 2)}</strong></div>
        <div className="flex items-center justify-between gap-6 text-sm"><span className="text-cyan-300">Completed</span><strong>{formatNumber(services)} services</strong></div>
      </div>
      <p className="mt-3 border-t border-slate-700 pt-3 text-[11px] text-slate-400">Click to view this month's records</p>
    </div>
  );
}

export default function ServiceRecords() {
  const [records, setRecords] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedYear, setSelectedYear] = useState(
    String(Math.max(START_YEAR, new Date().getFullYear())),
  );
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIds, setSelectedIds] = useState(() => new Set());

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

  const yearlySummary = useMemo(() => {
    const totalCost = yearRecords.reduce((sum, record) => sum + (Number(record.cost) || 0), 0);
    const activeVehicles = new Set(yearRecords.map((record) => record.vehicle).filter(Boolean)).size;
    const peakMonth = monthlyData.reduce(
      (peak, month) => (month.cost > peak.cost ? month : peak),
      { cost: 0, services: 0, month: "No data", monthKey: "" },
    );

    return {
      totalCost,
      activeVehicles,
      averageCost: yearRecords.length ? totalCost / yearRecords.length : 0,
      peakMonth,
    };
  }, [monthlyData, yearRecords]);

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

  const selectedRecords = useMemo(
    () => records.filter((record) => selectedIds.has(record.id)),
    [records, selectedIds],
  );

  const toggleRecord = (recordId) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(recordId)) next.delete(recordId);
      else next.add(recordId);
      return next;
    });
  };

  const toggleAllRecords = (items, selected) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      items.forEach((item) => {
        if (selected) next.add(item.id);
        else next.delete(item.id);
      });
      return next;
    });
  };

  const exportSelectedRecords = () => {
    try {
      generateServiceRecordsPdf(selectedRecords);
    } catch (exportError) {
      window.alert(exportError.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-8">
        <header className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-[0_12px_35px_-22px_rgba(15,23,42,0.35)] sm:px-8 sm:py-7">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-blue-600 to-cyan-400" />
          <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-blue-50" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                <FiTool size={22} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Fleet Maintenance Center</p>
                <h1 className="mt-1.5 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Service &amp; Maintenance Records</h1>
                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">Monitor monthly service costs and vehicle maintenance records.</p>
              </div>
            </div>
            <div className="flex w-fit shrink-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm ring-1 ring-slate-200"><FiCalendar /></div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Reporting year</p>
                <p className="mt-0.5 text-lg font-black leading-none text-slate-900">{selectedYear}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Service performance summary">
          <MetricCard icon={<FiDollarSign size={20} />} label="Annual service cost" value={formatCurrency(yearlySummary.totalCost)} detail={`Across ${selectedYear}`} accent="blue" />
          <MetricCard icon={<FiCheckCircle size={20} />} label="Services completed" value={formatNumber(yearRecords.length)} detail="Recorded maintenance events" accent="cyan" />
          <MetricCard icon={<FiActivity size={20} />} label="Average service" value={formatCurrency(yearlySummary.averageCost)} detail="Average cost per service" accent="amber" />
          <MetricCard icon={<FiTruck size={20} />} label="Vehicles serviced" value={formatNumber(yearlySummary.activeVehicles)} detail="Unique maintained vehicles" accent="slate" />
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_18px_55px_-30px_rgba(15,23,42,0.45)]">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiBarChart2 size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Monthly Maintenance Intelligence</h2>
                <p className="text-sm text-slate-500">Monthly service cost and completed services</p>
              </div>
            </div>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 pl-4 text-sm font-semibold text-slate-600">
              <FiCalendar className="text-blue-600" /> Year
              <select
                value={selectedYear}
                onChange={(event) => {
                  setSelectedYear(event.target.value);
                  setSelectedMonth("");
                }}
                className="rounded-xl border-0 bg-white px-4 py-2 font-bold text-slate-900 shadow-sm outline-none ring-1 ring-slate-200 transition focus:ring-2 focus:ring-blue-500"
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
            <div className="h-[380px] w-full px-2 pb-5 pt-4 sm:px-6">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData} margin={{ top: 16, right: 10, left: 6, bottom: 10 }} onClick={selectChartMonth} style={{ cursor: "pointer" }}>
                  <defs>
                    <linearGradient id="serviceCostGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={1} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 6" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }} dy={10} />
                  <YAxis yAxisId="cost" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={(value) => `LKR ${Number(value).toLocaleString()}`} width={90} />
                  <YAxis yAxisId="services" orientation="right" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#0891b2", fontSize: 12 }} width={45} />
                  <Tooltip content={<ServiceChartTooltip />} cursor={{ fill: "#eff6ff", opacity: 0.75 }} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: 20, fontSize: 12 }} />
                  <Bar yAxisId="cost" dataKey="cost" name="Cost (LKR)" fill="url(#serviceCostGradient)" radius={[8, 8, 2, 2]} cursor="pointer">
                    {monthlyData.map((entry) => <Cell key={entry.monthKey} fill={selectedMonth === entry.monthKey ? "#0f172a" : "url(#serviceCostGradient)"} />)}
                  </Bar>
                  <Line yAxisId="services" dataKey="services" name="Services" stroke="#06b6d4" strokeWidth={3} dot={{ r: 3.5, fill: "#ffffff", strokeWidth: 2, cursor: "pointer" }} activeDot={{ r: 6, fill: "#06b6d4", stroke: "#ffffff", strokeWidth: 3, cursor: "pointer" }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="grid gap-4 rounded-2xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-white to-blue-50 p-5 shadow-sm sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-lg shadow-orange-200"><FiTrendingUp size={22} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Peak maintenance insight</p>
            <p className="mt-1 text-lg font-black text-slate-900">{yearlySummary.peakMonth.month} · {formatCurrency(yearlySummary.peakMonth.cost)}</p>
            <p className="mt-1 text-sm text-slate-500">{formatNumber(yearlySummary.peakMonth.services)} completed services during the highest-cost month.</p>
          </div>
          <button type="button" disabled={!yearlySummary.peakMonth.monthKey} onClick={() => setSelectedMonth(yearlySummary.peakMonth.monthKey)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40">View records <FiArrowUpRight /></button>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_55px_-30px_rgba(15,23,42,0.45)]">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white"><FiTool /></div>
            <div><h2 className="font-black text-slate-900">Maintenance Records Ledger</h2><p className="text-sm text-slate-500">Search, filter, select, and export service history.</p></div>
          </div>
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
          {!loading && !error && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white px-5 py-3">
              <p className="text-sm text-slate-600"><strong className="text-slate-900">{selectedRecords.length}</strong> service {selectedRecords.length === 1 ? "record" : "records"} selected</p>
              <button type="button" onClick={exportSelectedRecords} disabled={selectedRecords.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"><FiDownload /> Export Selected PDF</button>
            </div>
          )}
          <ServiceScheduleTable records={displayedRecords} loading={loading} error={error} selectedIds={selectedIds} onToggle={toggleRecord} onToggleAll={toggleAllRecords} />
        </section>
      </div>
    </DashboardLayout>
  );
}
