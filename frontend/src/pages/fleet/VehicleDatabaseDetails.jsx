import { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiImage, FiPlus, FiSave, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getVehicle, updateVehicle as persistVehicle } from "../../api/authApi";
const SERVICE_TYPES = [
  "Change engine oil",
  "Replace diesel/petrol filter",
  "Replace oil filter",
  "Replace air filter",
];
const blank = {
  registration_number: "",
  vehicle_type: "",
  make: "",
  model: "",
  manufacturing_year: "",
  color: "",
  vin: "",
  engine_number: "",
  fuel_type: "",
  fuel_capacity: "",
  seat_capacity: "",
  technical_notes: "",
  registration_expiry: "",
  revenue_license_expiry: "",
  insurance_policy: "",
  insurance_provider: "",
  assignment: "",
  status: "unavailable",
  last_service_date: "",
  fuel_level: 0,
  service_category: "",
  service_details: [],
  repair_details: [],
  fuel_details: [],
};
export default function VehicleDatabaseDetails() {
  const { registration } = useParams();
  const navigate = useNavigate();
  const imageRef = useRef(null);
  const [vehicle, setVehicle] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  useEffect(() => {
    const load = async () => {
      try {
        const response = await getVehicle(registration);
        const record = response?.data?.vehicle || {};
        setVehicle({
          ...blank,
          ...record,
          service_details: Array.isArray(record.service_details)
            ? record.service_details
            : [],
          repair_details: Array.isArray(record.repair_details)
            ? record.repair_details
            : [],
          fuel_details: Array.isArray(record.fuel_details)
            ? record.fuel_details
            : [],
        });
      } catch (error) {
        toast.error(error?.message || "Vehicle not found.");
        setVehicle(false);
      }
    };
    load();
  }, [registration]);
  const change = (event) => {
    setSaveMessage("");
    setVehicle((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };
  const changeOperationalStatus = (event) => {
    const isActive = event.target.value === "active";
    setSaveMessage("");
    setVehicle((current) => ({
      ...current,
      status: isActive
        ? current.status === "maintenance"
          ? "available"
          : current.status
        : "maintenance",
    }));
  };
  const changeAvailability = (event) => {
    setSaveMessage("");
    setVehicle((current) => ({
      ...current,
      status: event.target.value,
    }));
  };
  const chooseImage = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaveMessage("");
    try {
      const data = new FormData();
      Object.entries(vehicle).forEach(([key, value]) => {
        if (
          ![
            "id",
            "created_at",
            "updated_at",
            "image_path",
            "image_url",
            "service_total_cost",
          ].includes(key) &&
          value !== null
        )
          data.append(
            key,
            ["service_details", "repair_details", "fuel_details"].includes(key)
              ? JSON.stringify(value)
              : value,
          );
      });
      if (image) data.append("image", image);
      const response = await persistVehicle(registration, data);
      const updatedVehicle = response?.data?.vehicle;
      if (!updatedVehicle)
        throw new Error(
          "The vehicle was updated, but no updated record was returned.",
        );
      setVehicle({
        ...blank,
        ...updatedVehicle,
        service_details: updatedVehicle.service_details || [],
        repair_details: updatedVehicle.repair_details || [],
        fuel_details: updatedVehicle.fuel_details || [],
      });
      setImage(null);
      setPreview(null);
      setSaveMessage("Vehicle details saved successfully.");
      toast.success(response?.message || "Vehicle updated.");
      navigate("/vehicledirectory", {
        state: {
          refreshedAt: Date.now(),
        },
      });
    } catch (error) {
      const errors = error?.errors;
      toast.error(
        errors
          ? Object.values(errors).flat()[0]
          : error?.message || "Unable to update vehicle.",
      );
    } finally {
      setSaving(false);
    }
  };
  const addService = () =>
    setVehicle((current) => ({
      ...current,
      service_details: [
        ...current.service_details,
        {
          service_date: "",
          service_type: "",
          custom: false,
          cost: "",
        },
      ],
    }));
  const updateService = (index, fieldName, value) =>
    setVehicle((current) => ({
      ...current,
      service_details: current.service_details.map((service, serviceIndex) =>
        serviceIndex === index
          ? {
              ...service,
              [fieldName]: value,
            }
          : service,
      ),
    }));
  const removeService = (index) =>
    setVehicle((current) => ({
      ...current,
      service_details: current.service_details.filter(
        (_, serviceIndex) => serviceIndex !== index,
      ),
    }));
  const addDetail = (key, detail) =>
    setVehicle((current) => ({ ...current, [key]: [...current[key], detail] }));
  const updateDetail = (key, index, fieldName, value) =>
    setVehicle((current) => ({
      ...current,
      [key]: current[key].map((detail, detailIndex) =>
        detailIndex === index ? { ...detail, [fieldName]: value } : detail,
      ),
    }));
  const removeDetail = (key, index) =>
    setVehicle((current) => ({
      ...current,
      [key]: current[key].filter((_, detailIndex) => detailIndex !== index),
    }));
  const field =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50";
  if (vehicle === null)
    return (
      <DashboardLayout>
        <div className="p-6 text-gray-500">Loading vehicle…</div>
      </DashboardLayout>
    );
  if (vehicle === false)
    return (
      <DashboardLayout>
        <div className="p-6">
          <button
            onClick={() => navigate("/vehicledirectory")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Back to directory
          </button>
        </div>
      </DashboardLayout>
    );
  const imageUrl = preview || vehicle.image_url;
  return (
    <DashboardLayout>
      <form onSubmit={save} className="min-h-screen space-y-6 bg-slate-50 p-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/vehicledirectory")}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600"
            >
              <FiArrowLeft />
              Vehicle Directory
            </button>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Update Vehicle Details
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              All changes are saved to the fleet database.
            </p>
          </div>
          <button
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            <FiSave />
            {saving ? "Saving..." : "Save changes"}
          </button>
        </header>

        {saveMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {saveMessage}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-3">
          <aside className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Vehicle image</h2>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={vehicle.model}
                className="mt-4 h-56 w-full rounded-xl object-cover"
              />
            ) : (
              <div className="mt-4 flex h-56 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <FiImage size={34} />
              </div>
            )}
            <button
              type="button"
              onClick={() => imageRef.current?.click()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700"
            >
              <FiImage />
              Change vehicle image
            </button>
            <input
              ref={imageRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={chooseImage}
              className="hidden"
            />
          </aside>

          <section className="rounded-2xl border bg-white p-5 shadow-sm xl:col-span-2">
            <h2 className="text-lg font-bold">Operational details</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label>
                Registration number
                <input
                  name="registration_number"
                  value={vehicle.registration_number}
                  onChange={change}
                  required
                  className={field}
                />
              </label>
              <label>
                Vehicle type
                <input
                  name="vehicle_type"
                  value={vehicle.vehicle_type}
                  onChange={change}
                  required
                  className={field}
                />
              </label>
              <label>
                Make
                <input
                  name="make"
                  value={vehicle.make}
                  onChange={change}
                  required
                  className={field}
                />
              </label>
              <label>
                Model
                <input
                  name="model"
                  value={vehicle.model}
                  onChange={change}
                  required
                  className={field}
                />
              </label>
              <label>
                Vehicle status
                <select
                  value={
                    vehicle.status === "maintenance" ? "inactive" : "active"
                  }
                  onChange={changeOperationalStatus}
                  className={field}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
              {vehicle.status === "maintenance" ? (
                <label>
                  Maintenance classification
                  <input
                    value="Under Maintenance"
                    readOnly
                    className={`${field} bg-slate-50 text-slate-500`}
                  />
                </label>
              ) : (
                <label>
                  Availability
                  <select
                    value={vehicle.status}
                    onChange={changeAvailability}
                    className={field}
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </label>
              )}
              <label>
                Seat capacity
                <input
                  type="number"
                  min="1"
                  max="100"
                  name="seat_capacity"
                  value={vehicle.seat_capacity || ""}
                  onChange={change}
                  className={field}
                />
              </label>
              <div className="md:col-span-2">
                <label>
                  Fuel level:{" "}
                  <span className="font-semibold text-blue-600">
                    {vehicle.fuel_level}%
                  </span>
                  <input
                    type="range"
                    name="fuel_level"
                    min="0"
                    max="100"
                    value={vehicle.fuel_level}
                    onChange={change}
                    className="mt-3 w-full accent-blue-600"
                  />
                </label>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Service Details</h2>
              <p className="mt-1 text-sm text-slate-500">
                Add each service record and its cost.
              </p>
            </div>
            <button
              type="button"
              onClick={addService}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <FiPlus /> Add service
            </button>
          </div>

          <div className="mt-5 max-h-[360px] space-y-3 overflow-y-auto pr-2">
            {vehicle.service_details.length === 0 && (
              <p className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
                No service records added.
              </p>
            )}
            {vehicle.service_details.map((service, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-[1fr_2fr_1fr_auto]"
              >
                <label>
                  Service Date
                  <input
                    required
                    type="date"
                    value={service.service_date || ""}
                    onChange={(event) =>
                      updateService(index, "service_date", event.target.value)
                    }
                    className={field}
                  />
                </label>
                <label>
                  Service Type
                  <select
                    required
                    value={
                      SERVICE_TYPES.includes(service.service_type)
                        ? service.service_type
                        : service.custom || service.service_type
                          ? "custom"
                          : ""
                    }
                    onChange={(event) => {
                      const isCustom = event.target.value === "custom";
                      updateService(index, "service_type", isCustom ? "" : event.target.value);
                      updateService(index, "custom", isCustom);
                    }}
                    className={field}
                  >
                    <option value="" disabled>Select a service type</option>
                    {SERVICE_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                    <option value="custom">Other (custom)</option>
                  </select>
                  {(service.custom || Boolean(service.service_type && !SERVICE_TYPES.includes(service.service_type))) && (
                    <input
                      required
                      value={service.service_type || ""}
                      onChange={(event) =>
                        updateService(index, "service_type", event.target.value)
                      }
                      placeholder="Enter custom service type"
                      className={field}
                    />
                  )}
                </label>
                <label>
                  Cost (LKR)
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={service.cost ?? ""}
                    onChange={(event) =>
                      updateService(index, "cost", event.target.value)
                    }
                    className={field}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  aria-label={`Remove service row ${index + 1}`}
                  className="mt-7 flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-end border-t pt-4">
            <p className="text-lg font-bold text-slate-900">
              Total Cost:{" "}
              <span className="text-blue-600">
                LKR{" "}
                {vehicle.service_details
                  .reduce(
                    (total, service) => total + (Number(service.cost) || 0),
                    0,
                  )
                  .toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </span>
            </p>
          </div>
        </section>

        <DetailSection
          title="Repair Details"
          description="Record repairs and their costs."
          buttonLabel="Add repair"
          items={vehicle.repair_details}
          totalLabel="Total Repair Cost"
          rowClassName="md:grid-cols-[1fr_2fr_1fr_auto]"
          onAdd={() => addDetail("repair_details", { repair_date: "", repair_type: "", cost: "" })}
          onRemove={(index) => removeDetail("repair_details", index)}
          renderFields={(repair, index) => (
            <>
              <Input label="Repair Date" type="date" value={repair.repair_date} field={field} onChange={(value) => updateDetail("repair_details", index, "repair_date", value)} />
              <Input label="Repair Type" value={repair.repair_type} field={field} onChange={(value) => updateDetail("repair_details", index, "repair_type", value)} />
              <Input label="Cost (LKR)" type="number" min="0" step="0.01" value={repair.cost} field={field} onChange={(value) => updateDetail("repair_details", index, "cost", value)} />
            </>
          )}
        />

        <DetailSection
          title="Fuel Details"
          description="Record fuel purchases and costs."
          buttonLabel="Add fuel record"
          items={vehicle.fuel_details}
          totalLabel="Total Fuel Cost"
          rowClassName="md:grid-cols-[1fr_1fr_1fr_1fr_auto]"
          onAdd={() => addDetail("fuel_details", { date: "", fuel_type: "", capacity: "", cost: "" })}
          onRemove={(index) => removeDetail("fuel_details", index)}
          renderFields={(fuel, index) => (
            <>
              <Input label="Date" type="date" value={fuel.date} field={field} onChange={(value) => updateDetail("fuel_details", index, "date", value)} />
              <label>Fuel Type<select required value={fuel.fuel_type || ""} onChange={(event) => updateDetail("fuel_details", index, "fuel_type", event.target.value)} className={field}><option value="" disabled>Select fuel type</option><option value="diesel">Diesel</option><option value="petrol">Petrol</option></select></label>
              <Input label="Capacity (liters)" type="number" min="0" step="0.01" value={fuel.capacity} field={field} onChange={(value) => updateDetail("fuel_details", index, "capacity", value)} />
              <Input label="Cost (LKR)" type="number" min="0" step="0.01" value={fuel.cost} field={field} onChange={(value) => updateDetail("fuel_details", index, "cost", value)} />
            </>
          )}
        />

        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">
            Technical and compliance details
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <label>
              Manufacturing year
              <input
                type="number"
                name="manufacturing_year"
                value={vehicle.manufacturing_year || ""}
                onChange={change}
                className={field}
              />
            </label>
            <label>
              Colour
              <input
                name="color"
                value={vehicle.color || ""}
                onChange={change}
                className={field}
              />
            </label>
            <label>
              VIN
              <input
                name="vin"
                value={vehicle.vin || ""}
                onChange={change}
                className={field}
              />
            </label>
            <label>
              Engine number
              <input
                name="engine_number"
                value={vehicle.engine_number || ""}
                onChange={change}
                className={field}
              />
            </label>
            <label>
              Fuel type
              <input
                name="fuel_type"
                value={vehicle.fuel_type || ""}
                onChange={change}
                className={field}
              />
            </label>
            <label>
              Fuel capacity (litres)
              <input
                type="number"
                min="0"
                max="1000"
                name="fuel_capacity"
                value={vehicle.fuel_capacity || ""}
                onChange={change}
                className={field}
              />
            </label>
            <label>
              Registration expiry
              <input
                type="date"
                name="registration_expiry"
                value={vehicle.registration_expiry || ""}
                onChange={change}
                className={field}
              />
            </label>
            <label>
              Revenue licence expiry
              <input
                type="date"
                name="revenue_license_expiry"
                value={vehicle.revenue_license_expiry || ""}
                onChange={change}
                className={field}
              />
            </label>
            <label>
              Insurance policy
              <input
                name="insurance_policy"
                value={vehicle.insurance_policy || ""}
                onChange={change}
                className={field}
              />
            </label>
            <label>
              Insurance provider
              <input
                name="insurance_provider"
                value={vehicle.insurance_provider || ""}
                onChange={change}
                className={field}
              />
            </label>
            <label className="md:col-span-2 xl:col-span-3">
              Technical notes
              <textarea
                name="technical_notes"
                rows="4"
                value={vehicle.technical_notes || ""}
                onChange={change}
                className={field}
              />
            </label>
          </div>
        </section>
      </form>
    </DashboardLayout>
  );
}

function Input({ label, field, onChange, value = "", ...props }) {
  return (
    <label>
      {label}
      <input required value={value ?? ""} onChange={(event) => onChange(event.target.value)} className={field} {...props} />
    </label>
  );
}

function DetailSection({ title, description, buttonLabel, items, totalLabel, rowClassName, onAdd, onRemove, renderFields }) {
  const totalCost = items.reduce(
    (total, item) => total + (Number(item.cost) || 0),
    0,
  );

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div><h2 className="text-lg font-bold">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></div>
        <button type="button" onClick={onAdd} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"><FiPlus /> {buttonLabel}</button>
      </div>
      <div className="mt-5 max-h-[360px] space-y-3 overflow-y-auto pr-2">
        {items.length === 0 && <p className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">No records added.</p>}
        {items.map((item, index) => (
          <div key={index} className={`grid gap-3 rounded-xl border border-slate-200 p-4 ${rowClassName}`}>
            {renderFields(item, index)}
            <button type="button" onClick={() => onRemove(index)} aria-label={`Remove ${title.toLowerCase()} row ${index + 1}`} className="mt-7 flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"><FiTrash2 /></button>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-end border-t pt-4">
        <p className="text-lg font-bold text-slate-900">
          {totalLabel}: {" "}
          <span className="text-blue-600">
            LKR {totalCost.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </p>
      </div>
    </section>
  );
}
