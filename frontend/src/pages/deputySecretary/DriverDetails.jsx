import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiDroplet,
  FiDownload,
  FiFilter,
  FiPhone,
  FiSearch,
  FiShield,
  FiStar,
  FiTruck,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { getDrivers } from "../../api/authApi";
import { normalizeDriver } from "../../utils/driverMapper";
import { generateDriverDirectoryPdf } from "../../utils/driverDirectoryPdf";

// Shared with ApprovalWorkspace; this non-component export is intentional.
// eslint-disable-next-line react-refresh/only-export-components
export const DRIVERS = [
  {
    id: "DRV-0148",
    fullName: "Robert Wilson",
    dateOfBirth: "1983-04-18",
    nic: "831091245V",
    address: "No. 42, Independence Avenue, Colombo 07",
    contactNumber: "+94 77 245 8910",
    email: "robert.wilson@govfleet.lk",
    bloodGroup: "O+",
    licenceNumber: "B2145789",
    licenceType: "B, B1, D",
    licenceRenewalDate: "2027-08-11",
    designation: "Senior Executive Driver",
    department: "Executive Transport Unit",
    experience: "12 years",
    status: "Available",
    clearance: "Verified",
    rating: 4.9,
    trips: 1248,
    vehicle: "Toyota Land Cruiser",
    registration: "WP-CAB-9021",
  },
  {
    id: "DRV-0152",
    fullName: "David Chen",
    dateOfBirth: "1988-11-02",
    nic: "883071492V",
    address: "No. 18, Lake Drive, Rajagiriya",
    contactNumber: "+94 76 331 4455",
    email: "david.chen@govfleet.lk",
    bloodGroup: "A+",
    licenceNumber: "B2097741",
    licenceType: "B, C1",
    licenceRenewalDate: "2026-12-22",
    designation: "Protocol Driver",
    department: "VIP Movement Desk",
    experience: "8 years",
    status: "On Trip",
    clearance: "Verified",
    rating: 4.7,
    trips: 884,
    vehicle: "Toyota Hiace",
    registration: "WP-CAB-4521",
  },
  {
    id: "DRV-0161",
    fullName: "Maria Garcia",
    dateOfBirth: "1985-07-27",
    nic: "856092118V",
    address: "No. 66, Temple Road, Nugegoda",
    contactNumber: "+94 71 642 9021",
    email: "maria.garcia@govfleet.lk",
    bloodGroup: "B+",
    licenceNumber: "B1985442",
    licenceType: "B, B1, D",
    licenceRenewalDate: "2028-03-05",
    designation: "Executive Driver",
    department: "Ministerial Assignments",
    experience: "10 years",
    status: "Available",
    clearance: "Verified",
    rating: 4.8,
    trips: 1015,
    vehicle: "Honda Vezel",
    registration: "WP-CAC-2298",
  },
  {
    id: "DRV-0174",
    fullName: "Samuel Okoro",
    dateOfBirth: "1990-01-14",
    nic: "900141246V",
    address: "No. 12, Station Road, Dehiwala",
    contactNumber: "+94 75 819 3340",
    email: "samuel.okoro@govfleet.lk",
    bloodGroup: "AB+",
    licenceNumber: "B2339021",
    licenceType: "B, C",
    licenceRenewalDate: "2027-01-18",
    designation: "Fleet Driver",
    department: "General Fleet Pool",
    experience: "6 years",
    status: "Unavailable",
    clearance: "Pending Review",
    rating: 4.5,
    trips: 512,
    vehicle: "Nissan Navara",
    registration: "WP-CAD-7788",
  },
  {
    id: "DRV-0186",
    fullName: "Anish Gupta",
    dateOfBirth: "1979-09-30",
    nic: "792741108V",
    address: "No. 7, Flower Road, Colombo 03",
    contactNumber: "+94 77 501 7288",
    email: "anish.gupta@govfleet.lk",
    bloodGroup: "O-",
    licenceNumber: "B1763550",
    licenceType: "B, B1, C, D",
    licenceRenewalDate: "2026-09-14",
    designation: "Heavy Vehicle Driver",
    department: "Logistics and Supplies",
    experience: "15 years",
    status: "Available",
    clearance: "Verified",
    rating: 4.9,
    trips: 1531,
    vehicle: "Mitsubishi Rosa",
    registration: "WP-NB-3345",
  },
  {
    id: "DRV-0193",
    fullName: "Linda Blair",
    dateOfBirth: "1992-05-11",
    nic: "925132210V",
    address: "No. 91, High Level Road, Maharagama",
    contactNumber: "+94 70 244 1180",
    email: "linda.blair@govfleet.lk",
    bloodGroup: "A-",
    licenceNumber: "B2459108",
    licenceType: "B, B1",
    licenceRenewalDate: "2029-04-20",
    designation: "Pool Driver",
    department: "Administrative Transport",
    experience: "5 years",
    status: "Unavailable",
    clearance: "Verified",
    rating: 4.6,
    trips: 398,
    vehicle: "Toyota Axio",
    registration: "WP-CAA-4471",
  },
];
const STATUS_STYLES = {
  Available: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  "Scheduled Trip": "bg-indigo-50 text-indigo-700 ring-indigo-100",
  "Ongoing Trip": "bg-blue-50 text-blue-700 ring-blue-100",
  Unavailable: "bg-rose-50 text-rose-700 ring-rose-100",
};
function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
function daysUntil(date) {
  const today = new Date();
  const target = new Date(date);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}
function StatusPill({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[status] || STATUS_STYLES.Available}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
function SummaryCard({ icon, label, value, sub, tone }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
  };
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-400">{sub}</p>
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${tones[tone]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
function DriverCard({ driver, selected, onToggle }) {
  const expiryDays = daysUntil(driver.licenceRenewalDate);
  const expiringSoon = expiryDays <= 180;
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-blue-100 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-lg font-black text-white">
            {getInitials(driver.fullName)}
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{driver.fullName}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {driver.designation || "Government Driver"}
            </p>
            <p className="mt-1 text-xs font-semibold text-blue-600">
              {driver.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3"><label className="inline-flex items-center gap-2 text-xs font-medium text-slate-500"><input type="checkbox" checked={selected} onChange={onToggle} aria-label={`Select ${driver.fullName}`} className="h-4 w-4 rounded border-slate-300 accent-blue-600" /> Select</label><StatusPill status={driver.status} /></div>
      </div>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <DetailLine icon={<FiShield />} label="NIC" value={driver.nic} />
        <DetailLine
          icon={<FiDroplet />}
          label="Blood"
          value={driver.bloodGroup}
        />
        <DetailLine
          icon={<FiPhone />}
          label="Phone"
          value={driver.contactNumber}
        />
        <DetailLine
          icon={<FiCalendar />}
          label="DOB"
          value={formatDate(driver.dateOfBirth)}
        />
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Licence
            </p>
            <p className="mt-1 font-bold text-slate-900">
              {driver.licenceNumber}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Type {driver.licenceType}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${expiringSoon ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}
          >
            {formatDate(driver.licenceRenewalDate)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span className="inline-flex items-center gap-2">
          <FiTruck className="text-blue-500" />
          {driver.vehicle}
        </span>
        {driver.rating != null && (
          <span className="inline-flex items-center gap-2">
            <FiStar className="text-amber-500" />
            {driver.rating}
          </span>
        )}
      </div>
    </article>
  );
}
function DetailLine({ icon, label, value }) {
  return (
    <div className="flex min-w-0 items-center gap-2 text-slate-600">
      <span className="shrink-0 text-slate-400">{icon}</span>
      <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className="min-w-0 truncate font-semibold text-slate-800">
        {value}
      </span>
    </div>
  );
}
export default function DriverDetails() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  useEffect(() => {
    let active = true;
    getDrivers()
      .then((response) => {
        if (active)
          setDrivers((response?.data?.drivers || []).map(normalizeDriver));
      })
      .catch((error) => {
        if (active)
          setLoadError(
            error?.message || "Unable to load drivers from the database.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  const filteredDrivers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return drivers.filter((driver) => {
      const matchesQuery =
        !q ||
        driver.id.toLowerCase().includes(q) ||
        driver.fullName.toLowerCase().includes(q) ||
        driver.nic.toLowerCase().includes(q) ||
        driver.licenceNumber.toLowerCase().includes(q) ||
        driver.contactNumber.toLowerCase().includes(q) ||
        driver.vehicle.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "All" || driver.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [drivers, query, statusFilter]);
  const summary = useMemo(
    () => ({
      total: drivers.length,
      available: drivers.filter((driver) => driver.status === "Available")
        .length,
      onTrip: drivers.filter((driver) =>
        ["Scheduled Trip", "Ongoing Trip"].includes(driver.status),
      ).length,
      unavailable: drivers.filter((driver) => driver.status === "Unavailable")
        .length,
    }),
    [drivers],
  );
  const statuses = ["All", ...new Set(drivers.map((driver) => driver.status))];
  const selectedDrivers = useMemo(() => drivers.filter((driver) => selectedIds.has(driver.id)), [drivers, selectedIds]);
  const allVisibleSelected = filteredDrivers.length > 0 && filteredDrivers.every((driver) => selectedIds.has(driver.id));
  const toggleDriver = (driverId) => setSelectedIds((current) => { const next = new Set(current); if (next.has(driverId)) next.delete(driverId); else next.add(driverId); return next; });
  const toggleVisible = () => setSelectedIds((current) => { const next = new Set(current); filteredDrivers.forEach((driver) => { if (allVisibleSelected) next.delete(driver.id); else next.add(driver.id); }); return next; });
  const exportSelected = () => { try { generateDriverDirectoryPdf(selectedDrivers); } catch (exportError) { window.alert(exportError.message); } };
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <header className="mb-6">
          <p className="text-sm font-semibold text-blue-600">
            Fleet Management
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Driver Details
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View driver identity, licence, contact, vehicle allocation, and
            availability information.
          </p>
        </header>

        {loadError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {loadError}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={<FiUsers />}
            label="Total Drivers"
            value={summary.total}
            sub="Registered in directory"
            tone="blue"
          />
          <SummaryCard
            icon={<FiCheckCircle />}
            label="Available"
            value={summary.available}
            sub="Ready for assignment"
            tone="emerald"
          />
          <SummaryCard
            icon={<FiShield />}
            label="Scheduled / Ongoing"
            value={summary.onTrip}
            sub="Currently assigned to trips"
            tone="amber"
          />
          <SummaryCard
            icon={<FiCalendar />}
            label="Unavailable"
            value={summary.unavailable}
            sub="Not available for assignment"
            tone="rose"
          />
        </div>

        <div className="mt-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Driver Directory
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Showing {filteredDrivers.length} of {drivers.length} drivers
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search name, ID, NIC, licence, phone..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50 sm:w-80"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 transition hover:text-slate-500"
                    aria-label="Clear search"
                  >
                    <FiX />
                  </button>
                )}
              </div>

              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-8 text-sm font-medium text-slate-600 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50 sm:w-44"
                >
                  {statuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {!loading && !loadError && drivers.length > 0 && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3"><label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" checked={allVisibleSelected} onChange={toggleVisible} className="h-4 w-4 rounded border-slate-300 accent-blue-600" /> Select all visible</label><div className="flex items-center gap-4"><span className="text-sm text-slate-600"><strong className="text-slate-900">{selectedDrivers.length}</strong> selected</span><button type="button" onClick={exportSelected} disabled={selectedDrivers.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"><FiDownload /> Export Selected PDF</button></div></div>}

          {loading && (
            <p className="py-12 text-center text-sm text-slate-500">
              Loading drivers from the database…
            </p>
          )}
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {filteredDrivers.map((driver) => (
              <DriverCard key={driver.id} driver={driver} selected={selectedIds.has(driver.id)} onToggle={() => toggleDriver(driver.id)} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
