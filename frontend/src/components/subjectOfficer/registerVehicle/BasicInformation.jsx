import { FiTruck } from "react-icons/fi";

export default function BasicInformation() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
            <FiTruck size={20} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Basic Identification
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              General details used to identify the vehicle within the fleet
              registry.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <div className="grid gap-5 md:grid-cols-2">
          {/* License Plate */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              License Plate Number
            </label>

            <input
              type="text"
              placeholder="GV-1234-B"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Vehicle Category
            </label>

            <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100">
              <option>Executive Sedan</option>
              <option>SUV</option>
              <option>Van</option>
              <option>Pickup</option>
            </select>
          </div>

          {/* Manufacturer */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Manufacturer / Make
            </label>

            <input
              type="text"
              placeholder="Toyota"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* Model */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Model Name
            </label>

            <input
              type="text"
              placeholder="Camry Hybrid"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* Color */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Color Description
            </label>

            <input
              type="text"
              placeholder="Pearl White Metallic"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
