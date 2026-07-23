import DashboardLayout from "../../layouts/DashboardLayout";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVehicles } from "../../api/authApi";
import { useLanguage } from "../../context/useLanguage";
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
const STATUS_STYLES = {
  Available:
    "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100",
  Unavailable: "bg-red-50 text-red-600 ring-1 ring-inset ring-red-100",
  Maintenance: "bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-100",
};
const STATUS_ICON = {
  Available: <FiCheckSquare className="h-3 w-3" />,
  Unavailable: <FiSlash className="h-3 w-3" />,
  Maintenance: <FiTool className="h-3 w-3" />,
};
function normalizeVehicle(vehicle) {
  return {
    id: vehicle.id,
    image: vehicle.image_url,
    model: `${vehicle.make} ${vehicle.model}`,
    registerNo: vehicle.registration_number,
    type: vehicle.vehicle_type,
    fuel: vehicle.fuel_type || "—",
    fuelCapacity: vehicle.fuel_capacity ?? "—",
    fuelLevel: vehicle.fuel_level ?? "—",
    seatCapacity: vehicle.seat_capacity ?? vehicle.seating_capacity ?? "—",
    licenseExpiry:
      vehicle.revenue_license_expiry || vehicle.registration_expiry,
    status: vehicle.status
      ? `${vehicle.status.charAt(0).toUpperCase()}${vehicle.status.slice(1)}`
      : "Unavailable",
  };
}
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
    indigo: {
      accent: "bg-indigo-500",
      icon: "bg-indigo-50 text-indigo-600 ring-indigo-100",
      glow: "bg-indigo-200",
    },
    emerald: {
      accent: "bg-emerald-500",
      icon: "bg-emerald-50 text-emerald-600 ring-emerald-100",
      glow: "bg-emerald-200",
    },
    red: {
      accent: "bg-red-500",
      icon: "bg-red-50 text-red-600 ring-red-100",
      glow: "bg-red-200",
    },
    amber: {
      accent: "bg-amber-500",
      icon: "bg-amber-50 text-amber-600 ring-amber-100",
      glow: "bg-amber-200",
    },
  };
  const style = tones[tone] || tones.indigo;

  return (
    <div
      className="group relative min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg sm:p-5"
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 ${style.accent}`}
      />
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-40 blur-3xl transition-transform duration-300 group-hover:scale-125 ${style.glow}`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ring-1 ring-inset transition-transform duration-300 group-hover:scale-110 ${style.icon}`}
        >
          {icon}
        </div>
      </div>

      {sub && (
        <p className="relative mt-3 truncate text-xs text-slate-400">{sub}</p>
      )}
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
    return (
      <img
        src={image}
        alt={model}
        className="h-11 w-11 rounded-xl object-cover shrink-0"
      />
    );
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
      {Array.from({
        length: 8,
      }).map((_, i) => (
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
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
          <button
            onClick={onClear}
            className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
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
  const { language } = useLanguage();
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
  const [sortConfig, setSortConfig] = useState({
    field: "model",
    dir: "asc",
  });
  const loadVehicles = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await getVehicles();
      setVehicles((response?.data?.vehicles || []).map(normalizeVehicle));
    } catch (error) {
      setVehicles([]);
      setLoadError(
        error?.message || "Unable to load vehicles from the database.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    let active = true;
    getVehicles()
      .then((response) => {
        if (active)
          setVehicles((response?.data?.vehicles || []).map(normalizeVehicle));
      })
      .catch((error) => {
        if (!active) return;
        setVehicles([]);
        setLoadError(
          error?.message || "Unable to load vehicles from the database.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  const handleRefresh = () => loadVehicles();
  const types = useMemo(
    () => [...new Set(vehicles.map((vehicle) => vehicle.type).filter(Boolean))],
    [vehicles],
  );
  const fuels = useMemo(
    () => [
      ...new Set(
        vehicles
          .map((vehicle) => vehicle.fuel)
          .filter((fuel) => fuel && fuel !== "—"),
      ),
    ],
    [vehicles],
  );
  const handleSort = (field) => {
    setSortConfig((prev) =>
      prev.field === field
        ? {
            field,
            dir: prev.dir === "asc" ? "desc" : "asc",
          }
        : {
            field,
            dir: "asc",
          },
    );
  };
  const clearFilters = () => {
    setQuery("");
    setTypeFilter("All");
    setFuelFilter("All");
    setStatusFilter("All");
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
  const summary = useMemo(() => {
    const available = vehicles.filter((v) => v.status === "Available").length;
    const unavailable = vehicles.filter(
      (v) => v.status === "Unavailable",
    ).length;
    const maintenance = vehicles.filter(
      (v) => v.status === "Maintenance",
    ).length;
    return {
      total: vehicles.length,
      available,
      unavailable,
      maintenance,
    };
  }, [vehicles]);
  return (
    <DashboardLayout>
      <div className="bg-slate-50 min-h-screen p-6">
        <Breadcrumb />

        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Total Vehicles
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Full fleet inventory and specifications
            </p>
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
                <FiChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${exportOpen ? "rotate-180" : ""}`}
                />
              </button>
              {exportOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl border border-slate-100 bg-white shadow-lg overflow-hidden z-10">
                  <button
                    onClick={() => setExportOpen(false)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <FiFileText className="text-rose-500" /> Export as PDF
                  </button>
                  <button
                    onClick={() => setExportOpen(false)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 border-t border-slate-100"
                  >
                    <FiFileText className="text-emerald-600" /> Export as Excel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={<FiTruck />}
            tone="indigo"
            label="Total Vehicles"
            value={summary.total}
            sub="Entire registered fleet"
          />
          <SummaryCard
            icon={<FiCheckSquare />}
            tone="emerald"
            label="Available"
            value={summary.available}
            sub="Ready for allocation"
          />
          <SummaryCard
            icon={<FiSlash />}
            tone="red"
            label="Unavailable"
            value={summary.unavailable}
            sub="Currently in use / offline"
          />
          <SummaryCard
            icon={<FiTool />}
            tone="amber"
            label="Maintenance"
            value={summary.maintenance}
            sub="Under service"
          />
        </div>

        {/* Table card */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          {loadError && (
            <div className="m-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loadError}
            </div>
          )}
          {/* Toolbar */}
          <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Fleet Inventory
              </h2>
              <p className="text-slate-400 text-sm">
                {filtered.length} matching vehicles
              </p>
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
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                  >
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
                  {(typeFilter !== "All" ||
                    fuelFilter !== "All" ||
                    statusFilter !== "All") && (
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  )}
                </button>

                {filtersOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-100 bg-white shadow-lg p-4 z-10 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Vehicle Type
                      </label>
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
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Fuel Type
                      </label>
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
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Status
                      </label>
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

                    <button
                      onClick={clearFilters}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="max-h-[65vh] overflow-auto">
            <table className="w-full min-w-[1120px]">
              <thead className="sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
                <tr>
                  <SortHeader
                    label="Vehicle Name"
                    field="model"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="Register Number"
                    field="registerNo"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="Fuel Type"
                    field="fuel"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="Fuel Capacity"
                    field="fuelCapacity"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="Fuel Level"
                    field="fuelLevel"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="Seat Capacity"
                    field="seatCapacity"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label={
                      language === "si"
                        ? "ආදායම් බලපත්‍රයේ වලංගු කාලය අවසන් වන දිනය"
                        : "Licence Expire Date"
                    }
                    field="licenseExpiry"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({
                    length: 6,
                  }).map((_, i) => <RowSkeleton key={i} />)
                ) : filtered.length === 0 ? (
                  <EmptyState onClear={clearFilters} />
                ) : (
                  filtered.map((v) => {
                    const daysLeft = v.licenseExpiry
                      ? daysUntil(v.licenseExpiry)
                      : null;
                    const expiringSoon = daysLeft <= 30 && daysLeft >= 0;
                    const expired = daysLeft < 0;
                    return (
                      <tr
                        key={v.id}
                        onClick={() =>
                          navigate(
                            `/deputy/vehicles/${encodeURIComponent(v.id)}`,
                          )
                        }
                        className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <VehicleThumb image={v.image} model={v.model} />
                            <div>
                              <div className="font-medium text-slate-800 whitespace-nowrap">
                                {v.model}
                              </div>
                              <div className="text-xs text-slate-400">
                                {v.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-blue-600 font-medium whitespace-nowrap">
                          {v.registerNo}
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 text-slate-600 whitespace-nowrap">
                            <FiDroplet className="h-3.5 w-3.5 text-cyan-500" />{" "}
                            {v.fuel}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 text-slate-600 whitespace-nowrap">
                            <FiDroplet className="h-3.5 w-3.5 text-slate-400" />{" "}
                            {v.fuelCapacity === "—"
                              ? v.fuelCapacity
                              : `${v.fuelCapacity} L`}
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
                                  style={{
                                    width: `${Math.min(100, Math.max(0, Number(v.fuelLevel)))}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs font-medium text-slate-600">
                                {v.fuelLevel}%
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-slate-600 whitespace-nowrap">
                          {v.seatCapacity === "—"
                            ? v.seatCapacity
                            : `${v.seatCapacity} seats`}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <FiCalendar className="h-3.5 w-3.5 text-slate-400" />
                            <span
                              className={
                                expired
                                  ? "text-red-600 font-medium"
                                  : expiringSoon
                                    ? "text-amber-600 font-medium"
                                    : "text-slate-600"
                              }
                            >
                              {formatDate(v.licenseExpiry)}
                            </span>
                            {(expiringSoon || expired) && (
                              <FiAlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${STATUS_STYLES[v.status]}`}
                          >
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

          {!loading && filtered.length > 0 && (
            <div className="border-t border-slate-100 p-4">
              <p className="text-sm text-slate-400">
                Showing all {filtered.length} matching vehicle
                {filtered.length === 1 ? "" : "s"}. Scroll the inventory to view
                the complete list.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
