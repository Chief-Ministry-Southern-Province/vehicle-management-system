import { useEffect, useMemo, useState } from "react";
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FiBarChart2, FiDownload, FiTool } from "react-icons/fi";
import DashboardLayout from "../../layouts/DashboardLayout";
import RepairFilters from "../../components/subjectOfficer/repair/RepairFilters";
import RepairTable from "../../components/subjectOfficer/repair/RepairTable";
import { getVehicles } from "../../api/authApi";
import { generateRepairRecordsPdf } from "../../utils/repairRecordsPdf";

const EMPTY_FILTERS = { search: "", repairType: "" };
const START_YEAR = 2025;
const END_YEAR = Math.max(2030, new Date().getFullYear() + 5);
const YEAR_OPTIONS = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, index) => START_YEAR + index);

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
      <div className="space-y-5">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-100 opacity-60 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-cyan-100 opacity-40 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"><FiTool size={14} /> Fleet Repair Center</div>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">Repair Records</h1>
            <p className="mt-2 text-slate-500">Monitor monthly repair costs and vehicle repair history.</p>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><FiBarChart2 size={20} /></div>
              <div><h2 className="font-bold text-slate-900">Monthly Repair Analysis</h2><p className="text-sm text-slate-500">Monthly repair cost and completed repairs</p></div>
            </div>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-600">
              Select Year
              <select value={selectedYear} onChange={(event) => { setSelectedYear(event.target.value); setSelectedMonth(""); }} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
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
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData} margin={{ top: 10, right: 15, left: 10, bottom: 5 }} onClick={selectChartMonth} style={{ cursor: "pointer" }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis yAxisId="cost" tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={(value) => `LKR ${Number(value).toLocaleString()}`} width={90} />
                  <YAxis yAxisId="repairs" orientation="right" allowDecimals={false} tick={{ fill: "#0891b2", fontSize: 12 }} width={45} />
                  <Tooltip formatter={(value, name) => [name === "Cost (LKR)" ? `LKR ${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : Number(value).toLocaleString(), name]} />
                  <Legend />
                  <Bar yAxisId="cost" dataKey="cost" name="Cost (LKR)" fill="#2563eb" radius={[7, 7, 0, 0]} cursor="pointer" />
                  <Line yAxisId="repairs" dataKey="repairs" name="Repairs" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, cursor: "pointer" }} activeDot={{ r: 6, cursor: "pointer" }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <RepairFilters filters={filters} repairTypes={repairTypes} onChange={(name, value) => setFilters((current) => ({ ...current, [name]: value }))} selectedMonth={selectedMonth} onMonthChange={changeMonth} onClear={() => { setFilters(EMPTY_FILTERS); setSelectedMonth(""); }} />
          {selectedMonthLabel ? (
            <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-5 py-3 text-sm text-blue-700"><span>Showing repair records for <strong>{selectedMonthLabel}</strong></span><button type="button" onClick={() => setSelectedMonth("")} className="font-semibold hover:text-blue-900">Show all months</button></div>
          ) : !loading && !error ? (
            <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 text-sm text-slate-600">Showing all repair records for <strong>{selectedYear}</strong>. Click a chart month to filter the records.</div>
          ) : null}
          {!loading && !error && <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white px-5 py-3"><p className="text-sm text-slate-600"><strong className="text-slate-900">{selectedRecords.length}</strong> repair {selectedRecords.length === 1 ? "record" : "records"} selected</p><button type="button" onClick={exportSelectedRecords} disabled={selectedRecords.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"><FiDownload /> Export Selected PDF</button></div>}
          <RepairTable records={displayedRecords} loading={loading} error={error} selectedIds={selectedIds} onToggle={toggleRecord} onToggleAll={toggleAllRecords} />
        </section>
      </div>
    </DashboardLayout>
  );
}
