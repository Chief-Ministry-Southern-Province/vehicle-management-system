import { useEffect, useMemo, useState } from "react";
import { Bar, CartesianGrid, Cell, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FiActivity, FiBarChart2, FiCalendar, FiDollarSign, FiDownload, FiDroplet, FiTruck } from "react-icons/fi";
import DashboardLayout from "../../layouts/DashboardLayout";
import FuelFilters from "../../components/subjectOfficer/fuel/FuelFilters";
import FuelTable from "../../components/subjectOfficer/fuel/FuelTable";
import { getApprovedJourneys, getVehicles } from "../../api/authApi";
import { annualVehicleConsumption, monthlyVehicleConsumption } from "../../utils/monthlyVehicleConsumption";
import { generateFuelRecordsPdf } from "../../utils/fuelRecordsPdf";
import { useLanguage } from "../../context/useLanguage";

const EMPTY_FILTERS = { search: "", fuelType: "" };
const START_YEAR = 2025;
const END_YEAR = Math.max(2030, new Date().getFullYear() + 5);
const YEAR_OPTIONS = Array.from(
  { length: END_YEAR - START_YEAR + 1 },
  (_, index) => START_YEAR + index,
);

const formatCurrency = (value, decimals = 0) =>
  `LKR ${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;

const formatNumber = (value, decimals = 0) =>
  Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

function MetricCard({ icon, label, value, detail, accent }) {
  const accents = {
    blue: {
      border: "border-blue-100 bg-linear-to-br from-white to-blue-50",
      icon: "bg-blue-600 text-white shadow-blue-200",
      line: "bg-blue-500",
      label: "text-blue-700",
    },
    cyan: {
      border: "border-cyan-100 bg-linear-to-br from-white to-cyan-50/70",
      icon: "bg-cyan-100 text-cyan-700 shadow-cyan-100",
      line: "bg-cyan-500",
      label: "text-cyan-700",
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
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${style.icon}`}>
          {icon}
        </span>
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

function FuelChartTooltip({ active, payload, label, vehicle, costOnly }) {
  const { t } = useLanguage();
  if (!active || !payload?.length) return null;

  const liters = payload.find((item) => item.dataKey === "liters")?.value || 0;
  const consumed = payload[0]?.payload?.consumed;

  return (
    <div className="min-w-52 rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-600">{label} · {vehicle}</p>
      <div className="mt-3 space-y-2">
        {costOnly ? <div className="flex items-center justify-between gap-6 text-sm"><span className="text-slate-500">{t("fuel.costLkr")}</span><strong>{formatCurrency(cost, 2)}</strong></div> : <>
          <div className="flex items-center justify-between gap-6 text-sm"><span>{t("fuel.filled")}</span><strong>{formatNumber(liters, 2)} L</strong></div>
          <div className="flex items-center justify-between gap-6 text-sm"><span>{t("fuel.consumed")}</span><strong>{consumed == null ? t("odometer.notRecorded") : `${formatNumber(consumed, 2)} L`}</strong></div>
        </>}
      </div>
      <p className="mt-3 border-t border-slate-100 pt-3 text-[11px] text-slate-400">Click to filter records for this month</p>
    </div>
  );
}

function MonthlyFuelChart({ data, vehicle, selectedMonth, onMonthClick, loading, error, empty, costOnly = false }) {
  const { t } = useLanguage();
  if (loading || error || empty) return <div className="flex h-80 items-center justify-center p-5 text-sm text-slate-500">
    {loading ? t("fuel.chartLoading") : error || t("fuel.chartEmpty")}
  </div>;
  return <div className="overflow-x-auto p-4" role="region" aria-label={t(costOnly ? "fuel.monthlyCostOverview" : "fuel.monthlyOverview")} tabIndex={0}>
    <div className="h-[360px] min-w-[650px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 18, left: 18, bottom: 15 }} onClick={onMonthClick} accessibilityLayer>
          <CartesianGrid strokeDasharray="4 6" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} height={55} label={{ value: t("fuel.month"), position: "insideBottom", offset: 0 }} />
          <YAxis yAxisId="quantity" width={100} tick={{ fontSize: 11 }} tickFormatter={value => Number(value).toLocaleString()}
            label={{ value: costOnly ? "LKR" : "L", angle: -90, position: "insideLeft" }} />
          <Tooltip content={<FuelChartTooltip vehicle={vehicle} costOnly={costOnly} />} />
          <Legend wrapperStyle={{ paddingTop: 15, fontSize: 12 }} />
          <Bar yAxisId="quantity" dataKey={costOnly ? "cost" : "liters"} name={t(costOnly ? "fuel.costLkr" : "fuel.filled")} fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={40}>
            {data.map(entry => <Cell key={entry.monthKey} fill={selectedMonth === entry.monthKey ? "#0f172a" : "#2563eb"} />)}
          </Bar>
          {!costOnly && <Line yAxisId="quantity" dataKey="consumed" name={t("fuel.consumed")} stroke="#0891b2" strokeWidth={3} dot={{ r: 4 }} connectNulls={false} />}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </div>;
}

export default function FuelManagement() {
  const { t } = useLanguage();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [logs, setLogs] = useState([]);
  const [journeys, setJourneys] = useState([]);
  const [journeysLoading, setJourneysLoading] = useState(true);
  const [journeysError, setJourneysError] = useState("");
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
    getApprovedJourneys().then(response => {
      if (!Array.isArray(response?.data?.requests)) throw new Error("Unable to read journey records.");
      if (active) setJourneys(response.data.requests);
    }).catch(err => { if (active) setJourneysError(err?.message || "Unable to load journey records."); })
      .finally(() => { if (active) setJourneysLoading(false); });
    return () => { active = false; };
  }, []);

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
        if (active) {
          setLogs(records);
          const registrations = vehicles.map(vehicle => vehicle.registration_number).filter(Boolean).sort();
          setVehicles(registrations);
          setSelectedVehicle(current => registrations.includes(current) ? current : registrations[0] || "");
        }
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
      const matchesFuelType =
        !filters.fuelType || log.fuel_type === filters.fuelType;
      return (!selectedVehicle || log.vehicle === selectedVehicle) && matchesSearch && matchesFuelType;
    });
  }, [filters, logs, selectedVehicle]);

  const yearLogs = useMemo(() => {
    return filteredLogs.filter((log) => {
      const date = new Date(log.date);
      if (Number.isNaN(date.getTime())) return false;
      return String(date.getFullYear()) === selectedYear;
    });
  }, [filteredLogs, selectedYear]);

  const displayedLogs = useMemo(() => {
    if (!selectedMonth) return yearLogs;
    return yearLogs.filter((log) => {
      const date = new Date(log.date);
      if (Number.isNaN(date.getTime())) return false;
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      return monthKey === selectedMonth;
    });
  }, [selectedMonth, yearLogs]);

  const monthlyData = useMemo(() => {
    const totals = new Map(
      Array.from({ length: 12 }, (_, monthIndex) => [
        `${selectedYear}-${String(monthIndex + 1).padStart(2, "0")}`,
        { cost: 0, liters: 0 },
      ]),
    );
    yearLogs.forEach((log) => {
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
          monthKey: key,
          month: new Date(Number(year), Number(month) - 1).toLocaleDateString(
            undefined,
            { month: "short", year: "numeric" },
          ),
        };
      });
  }, [selectedYear, yearLogs]);

  const consumption = useMemo(() => monthlyVehicleConsumption(journeys, selectedVehicle, selectedYear, filters),
    [journeys, selectedVehicle, selectedYear, filters]);
  const overviewData = useMemo(() => monthlyData.map(row => ({ ...row,
    consumed: Object.hasOwn(consumption, row.monthKey) ? consumption[row.monthKey] : 0,
  })), [monthlyData, consumption]);

  const yearlySummary = useMemo(() => {
    const totalCost = yearLogs.reduce((sum, log) => sum + (Number(log.cost) || 0), 0);
    const totalLiters = yearLogs.reduce((sum, log) => sum + (Number(log.capacity) || 0), 0);
    const { total: totalConsumed, missingMonths } = annualVehicleConsumption(consumption);

    return {
      totalCost,
      totalLiters,
      totalConsumed,
      missingMonths,
      remainingLiters: totalConsumed == null ? null : totalLiters - totalConsumed,
    };
  }, [yearLogs, consumption]);

  const annualScope = `${selectedYear} · ${selectedVehicle || t("fuel.allVehicles")}`;
  const partialConsumption = yearlySummary.totalConsumed != null && yearlySummary.missingMonths > 0
    ? ` · ${t("fuel.partialConsumption")} (${yearlySummary.missingMonths})` : "";
  const annualValue = (value, needsJourneys = false, currency = false) => {
    if (loading || (needsJourneys && journeysLoading)) return t("fuel.chartLoading");
    if (error || (needsJourneys && journeysError)) return t("fuel.chartError");
    if (value == null) return t("odometer.notRecorded");
    return currency ? formatCurrency(value, 2) : `${formatNumber(value, 2)} L`;
  };

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
    if (!monthKey) return;
    setSelectedMonth((current) => (current === monthKey ? "" : monthKey));
  };

  const selectedMonthLabel = monthlyData.find(
    (item) => item.monthKey === selectedMonth,
  )?.month;

  const changeYear = (year) => {
    setSelectedYear(year);
    setSelectedMonth("");
  };

  const toggleRecord = (recordId) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(recordId)) next.delete(recordId);
      else next.add(recordId);
      return next;
    });
  };

  const toggleAllRecords = (records, selected) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      records.forEach((record) => {
        if (selected) next.add(record.id);
        else next.delete(record.id);
      });
      return next;
    });
  };

  const selectedRecords = useMemo(
    () => logs.filter((log) => selectedIds.has(log.id)),
    [logs, selectedIds],
  );

  const exportSelectedRecords = () => {
    try {
      generateFuelRecordsPdf(selectedRecords);
    } catch (exportError) {
      window.alert(exportError.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1600px] space-y-6 pb-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Fleet operations</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Fuel Management</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">Monitor monthly fuel costs, consumption, and vehicle fuel records.</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FiCalendar />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Reporting year</p>
              <p className="text-sm font-bold text-slate-800">{selectedYear}</p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4" aria-label="Fuel performance summary">
          <MetricCard icon={<FiDollarSign size={20} />} label={t("fuel.annualCost")} value={annualValue(yearlySummary.totalCost, false, true)} detail={annualScope} accent="blue" />
          <MetricCard icon={<FiDroplet size={20} />} label={t("fuel.annualFilled")} value={annualValue(yearlySummary.totalLiters)} detail={annualScope} accent="cyan" />
          <MetricCard icon={<FiActivity size={20} />} label={t("fuel.annualConsumed")} value={annualValue(yearlySummary.totalConsumed, true)} detail={annualScope + partialConsumption} accent="amber" />
          <MetricCard icon={<FiTruck size={20} />} label={t("fuel.remainingFuel")} value={annualValue(yearlySummary.remainingLiters, true)} detail={t("fuel.remainingFormula") + partialConsumption} accent="slate" />
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col flex-wrap gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
                <FiBarChart2 size={20} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">{t("fuel.monthlyOverview")}</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {t("fuel.consumptionDetail")}
                </p>
              </div>
            </div>
            <label className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-600">
              {t("fuel.vehicle")}
              <select value={selectedVehicle} onChange={(event) => { setSelectedVehicle(event.target.value); setSelectedIds(new Set()); }}
                disabled={!vehicles.length} className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus:ring-2 focus:ring-blue-100">
                <option value="">{t("fuel.allVehicles")}</option>
                {vehicles.map(vehicle => <option key={vehicle} value={vehicle}>{vehicle}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-1 pl-3 text-sm font-semibold text-slate-600 shadow-sm">
              <FiCalendar className="text-blue-600" /> Year
              <select
                value={selectedYear}
                onChange={(event) => changeYear(event.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-bold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                {YEAR_OPTIONS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <MonthlyFuelChart data={overviewData} vehicle={selectedVehicle || t("fuel.allVehicles")} selectedMonth={selectedMonth}
            onMonthClick={selectChartMonth} loading={loading || journeysLoading} error={error || journeysError} empty={!yearLogs.length && !Object.keys(consumption).length} />        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-bold text-slate-900">{t("fuel.monthlyCostOverview")}</h2>
            <p className="mt-1 text-sm text-slate-500">{selectedVehicle || t("fuel.allVehicles")} · {selectedYear}</p>
          </header>
          <MonthlyFuelChart data={monthlyData} vehicle={selectedVehicle || t("fuel.allVehicles")} selectedMonth={selectedMonth}
            onMonthClick={selectChartMonth} loading={loading} error={error} empty={!yearLogs.length} costOnly />
        </section>


        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><FiDroplet /></div>
            <div>
              <h2 className="font-bold text-slate-900">Fuel Records Ledger</h2>
              <p className="mt-0.5 text-xs text-slate-500">Search, filter, select, and export transaction records.</p>
            </div>
          </div>
          <FuelFilters
            filters={filters}
            onChange={updateFilter}
            selectedMonth={selectedMonth}
            onMonthChange={changeMonth}
            onClear={() => {
              setFilters(EMPTY_FILTERS);
              setSelectedMonth("");
            }}
          />
          {selectedMonthLabel && (
            <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50/70 px-5 py-3 text-sm text-blue-700">
              <span>
                Showing fuel records for <strong>{selectedMonthLabel}</strong>
              </span>
              <button
                type="button"
                onClick={() => setSelectedMonth("")}
                className="font-semibold hover:text-blue-900"
              >
                Show all months
              </button>
            </div>
          )}
          {!selectedMonthLabel && !loading && !error && (
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-600">
              Showing all fuel records for <strong>{selectedYear}</strong>. Click a chart month to filter the records.
            </div>
          )}
          {!loading && !error && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3">
              <p className="text-sm text-slate-600">
                <strong className="text-slate-900">{selectedRecords.length}</strong>{" "}
                fuel {selectedRecords.length === 1 ? "record" : "records"} selected
              </p>
              <button
                type="button"
                onClick={exportSelectedRecords}
                disabled={selectedRecords.length === 0}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiDownload /> Export Selected PDF
              </button>
            </div>
          )}
          <FuelTable
            logs={displayedLogs}
            loading={loading}
            error={error}
            selectedIds={selectedIds}
            onToggle={toggleRecord}
            onToggleAll={toggleAllRecords}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}
