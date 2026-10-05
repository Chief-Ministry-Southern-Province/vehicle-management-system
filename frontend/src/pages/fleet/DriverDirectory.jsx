import { confirmLocalized } from "../../i18n/runtime.js";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiEdit2,
  FiEye,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { deleteDriver, getDriver, getDrivers } from "../../api/authApi";
import { normalizeDriver } from "../../utils/driverMapper";
function StatusPill({ status }) {
  const styles = {
    Available: "bg-emerald-50 text-emerald-700",
    "Scheduled Trip": "bg-indigo-50 text-indigo-700",
    "Ongoing Trip": "bg-blue-50 text-blue-700",
    Unavailable: "bg-red-50 text-red-700",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function DriverProfile({ driver, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  const value = (item) => item || "Not recorded";
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
      <article className="max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
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
            <ProfileAvatar driver={driver} />
            <div>
              <p className="text-sm font-semibold text-blue-300">{driver.id}</p>
              <h2 id="driver-profile-title" className="mt-1 text-2xl font-bold">
                {driver.fullName}
              </h2>
              <p className="mt-1 text-sm text-slate-300">Profile</p>
            </div>
          </div>
        </header>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill status={driver.status} />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Duty: {value(driver.dutyStatus)}
            </span>
          </div>

          <ProfileSection title="Personal Information">
            <ProfileItem label="Date of Birth" value={value(driver.dateOfBirth)} />
            <ProfileItem label="NIC" value={value(driver.nic)} />
            <ProfileItem label="Contact Number" value={value(driver.contactNumber)} />
            <ProfileItem label="Blood Group" value={value(driver.bloodGroup)} />
            <ProfileItem label="Email" value={value(driver.email)} />
            <ProfileItem label="Department" value={value(driver.department)} />
            <ProfileItem label="Address" value={value(driver.address)} wide />
          </ProfileSection>

          <ProfileSection title="Licence & Vehicle Allocation">
            <ProfileItem label="Licence Number" value={value(driver.licenceNumber)} />
            <ProfileItem label="Licence Type" value={value(driver.licenceType)} />
            <ProfileItem label="Licence Expiry Date" value={value(driver.licenceRenewalDate)} />
            <ProfileItem label="Allocated Vehicle" value={value(driver.vehicle)} />
            <ProfileItem label="Vehicle Registration" value={value(driver.registration)} />
          </ProfileSection>
        </div>
      </article>
    </dialog>
  );
}

function ProfileAvatar({ driver }) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = driver.fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-blue-600 text-2xl font-black text-white ring-4 ring-white/10">
      {driver.profilePhotoUrl && !imageFailed ? (
        <img
          src={driver.profilePhotoUrl}
          alt={`${driver.fullName} profile`}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        initials
      )}
    </div>
  );
}

function ProfileSection({ title, children }) {
  return (
    <section>
      <h3 className="border-b border-slate-100 pb-3 text-sm font-bold uppercase tracking-wide text-slate-900">
        {title}
      </h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function ProfileItem({ label, value, wide = false }) {
  return (
    <div className={`rounded-2xl bg-slate-50 p-4 ${wide ? "sm:col-span-2" : ""}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

export default function DriverDirectory() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [profileDriver, setProfileDriver] = useState(null);
  const [profileLoadingId, setProfileLoadingId] = useState("");
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
    const search = query.trim().toLowerCase();
    if (!search) return drivers;
    return drivers.filter((driver) =>
      [
        driver.id,
        driver.fullName,
        driver.nic,
        driver.licenceNumber,
        driver.vehicle,
        driver.status,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(search),
      ),
    );
  }, [drivers, query]);
  const removeDriver = async (driver) => {
    if (
      !confirmLocalized(
        `Delete ${driver.fullName} (${driver.id})? This action cannot be undone.`,
      )
    )
      return;
    setDeletingId(driver.id);
    setLoadError("");
    try {
      await deleteDriver(driver.id);
      setDrivers((current) => current.filter((item) => item.id !== driver.id));
    } catch (error) {
      setLoadError(error?.message || "Unable to delete the driver.");
    } finally {
      setDeletingId("");
    }
  };
  const showProfile = async (driver) => {
    setProfileLoadingId(driver.id);
    setLoadError("");
    try {
      const response = await getDriver(driver.id);
      setProfileDriver(normalizeDriver(response?.data?.driver));
    } catch (error) {
      setLoadError(error?.message || "Unable to load the driver profile.");
    } finally {
      setProfileLoadingId("");
    }
  };
  return (
    <DashboardLayout>
      <main className="min-h-screen space-y-6 bg-slate-50 p-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Fleet Management
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Driver Directory
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              View and maintain driver identity, licence, allocation, and status
              details. New driver accounts are created through User Registration.
            </p>
          </div>
        </header>

        {loadError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {loadError}
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Registered Drivers</h2>
              <p className="text-sm text-slate-400">
                {filteredDrivers.length} driver records
              </p>
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search drivers..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-400 sm:w-72"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1360px]">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  {[
                    "Driver ID",
                    "Driver Name",
                    "NIC",
                    "Contact Number",
                    "Licence Type",
                    "Licence Expire Date",
                    "Allocated Vehicle",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th key={heading} className="px-4 py-4">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  filteredDrivers.map((driver) => (
                    <tr
                      key={driver.id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-4 font-semibold text-blue-600">
                        {driver.id}
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-900">
                        {driver.fullName}
                      </td>
                      <td className="px-4 py-4 text-slate-600">{driver.nic}</td>
                      <td className="px-4 py-4 text-slate-600">
                        {driver.contactNumber}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {driver.licenceType}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {driver.licenceRenewalDate}
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-800">
                        {driver.vehicle}
                      </td>
                      <td className="px-4 py-4">
                        <StatusPill status={driver.status} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={Boolean(profileLoadingId)}
                            onClick={() => showProfile(driver)}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                          >
                            <FiEye /> {profileLoadingId === driver.id ? "Loadingâ€¦" : "Profile"}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/driverdirectory/${encodeURIComponent(driver.id)}`,
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                          >
                            <FiEdit2 /> Update
                          </button>
                          <button
                            type="button"
                            disabled={deletingId === driver.id}
                            onClick={() => removeDriver(driver)}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                          >
                            <FiTrash2 />{" "}
                            {deletingId === driver.id ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {loading && (
            <p className="p-12 text-center text-sm text-slate-500">
              Loading drivers from the database…
            </p>
          )}
          {!loading && filteredDrivers.length === 0 && (
            <p className="p-12 text-center text-sm text-slate-500">
              No drivers found.
            </p>
          )}
        </section>
      </main>
      {profileDriver && (
        <DriverProfile
          driver={profileDriver}
          onClose={() => setProfileDriver(null)}
        />
      )}
    </DashboardLayout>
  );
}
