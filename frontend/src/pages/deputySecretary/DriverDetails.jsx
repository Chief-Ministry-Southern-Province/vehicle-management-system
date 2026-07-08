import DashboardLayout from "../../layouts/DashboardLayout";

import { useMemo, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiDownload,
  FiDroplet,
  FiFilter,
  FiHeart,
  FiPhone,
  FiSearch,
  FiShield,
  FiStar,
  FiTruck,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";

const DRIVERS = [
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
    licenceExpiry: "2027-08-11",
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
    licenceExpiry: "2026-12-22",
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
    licenceExpiry: "2028-03-05",
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
    licenceExpiry: "2027-01-18",
    designation: "Standby Driver",
    department: "General Fleet Pool",
    experience: "6 years",
    status: "Standby",
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
    licenceExpiry: "2026-09-14",
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
    licenceExpiry: "2029-04-20",
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
  "On Trip": "bg-blue-50 text-blue-700 ring-blue-100",
  Standby: "bg-amber-50 text-amber-700 ring-amber-100",
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
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
        STATUS_STYLES[status] || STATUS_STYLES.Available
      }`}
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

function DriverCard({ driver }) {
  const expiryDays = daysUntil(driver.licenceExpiry);
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
            <p className="mt-1 text-sm text-slate-500">{driver.designation}</p>
            <p className="mt-1 text-xs font-semibold text-blue-600">
              {driver.id}
            </p>
          </div>
        </div>
        <StatusPill status={driver.status} />
      </div>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <DetailLine icon={<FiShield />} label="NIC" value={driver.nic} />
        <DetailLine icon={<FiDroplet />} label="Blood" value={driver.bloodGroup} />
        <DetailLine icon={<FiPhone />} label="Phone" value={driver.contactNumber} />
        <DetailLine icon={<FiCalendar />} label="DOB" value={formatDate(driver.dateOfBirth)} />
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
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              expiringSoon
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {formatDate(driver.licenceExpiry)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span className="inline-flex items-center gap-2">
          <FiTruck className="text-blue-500" />
          {driver.vehicle}
        </span>
        <span className="inline-flex items-center gap-2">
          <FiStar className="text-amber-500" />
          {driver.rating}
        </span>
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
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredDrivers = useMemo(() => {
    const q = query.trim().toLowerCase();

    return DRIVERS.filter((driver) => {
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
  }, [query, statusFilter]);

  const summary = useMemo(
    () => ({
      total: DRIVERS.length,
      available: DRIVERS.filter((driver) => driver.status === "Available")
        .length,
      verified: DRIVERS.filter((driver) => driver.clearance === "Verified")
        .length,
      expiring: DRIVERS.filter((driver) => daysUntil(driver.licenceExpiry) <= 180)
        .length,
    }),
    []
  );

  const statuses = ["All", ...new Set(DRIVERS.map((driver) => driver.status))];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-900 shadow-sm">
          <div className="relative px-6 py-8 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.45),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.28),transparent_30%)]" />
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100 ring-1 ring-white/15">
                  <FiUsers />
                  Government Fleet Driver Directory
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                  All Drivers Details
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                  Complete driver records with identity details, contact
                  information, licence status, duty readiness, assigned vehicle,
                  and clearance summary.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15">
                  <FiDownload />
                  Export List
                </button>
                <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-blue-50">
                  <FiUser />
                  Add Driver
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
            label="Verified"
            value={summary.verified}
            sub="Security clearance complete"
            tone="amber"
          />
          <SummaryCard
            icon={<FiCalendar />}
            label="Renewal Watch"
            value={summary.expiring}
            sub="Licences expiring within 180 days"
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
                Showing {filteredDrivers.length} of {DRIVERS.length} drivers
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

          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {filteredDrivers.map((driver) => (
              <DriverCard key={driver.id} driver={driver} />
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="text-xl font-bold text-slate-900">
              Full Driver Records
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Dense table view for official record checking and comparison.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1500px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4">Driver</th>
                  <th className="px-5 py-4">Date of Birth</th>
                  <th className="px-5 py-4">NIC</th>
                  <th className="px-5 py-4">Address</th>
                  <th className="px-5 py-4">Contact</th>
                  <th className="px-5 py-4">Blood</th>
                  <th className="px-5 py-4">Licence</th>
                  <th className="px-5 py-4">Licence Type</th>
                  <th className="px-5 py-4">Expiry</th>
                  <th className="px-5 py-4">Vehicle</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver) => (
                  <tr
                    key={driver.id}
                    className="border-t border-slate-100 transition hover:bg-blue-50/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-black text-white">
                          {getInitials(driver.fullName)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {driver.fullName}
                          </p>
                          <p className="text-xs text-blue-600">{driver.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(driver.dateOfBirth)}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                      {driver.nic}
                    </td>
                    <td className="max-w-[260px] px-5 py-4 text-sm text-slate-600">
                      {driver.address}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {driver.contactNumber}
                      </p>
                      <p className="text-xs text-slate-400">{driver.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">
                        <FiHeart />
                        {driver.bloodGroup}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                      {driver.licenceNumber}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {driver.licenceType}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(driver.licenceExpiry)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {driver.vehicle}
                      </p>
                      <p className="text-xs text-slate-400">
                        {driver.registration}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill status={driver.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDrivers.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                <FiUsers className="h-7 w-7" />
              </div>
              <p className="mt-4 font-semibold text-slate-800">
                No drivers found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try changing the search text or status filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
