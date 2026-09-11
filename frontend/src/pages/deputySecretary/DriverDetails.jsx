import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiDroplet,
  FiDownload,
  FiEye,
  FiFilter,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSearch,
  FiShield,
  FiTruck,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { getDrivers } from "../../api/authApi";
import { useLanguage } from "../../context/useLanguage";
import { formatLocalDate, LOCAL_TIME_ZONE } from "../../utils/dateTime";
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
function DriverAvatar({ driver, className, textClassName = "" }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPhoto = driver.profilePhotoUrl && !imageFailed;

  return (
    <div className={`relative overflow-hidden bg-slate-900 text-white ${className}`}>
      {showPhoto ? (
        <img
          src={driver.profilePhotoUrl}
          alt={`${driver.fullName} profile`}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className={`flex h-full w-full items-center justify-center font-black ${textClassName}`}>
          {getInitials(driver.fullName)}
        </span>
      )}
    </div>
  );
}
const formatDate = (date) => formatLocalDate(date, "—");
function LicenceExpiry({ date }) {
  const expiry = date ? new Date(date) : null;
  const hasDate = expiry && !Number.isNaN(expiry.getTime());
  const dateKey = (value) => {
    const parts = new Intl.DateTimeFormat("en-LK", {
      timeZone: LOCAL_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
    }).formatToParts(value);
    return ["year", "month", "day"].map((type) => parts.find((part) => part.type === type).value).join("-");
  };
  const expired = hasDate && dateKey(expiry) < dateKey(new Date());
  const tone = !hasDate
    ? "bg-slate-100 text-slate-500 ring-slate-200"
    : expired
      ? "bg-red-50 text-red-700 ring-red-200"
      : "bg-green-50 text-green-700 ring-green-200";

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${tone}`}>{formatDate(date)}</span>;
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
function DriverProfile({ driver, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto max-h-[94vh] w-[calc(100%_-_2rem)] max-w-3xl overflow-visible rounded-3xl bg-transparent p-0 backdrop:bg-slate-950/55 backdrop:backdrop-blur-sm"
      aria-labelledby="driver-profile-title"
      onCancel={onClose}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <header className="relative bg-slate-900 p-6 text-white sm:p-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
            aria-label="Close driver profile"
          >
            <FiX className="text-xl" />
          </button>
          <div className="flex items-center gap-5 pr-10">
            <DriverAvatar
              driver={driver}
              className="h-20 w-20 shrink-0 rounded-3xl ring-4 ring-white/10"
              textClassName="text-2xl"
            />
            <div>
              <p className="text-sm font-semibold text-blue-300">{driver.id}</p>
              <h2 id="driver-profile-title" className="mt-1 text-2xl font-bold">
                {driver.fullName}
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                {driver.designation || "Government Driver"}
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill status={driver.status} />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Duty: {driver.dutyStatus || "Not specified"}
            </span>
          </div>

          <ProfileSection title="Personal Information">
            <ProfileItem icon={<FiShield />} label="NIC" value={driver.nic} />
            <ProfileItem icon={<FiCalendar />} label="Date of Birth" value={formatDate(driver.dateOfBirth)} />
            <ProfileItem icon={<FiDroplet />} label="Blood Group" value={driver.bloodGroup || "Not specified"} />
            <ProfileItem icon={<FiPhone />} label="Contact Number" value={driver.contactNumber} />
            <ProfileItem icon={<FiMail />} label="Email" value={driver.email || "Not specified"} />
            <ProfileItem icon={<FiUsers />} label="Department" value={driver.department || "Not specified"} />
            <ProfileItem icon={<FiMapPin />} label="Address" value={driver.address || "Not specified"} wide />
          </ProfileSection>

          <ProfileSection title="Licence & Vehicle Allocation">
            <ProfileItem icon={<FiShield />} label="Licence Number" value={driver.licenceNumber} />
            <ProfileItem icon={<FiShield />} label="Licence Type" value={driver.licenceType} />
            <ProfileItem icon={<FiCalendar />} label="Licence Expiry" value={<LicenceExpiry date={driver.licenceRenewalDate} />} />
            <ProfileItem icon={<FiTruck />} label="Allocated Vehicle" value={driver.vehicle || "Not allocated"} />
            <ProfileItem icon={<FiTruck />} label="Registration" value={driver.registration || "Not allocated"} />
          </ProfileSection>
        </div>
      </article>
    </dialog>
  );
}

function ProfileSection({ title, children }) {
  return (
    <section>
      <h3 className="border-b border-slate-100 pb-3 text-sm font-bold uppercase tracking-wide text-slate-900">{title}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function ProfileItem({ icon, label, value, wide = false }) {
  return (
    <div className={`flex gap-3 rounded-2xl bg-slate-50 p-4 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="mt-0.5 shrink-0 text-blue-600">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
export default function DriverDetails() {
  const { t } = useLanguage();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [profileDriver, setProfileDriver] = useState(null);
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
  const exportDrivers = () => { try { generateDriverDirectoryPdf(filteredDrivers); } catch (exportError) { window.alert(exportError.message); } };
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

          {!loading && !loadError && drivers.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button type="button" onClick={exportDrivers} disabled={filteredDrivers.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                <FiDownload /> {t("driverTable.exportAll")} ({filteredDrivers.length})
              </button>
            </div>
          )}

          {loading && (
            <p className="py-12 text-center text-sm text-slate-500">
              Loading drivers from the database…
            </p>
          )}
          {!loading && !loadError && (
            <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[720px] text-left text-sm">
                <caption className="sr-only">{t("driverTable.directory")}</caption>
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    {["photo", "name", "expiry", "status", "details"].map((key) => (
                      <th key={key} scope="col" className="px-4 py-3">{t(`driverTable.${key}`)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDrivers.map((driver) => (
                    <tr key={driver.id} className="transition hover:bg-blue-50/40">
                      <td className="px-4 py-3"><DriverAvatar driver={driver} className="h-11 w-11 rounded-full" textClassName="text-sm" /></td>
                      <th scope="row" className="px-4 py-3 font-semibold text-slate-900">{driver.fullName}<span className="mt-1 block text-xs font-medium text-slate-500">{driver.id}</span></th>
                      <td className="whitespace-nowrap px-4 py-3"><LicenceExpiry date={driver.licenceRenewalDate} /></td>
                      <td className="whitespace-nowrap px-4 py-3"><StatusPill status={driver.status} /></td>
                      <td className="px-4 py-3"><button type="button" onClick={() => setProfileDriver(driver)} className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-blue-50 px-3.5 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-blue-600"><FiEye />{t("driverTable.details")}<span className="sr-only">: {driver.fullName}</span></button></td>
                    </tr>
                  ))}
                  {filteredDrivers.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-500">{t("driverTable.empty")}</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {profileDriver && (
        <DriverProfile driver={profileDriver} onClose={() => setProfileDriver(null)} />
      )}
    </DashboardLayout>
  );
}
