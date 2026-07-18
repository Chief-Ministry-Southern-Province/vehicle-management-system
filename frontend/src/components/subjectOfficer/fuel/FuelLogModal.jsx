import {
  FiX,
  FiUploadCloud,
  FiDroplet,
  FiTruck,
  FiCalendar,
  FiUser,
  FiActivity,
  FiDollarSign,
} from "react-icons/fi";

export default function FuelLogModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 via-cyan-50 to-slate-50 px-6 py-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
                <FiDroplet size={20} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  New Fuel Log Entry
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Record fuel transactions and update fleet fuel consumption
                  records.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[75vh] overflow-y-auto p-6">
          {/* Basic Details */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <FiTruck size={14} />
                Vehicle
              </label>

              <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white">
                <option>Select Vehicle</option>
                <option>GV-9921</option>
                <option>GV-8821</option>
              </select>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <FiCalendar size={14} />
                Transaction Date
              </label>

              <input
                type="date"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <FiUser size={14} />
                Driver
              </label>

              <input
                placeholder="Assigned Driver"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <FiDroplet size={14} />
                Liters
              </label>

              <input
                type="number"
                placeholder="0.00"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <FiDollarSign size={14} />
                Unit Price
              </label>

              <input
                type="number"
                placeholder="0.00"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <FiActivity size={14} />
                Odometer Reading
              </label>

              <input
                type="number"
                placeholder="KM Reading"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Fuel Type */}
          <div className="mt-6">
            <label className="mb-3 block text-sm font-medium text-slate-700">
              Fuel Type
            </label>

            <div className="flex flex-wrap gap-3">
              <button className="rounded-xl border border-blue-500 bg-blue-50 px-5 py-2 text-sm font-medium text-blue-600">
                Diesel
              </button>

              <button className="rounded-xl border border-slate-200 px-5 py-2 text-sm hover:bg-slate-50">
                Petrol
              </button>

              <button className="rounded-xl border border-slate-200 px-5 py-2 text-sm hover:bg-slate-50">
                Electric
              </button>

              <button className="rounded-xl border border-slate-200 px-5 py-2 text-sm hover:bg-slate-50">
                Hybrid
              </button>
            </div>
          </div>

          {/* Upload */}
          <div className="mt-6">
            <label className="mb-3 block text-sm font-medium text-slate-700">
              Receipt Upload
            </label>

            <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center transition hover:border-blue-500 hover:bg-blue-50">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                <FiUploadCloud size={28} className="text-blue-600" />
              </div>

              <h4 className="mt-4 font-medium text-slate-800">
                Upload Receipt
              </h4>

              <p className="mt-1 text-sm text-slate-500">
                Drag & drop files here or click to browse
              </p>

              <span className="mt-3 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                PNG, JPG, PDF • Max 5MB
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-white"
          >
            Cancel
          </button>

          <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700">
            Save Fuel Log
          </button>
        </div>
      </div>
    </div>
  );
}
