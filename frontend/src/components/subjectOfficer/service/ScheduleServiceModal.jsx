import {
  FiX,
  FiTool,
  FiCalendar,
  FiTruck,
  FiUser,
  FiDollarSign,
  FiActivity,
  FiCheckCircle,
} from "react-icons/fi";

export default function ScheduleServiceModal({
  isOpen,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">

      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

        {/* Header */}
        <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 px-6 py-5">

          <div className="flex items-start justify-between">

            <div className="flex gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
                <FiTool size={20} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Schedule Maintenance Service
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a maintenance schedule and notify vendors,
                  transport officers, and department heads.
                </p>
              </div>

            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-500 transition hover:bg-white"
            >
              <FiX size={20} />
            </button>

          </div>

        </div>

        {/* Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6">

          {/* Vehicle Summary */}
          <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Selected Vehicle
                </p>

                <h3 className="mt-1 font-semibold text-slate-900">
                  GV-4482 • Mitsubishi Montero
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Current Mileage: 124,500 KM
                </p>

              </div>

              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                <FiCheckCircle size={12} />
                Active Fleet Vehicle
              </span>

            </div>

          </div>

          {/* Form */}
          <div className="grid gap-5 md:grid-cols-2">

            {/* Vehicle */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Select Vehicle
              </label>

              <div className="relative">

                <FiTruck className="absolute left-3 top-3.5 text-slate-400" />

                <input
                  type="text"
                  defaultValue="GV-4482 (Mitsubishi Montero)"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

              </div>
            </div>

            {/* Service Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Service Type
              </label>

              <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100">
                <option>Scheduled Major Service</option>
                <option>Routine Maintenance</option>
                <option>Oil Change</option>
                <option>Engine Inspection</option>
                <option>Brake Inspection</option>
              </select>
            </div>

            {/* Vendor */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Assigned Vendor
              </label>

              <div className="relative">

                <FiUser className="absolute left-3 top-3.5 text-slate-400" />

                <input
                  type="text"
                  defaultValue="AutoTech Solutions"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

              </div>
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Scheduled Date
              </label>

              <div className="relative">

                <FiCalendar className="absolute left-3 top-3.5 text-slate-400" />

                <input
                  type="date"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

              </div>
            </div>

            {/* Cost */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Estimated Cost
              </label>

              <div className="relative">

                <FiDollarSign className="absolute left-3 top-3.5 text-slate-400" />

                <input
                  type="number"
                  defaultValue="450"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

              </div>
            </div>

            {/* Mileage */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Current Mileage (KM)
              </label>

              <div className="relative">

                <FiActivity className="absolute left-3 top-3.5 text-slate-400" />

                <input
                  type="number"
                  defaultValue="124500"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

              </div>
            </div>

          </div>

          {/* Notes */}
          <div className="mt-6">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Maintenance Requirements / Notes
            </label>

            <textarea
              rows={5}
              defaultValue="Replace primary oil filters, check transmission fluid levels, inspect brake pads, and perform a full electrical diagnostic check."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

          </div>

          {/* Summary Card */}
          <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-4">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <FiTool />
              </div>

              <div>

                <h4 className="font-medium text-slate-900">
                  Service Summary
                </h4>

                <p className="mt-1 text-sm text-slate-600">
                  Once submitted, the maintenance request will be
                  assigned to the selected vendor and become visible
                  in the fleet maintenance schedule dashboard for
                  monitoring and approval.
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
            Submit Schedule
          </button>

        </div>

      </div>

    </div>
  );
}