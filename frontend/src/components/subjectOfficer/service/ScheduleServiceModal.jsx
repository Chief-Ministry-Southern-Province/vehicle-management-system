import {
  FiX,
  FiTool,
  FiCalendar,
  FiTruck,
  FiUser,
  FiDollarSign,
} from "react-icons/fi";

export default function ScheduleServiceModal({
  isOpen,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl">

        {/* Header */}

        <div className="flex items-start justify-between p-6 border-b">

          <div className="flex gap-3">

            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <FiTool className="text-blue-600" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Schedule Maintenance Service
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Create a new maintenance record to notify
                the vendor and department heads.
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX size={20} />
          </button>

        </div>

        {/* Body */}

        <div className="p-6">

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium mb-2">
                Select Vehicle
              </label>

              <div className="relative">
                <FiTruck className="absolute left-3 top-3.5 text-gray-400" />

                <input
                  type="text"
                  defaultValue="GV-4482 (Mitsubishi Montero)"
                  className="w-full border rounded-xl pl-10 py-3"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Service Type
              </label>

              <select className="w-full border rounded-xl px-4 py-3">
                <option>Scheduled Major Service</option>
                <option>Routine Maintenance</option>
                <option>Oil Change</option>
                <option>Engine Inspection</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Assigned Vendor
              </label>

              <div className="relative">
                <FiUser className="absolute left-3 top-3.5 text-gray-400" />

                <input
                  type="text"
                  defaultValue="AutoTech Solutions"
                  className="w-full border rounded-xl pl-10 py-3"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Scheduled Date
              </label>

              <div className="relative">
                <FiCalendar className="absolute left-3 top-3.5 text-gray-400" />

                <input
                  type="date"
                  className="w-full border rounded-xl pl-10 py-3"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Estimated Cost
              </label>

              <div className="relative">
                <FiDollarSign className="absolute left-3 top-3.5 text-gray-400" />

                <input
                  type="number"
                  defaultValue="450"
                  className="w-full border rounded-xl pl-10 py-3"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Current Mileage (KM)
              </label>

              <input
                type="number"
                defaultValue="124500"
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

          </div>

          {/* Notes */}

          <div className="mt-6">

            <label className="block text-sm font-medium mb-2">
              Maintenance Requirements / Notes
            </label>

            <textarea
              rows="5"
              defaultValue="Replace primary oil filters, check transmission fluid levels, and inspect brake pads for wear. Full electrical diagnostics requested by the department officer."
              className="w-full border rounded-xl p-4"
            />

          </div>

        </div>

        {/* Footer */}

        <div className="border-t p-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-5 py-3 border rounded-xl hover:bg-gray-50"
          >
            Cancel
          </button>

          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
            Submit Schedule
          </button>

        </div>

      </div>

    </div>
  );
}