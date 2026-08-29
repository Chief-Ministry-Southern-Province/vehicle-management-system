import { useEffect, useMemo, useState } from "react";
import { Bar, CartesianGrid, Cell, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FiActivity, FiAlertTriangle, FiArrowUpRight, FiBarChart2, FiCalendar, FiDollarSign, FiDownload, FiTool, FiTrendingUp, FiTruck } from "react-icons/fi";
import DashboardLayout from "../../layouts/DashboardLayout";
import RepairFilters from "../../components/subjectOfficer/repair/RepairFilters";
import RepairTable from "../../components/subjectOfficer/repair/RepairTable";
import { getVehicles } from "../../api/authApi";
import { generateRepairRecordsPdf } from "../../utils/repairRecordsPdf";

const EMPTY_FILTERS = { search: "", repairType: "" };
const START_YEAR = 2025;
const END_YEAR = Math.max(2030, new Date().getFullYear() + 5);
const YEAR_OPTIONS = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, index) => START_YEAR + index);

const formatCurrency = (value, decimals = 0) => `LKR ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
const formatNumber = (value, decimals = 0) => Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

function MetricCard({ icon, label, value, detail, accent }) {
  const accents = {
    blue: {
      border: "border-blue-100 bg-linear-to-br from-white to-blue-50",
      icon: "bg-blue-600 text-white shadow-blue-200",
      line: "bg-blue-500",
      label: "text-blue-700",
    },
    rose: {
      border: "border-rose-100 bg-linear-to-br from-white to-rose-50/70",
      icon: "bg-rose-100 text-rose-700 shadow-rose-100",
      line: "bg-rose-500",
      label: "text-rose-700",
    },
    amber: {
      border: "border-amber-100 bg-linear-to-br from-white to-amber-50/70",
      icon: "bg-amber-100 text-amber-700 shadow-amber-100",
      line: "bg-amber-500",
      label: "text-amber-700",
    },
    slate: {
      border: "border-slate-200 bg-white",
      icon: "bg-slate-100 text-slate-700 shadow-slate-100",
      line: "bg-slate-700",
      label: "text-slate-600",
    },
  };
  const style = accents[accent];
  return (
    <article className={`relative overflow-hidden rounded-2xl border p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${style.border}`}>
      <div className="flex items-start justify-between gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${style.icon}`}>{icon}</span>
        <div className="min-w-0 flex-1 text-right">
          <p className={`text-[11px] font-bold uppercase tracking-[0.08em] ${style.label}`}>{label}</p>
          <p className="mt-2 text-2xl font-extrabold leading-none tracking-tight text-slate-900 sm:text-3xl">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">{detail}</p>
      <div className={`absolute inset-x-0 bottom-0 h-0.5 ${style.line}`} />
    </article>
  );
}

function RepairChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const cost = payload.find((item) => item.dataKey === "cost")?.value || 0;
  const repairs = payload.find((item) => item.dataKey === "repairs")?.value || 0;
  return (
    <div className="min-w-52 rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl">
      <p className="text-xs font-bold uppercase tracking-widest text-rose-600">{label}</p>
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between gap-6 text-sm"><span className="text-slate-500">Repair cost</span><strong>{formatCurrency(cost, 2)}</strong></div>
        <div className="flex items-center justify-between gap-6 text-sm"><span className="text-slate-500">Completed</span><strong>{formatNumber(repairs)} repairs</strong></div>
      </div>
      <p className="mt-3 border-t border-slate-100 pt-3 text-[11px] text-slate-400">Click to view this month's records</p>
    </div>
  );
}

export default function RepairRecords() {
  const [records, setRecords] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedYear, setSelectedYear] = useState(String(Math.max(START_YEAR, new Date().getFullYear())));
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  useEffect(() => {
    let active = true;
    const loadRepairRecords = async () => {
      try {
        const response = await getVehicles();
        const vehicles = response?.data?.vehicles;
        if (!Array.isArray(vehicles)) throw new Error("Unable to read vehicle records.");

        const repairRecords = vehicles.flatMap((vehicle) =>
          (Array.isArray(vehicle.repair_details) ? vehicle.repair_details : []).map((repair, index) => ({
            ...repair,
            id: `${vehicle.id}-${repair.repair_date || "repair"}-${index}`,
            vehicle: vehicle.registration_number,
            model: [vehicle.make, vehicle.model].filter(Boolean).join(" "),
          })),
        );
        repairRecords.sort((first, second) => new Date(second.repair_date || 0).getTime() - new Date(first.repair_date || 0).getTime());
        if (active) setRecords(repairRecords);
      } catch (loadError) {
        if (active) setError(loadError?.message || "Unable to load repair records from the database.");
      } finally {
        if (active) setLoading(false);
      }
    };
    loadRepairRecords();
    return () => { active = false; };
  }, []);

  const repairTypes = useMemo(() =>
    [...new Set(records.map((record) => record.repair_type).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [records],
  );

  const filteredRecords = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return records.filter((record) => {
      const matchesSearch = !search || `${record.vehicle || ""} ${record.model || ""} ${record.repair_type || ""}`.toLowerCase().includes(search);
      const matchesType = !filters.repairType || record.repair_type === filters.repairType;
      return matchesSearch && matchesType;
    });
  }, [filters, records]);

  const yearRecords = useMemo(() => filteredRecords.filter((record) => {
    const date = new Date(record.repair_date);
    return !Number.isNaN(date.getTime()) && String(date.getFullYear()) === selectedYear;
  }), [filteredRecords, selectedYear]);

  const displayedRecords = useMemo(() => {
    if (!selectedMonth) return yearRecords;
    return yearRecords.filter((record) => {
      const date = new Date(record.repair_date);
      return !Number.isNaN(date.getTime()) && `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}` === selectedMonth;
    });
  }, [selectedMonth, yearRecords]);

  const monthlyData = useMemo(() => {
    const totals = new Map(Array.from({ length: 12 }, (_, index) => [
      `${selectedYear}-${String(index + 1).padStart(2, "0")}`,
      { cost: 0, repairs: 0 },
    ]));
    yearRecords.forEach((record) => {
      const date = new Date(record.repair_date);
      if (Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const current = totals.get(key) || { cost: 0, repairs: 0 };
      current.cost += Number(record.cost) || 0;
      current.repairs += 1;
      totals.set(key, current);
    });
    return [...totals.entries()].map(([key, values]) => {
      const [year, month] = key.split("-");
      return {
        ...values,
        monthKey: key,
        month: new Date(Number(year), Number(month) - 1).toLocaleDateString(undefined, { month: "short", year: "numeric" }),
      };
    });
  }, [selectedYear, yearRecords]);

  const yearlySummary = useMemo(() => {
    const totalCost = yearRecords.reduce((sum, record) => sum + (Number(record.cost) || 0), 0);
    const affectedVehicles = new Set(yearRecords.map((record) => record.vehicle).filter(Boolean)).size;
    const peakMonth = monthlyData.reduce((peak, month) => month.cost > peak.cost ? month : peak, { cost: 0, repairs: 0, month: "No data", monthKey: "" });
    return {
      totalCost,
      affectedVehicles,
      averageCost: yearRecords.length ? totalCost / yearRecords.length : 0,
      peakMonth,
    };
  }, [monthlyData, yearRecords]);

  const changeMonth = (month) => {
    setSelectedMonth(month);
    if (month) setSelectedYear(month.slice(0, 4));
  };
  const selectChartMonth = (data) => {
    const monthKey = data?.monthKey || data?.payload?.monthKey || data?.activePayload?.[0]?.payload?.monthKey;
    if (monthKey) setSelectedMonth((current) => current === monthKey ? "" : monthKey);
  };
  const selectedMonthLabel = monthlyData.find((item) => item.monthKey === selectedMonth)?.month;
  const selectedRecords = useMemo(() => records.filter((record) => selectedIds.has(record.id)), [records, selectedIds]);
  const toggleRecord = (recordId) => setSelectedIds((current) => {
    const next = new Set(current);
    if (next.has(recordId)) next.delete(recordId); else next.add(recordId);
    return next;
  });
  const toggleAllRecords = (items, selected) => setSelectedIds((current) => {
    const next = new Set(current);
    items.forEach((item) => { if (selected) next.add(item.id); else next.delete(item.id); });
    return next;
  });
  const exportSelectedRecords = () => {
    try { generateRepairRecordsPdf(selectedRecords); }
    catch (exportError) { window.alert(exportError.message); }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1600px] space-y-6 pb-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Fleet operations</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Repair Records</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">Monitor monthly repair costs and vehicle repair history.</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <FiCalendar />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Reporting year</p>
              <p className="text-sm font-bold text-slate-800">{selectedYear}</p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4" aria-label="Repair performance summary">
          <MetricCard icon={<FiDollarSign size={20} />} label="Annual repair cost" value={formatCurrency(yearlySummary.totalCost)} detail={`Across ${selectedYear}`} accent="blue" />
          <MetricCard icon={<FiAlertTriangle size={20} />} label="Repairs completed" value={formatNumber(yearRecords.length)} detail="Recorded repair events" accent="rose" />
          <MetricCard icon={<FiActivity size={20} />} label="Average repair" value={formatCurrency(yearlySummary.averageCost)} detail="Average cost per repair" accent="amber" />
          <MetricCard icon={<FiTruck size={20} />} label="Vehicles repaired" value={formatNumber(yearlySummary.affectedVehicles)} detail="Unique affected vehicles" accent="slate" />
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm shadow-rose-200"><FiBarChart2 size={20} /></div>
              <div><h2 className="font-bold text-slate-900">Monthly Repair Overview</h2><p className="mt-0.5 text-xs text-slate-500">Monthly repair cost and completed repairs</p></div>
            </div>
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-1 pl-3 text-sm font-semibold text-slate-600 shadow-sm">
              <FiCalendar className="text-rose-600" /> Year
              <select value={selectedYear} onChange={(event) => { setSelectedYear(event.target.value); setSelectedMonth(""); }} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-bold text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100">
                {YEAR_OPTIONS.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>
          </div>
          {loading ? (
            <div className="flex h-80 items-center justify-center text-sm text-slate-500">Loading chart...</div>
          ) : error ? (
            <div className="flex h-80 items-center justify-center text-sm font-medium text-red-600">{error}</div>
          ) : yearRecords.length === 0 ? (
            <div className="flex h-80 items-center justify-center text-sm text-slate-500">No repair data is available for {selectedYear}.</div>
          ) : (
            <div className="h-[360px] w-full px-2 pb-5 pt-4 sm:px-5">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData} margin={{ top: 16, right: 10, left: 6, bottom: 10 }} onClick={selectChartMonth} style={{ cursor: "pointer" }}>
                  <defs><linearGradient id="repairCostGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e11d48" stopOpacity={1} /><stop offset="100%" stopColor="#fb923c" stopOpacity={0.72} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="4 6" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }} dy={10} />
                  <YAxis yAxisId="cost" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={(value) => `LKR ${Number(value).toLocaleString()}`} width={90} />
                  <YAxis yAxisId="repairs" orientation="right" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#e11d48", fontSize: 12 }} width={45} />
                  <Tooltip content={<RepairChartTooltip />} cursor={{ fill: "#fff1f2", opacity: 0.75 }} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: 20, fontSize: 12 }} />
                  <Bar yAxisId="cost" dataKey="cost" name="Cost (LKR)" fill="url(#repairCostGradient)" radius={[8, 8, 2, 2]} cursor="pointer">
                    {monthlyData.map((entry) => <Cell key={entry.monthKey} fill={selectedMonth === entry.monthKey ? "#0f172a" : "url(#repairCostGradient)"} />)}
                  </Bar>
                  <Line yAxisId="repairs" dataKey="repairs" name="Repairs" stroke="#f59e0b" strokeWidth={3} dot={{ r: 3.5, fill: "#ffffff", strokeWidth: 2, cursor: "pointer" }} activeDot={{ r: 6, fill: "#f59e0b", stroke: "#ffffff", strokeWidth: 3, cursor: "pointer" }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-700"><FiTrendingUp size={20} /></div>
          <div><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-rose-700">Peak repair insight</p><p className="mt-1 text-base font-bold text-slate-900">{yearlySummary.peakMonth.month} · {formatCurrency(yearlySummary.peakMonth.cost)}</p><p className="mt-1 text-xs text-slate-500">{formatNumber(yearlySummary.peakMonth.repairs)} completed repairs during the highest-cost month.</p></div>
          <button type="button" disabled={!yearlySummary.peakMonth.monthKey} onClick={() => setSelectedMonth(yearlySummary.peakMonth.monthKey)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-40">View records <FiArrowUpRight /></button>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600"><FiTool /></div><div><h2 className="font-bold text-slate-900">Repair Records Ledger</h2><p className="mt-0.5 text-xs text-slate-500">Search, filter, select, and export repair history.</p></div></div>
          <RepairFilters filters={filters} repairTypes={repairTypes} onChange={(name, value) => setFilters((current) => ({ ...current, [name]: value }))} selectedMonth={selectedMonth} onMonthChange={changeMonth} onClear={() => { setFilters(EMPTY_FILTERS); setSelectedMonth(""); }} />
          {selectedMonthLabel ? (
            <div className="flex items-center justify-between border-b border-rose-100 bg-rose-50/70 px-5 py-3 text-sm text-rose-700"><span>Showing repair records for <strong>{selectedMonthLabel}</strong></span><button type="button" onClick={() => setSelectedMonth("")} className="font-semibold hover:text-rose-900">Show all months</button></div>
          ) : !loading && !error ? (
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-600">Showing all repair records for <strong>{selectedYear}</strong>. Click a chart month to filter the records.</div>
          ) : null}
          {!loading && !error && <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3"><p className="text-sm text-slate-600"><strong className="text-slate-900">{selectedRecords.length}</strong> repair {selectedRecords.length === 1 ? "record" : "records"} selected</p><button type="button" onClick={exportSelectedRecords} disabled={selectedRecords.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-rose-200 transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"><FiDownload /> Export Selected PDF</button></div>}
          <RepairTable records={displayedRecords} loading={loading} error={error} selectedIds={selectedIds} onToggle={toggleRecord} onToggleAll={toggleAllRecords} />
        </section>
      </div>
    </DashboardLayout>
  );
}
