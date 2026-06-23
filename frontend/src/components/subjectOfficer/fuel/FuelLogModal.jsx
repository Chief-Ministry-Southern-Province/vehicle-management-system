import {
  FiX,
  FiUpload,
  FiCalendar,
} from "react-icons/fi";

export default function FuelLogModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl w-full max-w-4xl">

        {/* Header */}

        <div className="flex justify-between items-start p-6 border-b">

          <div>
            <h2 className="text-2xl font-bold">
              New Fuel Log Entry
            </h2>

            <p className="text-gray-500 mt-1">
              Record a new fuel transaction for the fleet.
            </p>
          </div>

          <button onClick={onClose}>
            <FiX size={20} />
          </button>

        </div>

        {/* Form */}

        <div className="p-6">

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="block mb-2 text-sm font-medium">
                Vehicle
              </label>

              <select className="w-full border rounded-xl px-4 py-3">
                <option>Select Vehicle</option>
                <option>GV-9921</option>
                <option>GV-8821</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Transaction Date
              </label>

              <input
                type="date"
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Driver
              </label>

              <input
                placeholder="Assigned Driver"
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Liters
              </label>

              <input
                type="number"
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Unit Price
              </label>

              <input
                type="number"
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Odometer Reading (KM)
              </label>

              <input
                type="number"
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

          </div>

          {/* Fuel Type */}

          <div className="mt-6">

            <label className="block mb-3 text-sm font-medium">
              Fuel Type
            </label>

            <div className="flex gap-3">

              <button className="px-5 py-2 border rounded-lg bg-blue-50 text-blue-600 border-blue-500">
                Diesel
              </button>

              <button className="px-5 py-2 border rounded-lg">
                Petrol
              </button>

              <button className="px-5 py-2 border rounded-lg">
                Electric
              </button>

            </div>

          </div>

          {/* Upload */}

          <div className="mt-6">

            <label className="block mb-3 text-sm font-medium">
              Receipt Upload
            </label>

            <div className="border-2 border-dashed rounded-xl p-12 text-center">

              <FiUpload className="mx-auto text-4xl text-gray-400 mb-4" />

              <p className="font-medium">
                Click to upload or drag and drop
              </p>

              <p className="text-sm text-gray-500">
                PNG, JPG, PDF up to 5MB
              </p>

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="border-t p-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="border px-5 py-3 rounded-xl"
          >
            Cancel
          </button>

          <button className="bg-blue-600 text-white px-5 py-3 rounded-xl">
            Save Log Entry
          </button>

        </div>

      </div>

    </div>
  );
}