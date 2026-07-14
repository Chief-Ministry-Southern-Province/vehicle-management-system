import DashboardLayout from "../../layouts/DashboardLayout";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVehicles } from "../../api/authApi";
import {
  FiFilter,
  FiChevronRight,
  FiSearch,
  FiRefreshCw,
  FiDownload,
  FiFileText,
  FiChevronDown,
  FiTruck,
  FiCheckSquare,
  FiSlash,
  FiTool,
  FiDroplet,
  FiCalendar,
  FiAlertTriangle,
  FiArrowUp,
  FiArrowDown,
  FiChevronsLeft,
  FiChevronsRight,
  FiX,
  FiInbox,
  FiImage,
} from "react-icons/fi";

/* ------------------------------------------------------------------ */
/*  Mock data — swap for your real API call. `image` is left null     */
/*  here on purpose; when your API returns a URL it will render       */
/*  automatically, otherwise a clean placeholder icon is shown.       */
/* ------------------------------------------------------------------ */
const STATUSES = ["Available", "Unavailable", "Maintenance"];
const PAGE_SIZE = 6;

const STATUS_STYLES = {
  Available: "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100",
  Unavailable: "bg-red-50 text-red-600 ring-1 ring-inset ring-red-100",
  Maintenance: "bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-100",
};

const STATUS_ICON = {
  Available: <FiCheckSquare className="h-3 w-3" />,
  Unavailable: <FiSlash className="h-3 w-3" />,
  Maintenance: <FiTool className="h-3 w-3" />,
};

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  Small building blocks                                             */
/* ------------------------------------------------------------------ */
function Breadcrumb() {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
      <span className="hover:text-slate-700 cursor-default">Dashboard</span>
      <FiChevronRight className="h-3.5 w-3.5 text-slate-300" />
      <span className="hover:text-slate-700 cursor-default">Vehicles</span>
      <FiChevronRight className="h-3.5 w-3.5 text-slate-300" />
      <span className="text-slate-800 font-medium">Total Vehicles</span>
    </nav>
  );
}

function SummaryCard({ icon, tone, label, value, sub }) {
  const tones = {
    indigo: "from-indigo-500 to-indigo-600 bg-indigo-500/10 ring-indigo-100",
    emerald: "from-emerald-500 to-emerald-600 bg-emerald-500/10 ring-emerald-100",
    red: "from-red-500 to-red-600 bg-red-500/10 ring-red-100",
    amber: "from-amber-400 to-amber-500 bg-amber-500/10 ring-amber-100",
  };
  const [iconGrad, glow, ring] = tones[tone].split(" ");
  return (
    <div className={`relative overflow-hidden rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm ring-1 ${ring}`}>
      <div className={`pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full blur-2xl opacity-70 ${glow}`} />
      <div className="relative flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md bg-gradient-to-br ${iconGrad}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="text-xl font-bold text-slate-800 leading-tight">{value}</p>
        </div>
      </div>
      {sub && <p className="relative mt-2 text-[11px] text-slate-400">{sub}</p>}
    </div>
  );
}

function SortHeader({ label, field, sortConfig, onSort, className = "" }) {
  const active = sortConfig.field === field;
  return (
    <th
      onClick={() => onSort(field)}
      className={`p-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 cursor-pointer select-none hover:text-slate-700 transition-colors whitespace-nowrap ${className}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active ? (
          sortConfig.dir === "asc" ? (
            <FiArrowUp className="h-3 w-3 text-blue-600" />
          ) : (
            <FiArrowDown className="h-3 w-3 text-blue-600" />
          )
        ) : (
          <FiArrowDown className="h-3 w-3 text-slate-300" />
        )}
      </span>
    </th>
  );
}

function VehicleThumb({ image, model }) {
  if (image) {
    return <img src={image} alt={model} className="h-11 w-11 rounded-xl object-cover shrink-0" />;
  }
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
      <FiImage className="h-5 w-5" />
    </div>
  );
}

function RowSkeleton() {
  return (
    <tr className="border-t border-slate-100">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 w-full max-w-[100px] rounded bg-slate-100 animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

function EmptyState({ onClear }) {
  return (
    <tr>
      <td colSpan={8} className="py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 mb-4">
            <FiInbox className="h-7 w-7" />
          </div>
          <p className="text-slate-700 font-medium">No vehicles found</p>
          <p className="text-slate-400 text-sm mt-1 max-w-xs">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <button onClick={onClear} className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700">
            Clear all filters
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */
export default function TotalVehicles() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [fuelFilter, setFuelFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ field: "model", dir: "asc" });
  const [page, setPage] = useState(1);

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await getVehicles();
      setVehicles((response?.data?.vehicles || []).map((vehicle) => ({
        id: vehicle.id,
        image: vehicle.image_url,
        model: `${vehicle.make} ${vehicle.model}`,
        registerNo: vehicle.registration_number,
        type: vehicle.vehicle_type,
        fuel: vehicle.fuel_type || "—",
        fuelCapacity: vehicle.fuel_capacity ?? "—",
        fuelLevel: vehicle.fuel_level ?? "—",
        seatCapacity: vehicle.seat_capacity ?? vehicle.seating_capacity ?? "—",
        licenseExpiry: vehicle.revenue_license_expiry || vehicle.registration_expiry,
        status: vehicle.status
          ? `${vehicle.status.charAt(0).toUpperCase()}${vehicle.status.slice(1)}`
          : "Unavailable",
      })));
    } catch (error) {
      setVehicles([]);
      setLoadError(error?.message || "Unable to load vehicles from the database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const handleRefresh = () => loadVehicles();

  const types = useMemo(() => [...new Set(vehicles.map((vehicle) => vehicle.type).filter(Boolean))], [vehicles]);
  const fuels = useMemo(() => [...new Set(vehicles.map((vehicle) => vehicle.fuel).filter((fuel) => fuel && fuel !== "—"))], [vehicles]);

  const handleSort = (field) => {
    setSortConfig((prev) =>
      prev.field === field ? { field, dir: prev.dir === "asc" ? "desc" : "asc" } : { field, dir: "asc" }
    );
  };

  const clearFilters = () => {
    setQuery("");
    setTypeFilter("All");
    setFuelFilter("All");
    setStatusFilter("All");
    setPage(1);
  };

  const filtered = useMemo(() => {
    let rows = vehicles.filter((v) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        v.model.toLowerCase().includes(q) ||
        v.registerNo.toLowerCase().includes(q);
      const matchesType = typeFilter === "All" || v.type === typeFilter;
      const matchesFuel = fuelFilter === "All" || v.fuel === fuelFilter;
      const matchesStatus = statusFilter === "All" || v.status === statusFilter;
      return matchesQuery && matchesType && matchesFuel && matchesStatus;
    });

    rows = [...rows].sort((a, b) => {
      const { field, dir } = sortConfig;
      const mult = dir === "asc" ? 1 : -1;
      if (typeof a[field] === "number") return (a[field] - b[field]) * mult;
      return String(a[field]).localeCompare(String(b[field])) * mult;
    });

    return rows;
  }, [vehicles, query, typeFilter, fuelFilter, statusFilter, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [query, typeFilter, fuelFilter, statusFilter]);

  const summary = useMemo(() => {
    const available = vehicles.filter((v) => v.status === "Available").length;
    const unavailable = vehicles.filter((v) => v.status === "Unavailable").length;
    const maintenance = vehicles.filter((v) => v.status === "Maintenance").length;
    return { total: vehicles.length, available, unavailable, maintenance };
  }, [vehicles]);

  return (
    <DashboardLayout>
    <div className="bg-slate-50 min-h-screen p-6">
      <Breadcrumb />

      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Total Vehicles</h1>
          <p className="text-sm text-slate-500 mt-1">Full fleet inventory and specifications</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <div className="relative">
            <button
              onClick={() => setExportOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <FiDownload />
              Export
              <FiChevronDown className={`h-3.5 w-3.5 transition-transform ${exportOpen ? "rotate-180" : ""}`} />
            </button>
            {exportOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl border border-slate-100 bg-white shadow-lg overflow-hidden z-10">
                <button onClick={() => setExportOpen(false)} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                  <FiFileText className="text-rose-500" /> Export as PDF
                </button>
                <button onClick={() => setExportOpen(false)} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 border-t border-slate-100">
                  <FiFileText className="text-emerald-600" /> Export as Excel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard icon={<FiTruck />} tone="indigo" label="Total Vehicles" value={summary.total} sub="Entire registered fleet" />
        <SummaryCard icon={<FiCheckSquare />} tone="emerald" label="Available" value={summary.available} sub="Ready for allocation" />
        <SummaryCard icon={<FiSlash />} tone="red" label="Unavailable" value={summary.unavailable} sub="Currently in use / offline" />
        <SummaryCard icon={<FiTool />} tone="amber" label="Maintenance" value={summary.maintenance} sub="Under service" />
      </div>

      {/* Table card */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        {loadError && <div className="m-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</div>}
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Fleet Inventory</h2>
            <p className="text-slate-400 text-sm">{filtered.length} matching vehicles</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search vehicle or register number..."
                className="pl-9 pr-8 py-2 w-full sm:w-72 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center"
              >
                <FiFilter />
                Filters
                {(typeFilter !== "All" || fuelFilter !== "All" || statusFilter !== "All") && (
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                )}
              </button>

              {filtersOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-100 bg-white shadow-lg p-4 z-10 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Vehicle Type</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option>All</option>
                      {types.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Fuel Type</label>
                    <select
                      value={fuelFilter}
                      onChange={(e) => setFuelFilter(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option>All</option>
                      {fuels.map((f) => (
                        <option key={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option>All</option>
                      {STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <button onClick={clearFilters} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px]">
            <thead className="bg-slate-50/70">
              <tr>
                <SortHeader label="Vehicle Name" field="model" sortConfig={sortConfig} onSort={handleSort} />
                <SortHeader label="Register Number" field="registerNo" sortConfig={sortConfig} onSort={handleSort} />
                <SortHeader label="Fuel Type" field="fuel" sortConfig={sortConfig} onSort={handleSort} />
                <SortHeader label="Fuel Capacity" field="fuelCapacity" sortConfig={sortConfig} onSort={handleSort} />
                <SortHeader label="Fuel Level" field="fuelLevel" sortConfig={sortConfig} onSort={handleSort} />
                <SortHeader label="Seat Capacity" field="seatCapacity" sortConfig={sortConfig} onSort={handleSort} />
                <SortHeader label="Licence Expire Date" field="licenseExpiry" sortConfig={sortConfig} onSort={handleSort} />
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: PAGE_SIZE }).map((_, i) => <RowSkeleton key={i} />)
              ) : pageRows.length === 0 ? (
                <EmptyState onClear={clearFilters} />
              ) : (
                pageRows.map((v) => {
                  const daysLeft = v.licenseExpiry ? daysUntil(v.licenseExpiry) : null;
                  const expiringSoon = daysLeft <= 30 && daysLeft >= 0;
                  const expired = daysLeft < 0;
                  return (
                    <tr
                      key={v.id}
                      onClick={() => navigate(`/vehicledetails/${encodeURIComponent(v.registerNo)}`)}
                      className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <VehicleThumb image={v.image} model={v.model} />
                          <div>
                            <div className="font-medium text-slate-800 whitespace-nowrap">{v.model}</div>
                            <div className="text-xs text-slate-400">{v.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-blue-600 font-medium whitespace-nowrap">{v.registerNo}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-slate-600 whitespace-nowrap">
                          <FiDroplet className="h-3.5 w-3.5 text-cyan-500" /> {v.fuel}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-slate-600 whitespace-nowrap">
                          <FiDroplet className="h-3.5 w-3.5 text-slate-400" /> {v.fuelCapacity === "—" ? v.fuelCapacity : `${v.fuelCapacity} L`}
                        </span>
                      </td>
                      <td className="p-4">
                        {v.fuelLevel === "—" ? (
                          <span className="text-slate-400">—</span>
                        ) : (
                          <div className="flex min-w-32 items-center gap-2">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className={`h-full rounded-full ${v.fuelLevel < 20 ? "bg-red-500" : v.fuelLevel < 50 ? "bg-amber-500" : "bg-emerald-500"}`}
                                style={{ width: `${Math.min(100, Math.max(0, Number(v.fuelLevel)))}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-slate-600">{v.fuelLevel}%</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-slate-600 whitespace-nowrap">
                        {v.seatCapacity === "—" ? v.seatCapacity : `${v.seatCapacity} seats`}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <FiCalendar className="h-3.5 w-3.5 text-slate-400" />
                          <span className={expired ? "text-red-600 font-medium" : expiringSoon ? "text-amber-600 font-medium" : "text-slate-600"}>
                            {formatDate(v.licenseExpiry)}
                          </span>
                          {(expiringSoon || expired) && <FiAlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${STATUS_STYLES[v.status]}`}>
                          {STATUS_ICON[v.status]}
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-slate-400">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>

            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage(1)}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                <FiChevronsLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                    p === page ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage(totalPages)}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                <FiChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </DashboardLayout>
  );
}
