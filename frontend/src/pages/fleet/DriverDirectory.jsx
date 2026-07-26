import { useEffect, useMemo, useState } from "react";
import {
  FiEdit2,
  FiPlus,
  FiSave,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { createDriver, deleteDriver, getDrivers } from "../../api/authApi";
import { normalizeDriver, toDriverPayload } from "../../utils/driverMapper";
const DUTY_STATUSES = ["Active", "Inactive"];
const EMPTY_DRIVER = {
  id: "",
  fullName: "",
  dateOfBirth: "",
  nic: "",
  address: "",
  contactNumber: "",
  bloodGroup: "",
  licenceNumber: "",
  licenceType: "",
  licenceRenewalDate: "",
  vehicle: "",
  registration: "",
  status: "Available",
  dutyStatus: "Active",
};
function StatusPill({ status }) {
  const styles = {
    Available: "bg-emerald-50 text-emerald-700",
    "On Trip": "bg-blue-50 text-blue-700",
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
function DriverForm({ driver, existingIds, onCancel, onSave }) {
  const [form, setForm] = useState(driver);
  const [error, setError] = useState("");
  const editing = existingIds.includes(driver.id);
  const field =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50";
  const change = (event) => {
    setError("");
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };
  const submit = (event) => {
    event.preventDefault();
    const normalizedId = form.id.trim();
    if (!editing && existingIds.includes(normalizedId)) {
      setError("This Driver ID already exists.");
      return;
    }
    onSave({
      ...form,
      id: normalizedId,
    });
  };
  const fields = [
    ["id", "Driver ID", "text"],
    ["fullName", "Full Name", "text"],
    ["dateOfBirth", "Date of Birth", "date"],
    ["nic", "NIC", "text"],
    ["address", "Address", "text"],
    ["contactNumber", "Contact Number", "tel"],
    ["bloodGroup", "Blood Group", "text"],
    ["licenceNumber", "Licence Number", "text"],
    ["licenceType", "Licence Type", "text"],
    ["licenceRenewalDate", "Licence Renewal Date", "date"],
    ["registration", "Allocated Vehicle Registration", "text"],
  ];
  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {editing ? "Edit Driver" : "Register Driver"}
          </h2>
          <p className="text-sm text-slate-500">
            All fields are managed by the subject officer.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-slate-700"
          aria-label="Close form"
        >
          <FiX />
        </button>
      </div>
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {fields.map(([name, label, type]) => (
          <label key={name} className="text-sm font-semibold text-slate-700">
            {label}
            <input
              name={name}
              type={type}
              value={form[name]}
              onChange={change}
              disabled={editing && name === "id"}
              required
              className={`${field} disabled:bg-slate-100 disabled:text-slate-500`}
            />
          </label>
        ))}
        <label className="text-sm font-semibold text-slate-700">
          Status
          <select
            name="dutyStatus"
            value={form.dutyStatus}
            onChange={change}
            className={field}
          >
            {DUTY_STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600"
        >
          Cancel
        </button>
        <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
          <FiSave /> Save Driver
        </button>
      </div>
    </form>
  );
}
export default function DriverDirectory() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [editingDriver, setEditingDriver] = useState(null);
  const [deletingId, setDeletingId] = useState("");
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
  const saveDriver = async (driver) => {
    setLoadError("");
    try {
      const response = await createDriver(toDriverPayload(driver));
      const saved = normalizeDriver(response?.data?.driver);
      setDrivers((current) => [saved, ...current]);
      setEditingDriver(null);
    } catch (error) {
      const validationMessage = error?.errors
        ? Object.values(error.errors).flat()[0]
        : null;
      setLoadError(
        validationMessage || error?.message || "Unable to save driver details.",
      );
    }
  };
  const removeDriver = async (driver) => {
    if (
      !window.confirm(
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
              Register drivers and maintain their identity, licence, allocation,
              and status details.
            </p>
          </div>
          <button
            onClick={() =>
              setEditingDriver({
                ...EMPTY_DRIVER,
              })
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <FiPlus /> Add Driver
          </button>
        </header>

        {editingDriver && (
          <DriverForm
            driver={editingDriver}
            existingIds={drivers.map((driver) => driver.id)}
            onCancel={() => setEditingDriver(null)}
            onSave={saveDriver}
          />
        )}

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
            <table className="w-full min-w-[1250px]">
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
    </DashboardLayout>
  );
}
