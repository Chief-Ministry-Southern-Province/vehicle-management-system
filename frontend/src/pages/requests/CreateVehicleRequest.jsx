import DashboardLayout from "../../layouts/DashboardLayout";
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

export default function CreateVehicleRequest() {
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
    <DashboardLayout>
      <form className="max-w-6xl mx-auto" onSubmit={submitRequest}>

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Create New Vehicle Request
            </h1>

            <p className="text-gray-500 mt-2">
              Please fill in the details below to request a vehicle for official business.
            </p>
          </div>

          <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
            Draft ID: VMS-REQ-PENDING
          </span>
        </div>

        {/* Trip Information */}
        <div className="bg-white rounded-xl border shadow-sm mb-6">
          <div className="border-b p-6">
            <div className="flex items-center gap-3">
              <FiMapPin className="text-blue-600 text-xl" />
              <div>
                <h2 className="font-semibold text-xl">
                  Trip Information
                </h2>

                <p className="text-gray-500 text-sm">
                  Where and when are you travelling?
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 grid md:grid-cols-2 gap-5">

            <div>
              <label className="block mb-2 text-sm font-medium">
                Purpose of Trip
              </label>

              <input
                type="text"
                name="purpose"
                value={form.purpose}
                onChange={updateField}
                required
                placeholder="Regional Site Inspection"
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Destination
              </label>

              <input
                type="text"
                name="destination"
                value={form.destination}
                onChange={updateField}
                required
                placeholder="Administrative Office"
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Departure Date & Time
              </label>

              <input
                type="datetime-local"
                name="departure_at"
                value={form.departure_at}
                onChange={updateField}
                required
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Expected Return
              </label>

              <input
                type="datetime-local"
                name="expected_return_at"
                value={form.expected_return_at}
                onChange={updateField}
                required
                className="w-full border rounded-lg p-3"
              />
            </div>

          </div>
        </div>

        {/* Passenger Details */}
        <div className="bg-white rounded-xl border shadow-sm mb-6">

          <div className="border-b p-6">
            <div className="flex items-center gap-3">
              <FiUsers className="text-blue-600 text-xl" />

              <div>
                <h2 className="font-semibold text-xl">
                  Passenger Details
                </h2>

                <p className="text-gray-500 text-sm">
                  Who else is travelling with you?
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="block mb-2 text-sm font-medium">
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
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Passenger Names
                </label>

                <input
                  type="text"
                  name="passenger_names"
                  value={form.passenger_names}
                  onChange={updateField}
                  placeholder="Enter names"
                  className="w-full border rounded-lg p-3"
                />
              </div>

            </div>

          </div>
        </div>

        {/* Vehicle Preference */}
        {/* <div className="bg-white rounded-xl border shadow-sm mb-6">

          <div className="border-b p-6">
            <div className="flex items-center gap-3">
              <FiTruck className="text-blue-600 text-xl" />

              <div>
                <h2 className="font-semibold text-xl">
                  Vehicle Preference
                </h2>

                <p className="text-gray-500 text-sm">
                  Select the most suitable vehicle type.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">

            <button className="border-2 border-blue-500 rounded-xl p-5">
              <h3 className="font-semibold">Sedan</h3>
              <p className="text-sm text-gray-500">4 Seats</p>
            </button>

            <button className="border rounded-xl p-5">
              <h3 className="font-semibold">SUV</h3>
              <p className="text-sm text-gray-500">6 Seats</p>
            </button>

            <button className="border rounded-xl p-5">
              <h3 className="font-semibold">Pickup</h3>
              <p className="text-sm text-gray-500">2 Seats</p>
            </button>

            <button className="border rounded-xl p-5">
              <h3 className="font-semibold">Microbus</h3>
              <p className="text-sm text-gray-500">12 Seats</p>
            </button>

          </div>
        </div> */}

        {/* Priority */}
        {/* <div className="bg-white rounded-xl border shadow-sm mb-6">

          <div className="border-b p-6">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="text-blue-600 text-xl" />

              <div>
                <h2 className="font-semibold text-xl">
                  Priority Level
                </h2>

                <p className="text-gray-500 text-sm">
                  How critical is this request?
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">

            <div className="grid md:grid-cols-4 gap-4">

              {["Low", "Medium", "High", "Critical"].map((level) => (
                <button
                  key={level}
                  className="border rounded-xl p-4 text-left hover:border-blue-500"
                >
                  <h3 className="font-semibold uppercase">
                    {level}
                  </h3>
                </button>
              ))}
            </div>

            <textarea
              rows={5}
              placeholder="Provide context for this request..."
              className="w-full border rounded-lg p-3 mt-5"
            />

          </div>
        </div> */}

        {/* Attachments */}
        <div className="bg-white rounded-xl border shadow-sm mb-6">

          <div className="border-b p-6">
            <div className="flex items-center gap-3">
              <FiPaperclip className="text-blue-600 text-xl" />

              <div>
                <h2 className="font-semibold text-xl">
                  Attachments
                </h2>

                <p className="text-gray-500 text-sm">
                  Upload supporting documents.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed rounded-xl p-16 text-center hover:border-blue-500"
            >
              <FiPaperclip className="mx-auto text-4xl text-gray-400" />

              <p className="mt-4">
                Click to upload or drag & drop
              </p>

              <p className="text-gray-500 text-sm">
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
        <div className="bg-white border rounded-xl p-6 flex justify-end gap-4">

          <button type="button" className="flex items-center gap-2 border px-6 py-3 rounded-lg" disabled>
            <FiSave />
            Save Draft
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
            <FiSend />
            {submitting ? "Submitting..." : "Submit Request"}
          </button>

        </div>

      </form>
    </DashboardLayout>
  );
}
