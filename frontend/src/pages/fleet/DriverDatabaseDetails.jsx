import { useEffect, useState } from "react";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getDriver, updateDriver } from "../../api/authApi";
import { normalizeDriver, toDriverPayload } from "../../utils/driverMapper";
const DUTY_STATUSES = ["Active", "Inactive"];
const BLOOD_GROUPS = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
export default function DriverDatabaseDetails() {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    getDriver(driverId)
      .then((response) => {
        if (active) setDriver(normalizeDriver(response?.data?.driver));
      })
      .catch((loadError) => {
        if (active)
          setError(loadError?.message || "Unable to load driver details.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [driverId]);
  const change = (event) => {
    setMessage("");
    setError("");
    setDriver((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await updateDriver(driverId, toDriverPayload(driver));
      setDriver(normalizeDriver(response?.data?.driver));
      setMessage(response?.message || "Driver details updated successfully.");
    } catch (saveError) {
      const validationMessage = saveError?.errors
        ? Object.values(saveError.errors).flat()[0]
        : null;
      setError(
        validationMessage ||
          saveError?.message ||
          "Unable to update driver details.",
      );
    } finally {
      setSaving(false);
    }
  };
  const field =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50";
  const fields = [
    ["fullName", "Full Name", "text"],
    ["dateOfBirth", "Date of Birth", "date"],
    ["nic", "NIC", "text"],
    ["address", "Address", "text"],
    ["contactNumber", "Contact Number", "tel"],
    ["licenceNumber", "Licence Number", "text"],
    ["licenceType", "Licence Type", "text"],
    ["licenceRenewalDate", "Licence Expire Date", "date"],
    ["registration", "Allocated Vehicle Registration", "text"],
  ];
  if (loading)
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6 text-slate-500">
          Loading driver details from the database…
        </div>
      </DashboardLayout>
    );
  if (!driver)
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error || "Driver not found."}
          </p>
          <button
            onClick={() => navigate("/driverdirectory")}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-white"
          >
            Back to Driver Directory
          </button>
        </div>
      </DashboardLayout>
    );
  return (
    <DashboardLayout>
      <form onSubmit={save} className="min-h-screen bg-slate-50 p-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/driverdirectory")}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
            >
              <FiArrowLeft /> Driver Directory
            </button>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Update Driver Details
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Driver ID:{" "}
              <span className="font-semibold text-blue-600">{driver.id}</span>
            </p>
          </div>
          <button
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <FiSave /> {saving ? "Saving…" : "Save Changes"}
          </button>
        </header>
        {error && (
          <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}
        {message && (
          <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
          </p>
        )}
        <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Full Driver Record
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <label className="text-sm font-semibold text-slate-700">
              Driver ID
              <input
                value={driver.id}
                disabled
                className={`${field} bg-slate-100 text-slate-500`}
              />
            </label>
            {fields.map(([name, label, type]) => (
              <label
                key={name}
                className="text-sm font-semibold text-slate-700"
              >
                {label}
                <input
                  name={name}
                  type={type}
                  value={driver[name] || ""}
                  onChange={change}
                  required={name !== "registration"}
                  className={field}
                />
              </label>
            ))}
            <label className="text-sm font-semibold text-slate-700">
              Blood Group
              <select
                name="bloodGroup"
                value={driver.bloodGroup || ""}
                onChange={change}
                className={field}
              >
                {BLOOD_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group || "Not specified"}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Status
              <select
                name="dutyStatus"
                value={driver.dutyStatus}
                onChange={change}
                className={field}
              >
                {DUTY_STATUSES.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
          </div>
        </section>
      </form>
    </DashboardLayout>
  );
}
