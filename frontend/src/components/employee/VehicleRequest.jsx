import {
  FiMapPin,
  FiUsers,
  FiPaperclip,
  FiSend,
  FiSave,
} from "react-icons/fi";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { createVehicleRequest } from "../../api/authApi";

export default function VehicleRequest() {
  const [form, setForm] = useState({
    purpose: "",
    destination: "",
    departure_at: "",
    expected_return_at: "",
    passenger_count: 1,
    passenger_names: "",
  });
  const [attachment, setAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitRequest = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      if (attachment) payload.append("attachment", attachment);

      await createVehicleRequest(payload);
      toast.success("Vehicle request submitted successfully.");
      setForm({ purpose: "", destination: "", departure_at: "", expected_return_at: "", passenger_count: 1, passenger_names: "" });
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      const errors = error?.errors;
      const message = errors ? Object.values(errors).flat()[0] : error?.message;
      toast.error(message || "Unable to submit the request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-100 bg-slate-50/70 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] sm:p-6">
      <form className="mx-auto max-w-6xl" onSubmit={submitRequest}>

        {/* Header */}
        <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 p-6 text-white shadow-xl sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">Official Transport</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Create New Vehicle Request
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
              Please fill in the details below to request a vehicle for official business.
            </p>
          </div>

          <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-blue-50 ring-1 ring-inset ring-white/20 backdrop-blur-sm">
            Draft ID: VMS-REQ-PENDING
          </span>
          </div>
        </div>

        {/* Trip Information */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50/80 to-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-md"><FiMapPin /></div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Trip Information
                </h2>

                <p className="text-sm text-slate-500">
                  Where and when are you travelling?
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Purpose of Trip
              </label>

              <input
                type="text"
                name="purpose"
                value={form.purpose}
                onChange={updateField}
                required
                placeholder="Regional Site Inspection"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Destination
              </label>

              <input
                type="text"
                name="destination"
                value={form.destination}
                onChange={updateField}
                required
                placeholder="Administrative Office"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Departure Date & Time
              </label>

              <input
                type="datetime-local"
                name="departure_at"
                value={form.departure_at}
                onChange={updateField}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Expected Return
              </label>

              <input
                type="datetime-local"
                name="expected_return_at"
                value={form.expected_return_at}
                onChange={updateField}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

          </div>
        </div>

        {/* Passenger Details */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">

          <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50/80 to-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-xl text-white shadow-md"><FiUsers /></div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Passenger Details
                </h2>

                <p className="text-sm text-slate-500">
                  Who else is travelling with you?
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Total Count
                </label>

                <input
                  type="number"
                  name="passenger_count"
                  min="1"
                  max="100"
                  value={form.passenger_count}
                  onChange={updateField}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Passenger Names
                </label>

                <input
                  type="text"
                  name="passenger_names"
                  value={form.passenger_names}
                  onChange={updateField}
                  placeholder="Enter names"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>

            </div>

          </div>
        </div>

        {/* Attachments */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">

          <div className="border-b border-slate-100 bg-gradient-to-r from-cyan-50/80 to-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-600 text-xl text-white shadow-md"><FiPaperclip /></div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Attachments
                </h2>

                <p className="text-sm text-slate-500">
                  Upload supporting documents.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center transition hover:border-blue-400 hover:bg-blue-50/50 sm:py-14"
            >
              <FiPaperclip className="mx-auto text-4xl text-slate-300 transition group-hover:text-blue-500" />

              <p className="mt-4 font-semibold text-slate-700">
                Click to upload or drag & drop
              </p>

              <p className="mt-1 text-sm text-slate-500">
                PDF, JPG, PNG (Max 5MB)
              </p>
              {attachment && <p className="mt-3 text-sm font-medium text-blue-600">Selected: {attachment.name}</p>}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(event) => setAttachment(event.target.files?.[0] || null)}
              className="hidden"
            />

          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse justify-end gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row">

          <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50" disabled>
            <FiSave />
            Save Draft
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            <FiSend />
            {submitting ? "Submitting..." : "Submit Request"}
          </button>

        </div>

      </form>
    </section>
  );
}
