import DashboardLayout from "../../layouts/DashboardLayout";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  FiUsers,
  FiDroplet,
  FiCalendar,
  FiHash,
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
const RAW_VEHICLES = [
  { id: "VEH-001", image: null, model: "Toyota Hiace", registerNo: "WP-CAB-4521", chassisNo: "JT2BF22K1W0123456", type: "Van", fuel: "Diesel", year: 2022, seats: 15, licenseExpiry: "2026-08-14", status: "Available" },
  { id: "VEH-002", image: null, model: "Nissan Navara", registerNo: "WP-CAD-7788", chassisNo: "5N1AR2MM8FC612233", type: "Pickup Truck", fuel: "Diesel", year: 2021, seats: 5, licenseExpiry: "2026-07-22", status: "Unavailable" },
  { id: "VEH-003", image: null, model: "Toyota Prius", registerNo: "WP-CAA-1190", chassisNo: "JTDKB20U493456789", type: "Sedan", fuel: "Hybrid", year: 2023, seats: 5, licenseExpiry: "2027-01-30", status: "Available" },
  { id: "VEH-004", image: null, model: "Mitsubishi Rosa", registerNo: "WP-NB-3345", chassisNo: "JMYLR811AKC009812", type: "Minibus", fuel: "Diesel", year: 2019, seats: 28, licenseExpiry: "2026-07-15", status: "Maintenance" },
  { id: "VEH-005", image: null, model: "Toyota Land Cruiser", registerNo: "WP-CAB-9021", chassisNo: "JTMHV05J104123998", type: "SUV", fuel: "Diesel", year: 2020, seats: 7, licenseExpiry: "2026-09-05", status: "Available" },
  { id: "VEH-006", image: null, model: "Bajaj RE", registerNo: "WP-THR-5567", chassisNo: "MD2A15AZ7JCB45210", type: "Three Wheeler", fuel: "Petrol", year: 2022, seats: 3, licenseExpiry: "2026-07-10", status: "Available" },
  { id: "VEH-007", image: null, model: "Isuzu Elf", registerNo: "WP-LC-6634", chassisNo: "JAANPR85E00987654", type: "Dump Truck", fuel: "Diesel", year: 2018, seats: 3, licenseExpiry: "2026-12-01", status: "Maintenance" },
  { id: "VEH-008", image: null, model: "Honda Vezel", registerNo: "WP-CAC-2298", chassisNo: "RU3ZZ6DAWL0033445", type: "SUV", fuel: "Hybrid", year: 2023, seats: 5, licenseExpiry: "2027-03-18", status: "Available" },
  { id: "VEH-009", image: null, model: "Tata Ace", registerNo: "WP-GA-8843", chassisNo: "MAT445021D2C11223", type: "Pickup Truck", fuel: "Diesel", year: 2020, seats: 3, licenseExpiry: "2026-07-09", status: "Unavailable" },
  { id: "VEH-010", image: null, model: "Toyota Axio", registerNo: "WP-CAA-4471", chassisNo: "NZE141G3009887665", type: "Sedan", fuel: "Petrol", year: 2021, seats: 5, licenseExpiry: "2026-11-27", status: "Available" },
  { id: "VEH-011", image: null, model: "Ashok Leyland Dost", registerNo: "WP-LC-9902", chassisNo: "MB1TDA2P4NW332211", type: "Pickup Truck", fuel: "Diesel", year: 2019, seats: 3, licenseExpiry: "2026-08-02", status: "Maintenance" },
  { id: "VEH-012", image: null, model: "Suzuki Every", registerNo: "WP-CAB-1123", chassisNo: "DA17V0100987766554", type: "Van", fuel: "Petrol", year: 2022, seats: 8, licenseExpiry: "2027-02-14", status: "Available" },
];

const TYPES = [...new Set(RAW_VEHICLES.map((v) => v.type))];
const FUELS = [...new Set(RAW_VEHICLES.map((v) => v.fuel))];
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
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [fuelFilter, setFuelFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ field: "model", dir: "asc" });
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 700);
  };

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
    let rows = RAW_VEHICLES.filter((v) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        v.model.toLowerCase().includes(q) ||
        v.registerNo.toLowerCase().includes(q) ||
        v.chassisNo.toLowerCase().includes(q);
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
  }, [query, typeFilter, fuelFilter, statusFilter, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [query, typeFilter, fuelFilter, statusFilter]);

  const summary = useMemo(() => {
    const available = RAW_VEHICLES.filter((v) => v.status === "Available").length;
    const unavailable = RAW_VEHICLES.filter((v) => v.status === "Unavailable").length;
    const maintenance = RAW_VEHICLES.filter((v) => v.status === "Maintenance").length;
    return { total: RAW_VEHICLES.length, available, unavailable, maintenance };
  }, []);

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
                placeholder="Search model, register or chassis no..."
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
                      {TYPES.map((t) => (
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
                      {FUELS.map((f) => (
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
          <table className="w-full min-w-[1180px]">
            <thead className="bg-slate-50/70">
              <tr>
                <SortHeader label="Vehicle" field="model" sortConfig={sortConfig} onSort={handleSort} />
                <SortHeader label="Register No." field="registerNo" sortConfig={sortConfig} onSort={handleSort} />
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1"><FiHash className="h-3 w-3" /> Chassis No.</span>
                </th>
                <SortHeader label="Type" field="type" sortConfig={sortConfig} onSort={handleSort} />
                <SortHeader label="Fuel" field="fuel" sortConfig={sortConfig} onSort={handleSort} />
                <SortHeader label="Year" field="year" sortConfig={sortConfig} onSort={handleSort} />
                <SortHeader label="Seats" field="seats" sortConfig={sortConfig} onSort={handleSort} />
                <SortHeader label="License Expiry" field="licenseExpiry" sortConfig={sortConfig} onSort={handleSort} />
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
                  const daysLeft = daysUntil(v.licenseExpiry);
                  const expiringSoon = daysLeft <= 30 && daysLeft >= 0;
                  const expired = daysLeft < 0;
                  return (
                    <tr
                      key={v.id}
                      onClick={() => navigate(`/vehicles/${v.id}`)}
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
                      <td className="p-4 text-slate-500 whitespace-nowrap font-mono text-xs">{v.chassisNo}</td>
                      <td className="p-4 text-slate-600 whitespace-nowrap">{v.type}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-slate-600 whitespace-nowrap">
                          <FiDroplet className="h-3.5 w-3.5 text-cyan-500" /> {v.fuel}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 whitespace-nowrap">{v.year}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-slate-600 whitespace-nowrap">
                          <FiUsers className="h-3.5 w-3.5 text-slate-400" /> {v.seats}
                        </span>
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