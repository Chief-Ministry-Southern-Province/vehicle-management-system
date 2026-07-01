import DashboardLayout from "../../layouts/DashboardLayout";
import {
  FiMapPin,
  FiUsers,
  FiTruck,
  FiAlertCircle,
  FiPaperclip,
  FiSend,
  FiSave,
} from "react-icons/fi";

export default function CreateVehicleRequest() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">

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
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Expected Return
              </label>

              <input
                type="datetime-local"
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
                  defaultValue={1}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Passenger Names
                </label>

                <input
                  type="text"
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

            <div className="border-2 border-dashed rounded-xl p-16 text-center">
              <FiPaperclip className="mx-auto text-4xl text-gray-400" />

              <p className="mt-4">
                Click to upload or drag & drop
              </p>

              <p className="text-gray-500 text-sm">
                PDF, JPG, PNG (Max 5MB)
              </p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border rounded-xl p-6 flex justify-end gap-4">

          <button className="flex items-center gap-2 border px-6 py-3 rounded-lg">
            <FiSave />
            Save Draft
          </button>

          <button 
            onClick={() => alert("Request submitted!")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
            <FiSend />
            Submit Request
          </button>

        </div>

      </div>
    </DashboardLayout>
  );
}