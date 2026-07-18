import {
  FiSettings,
  FiCpu,
  FiHash,
  FiDroplet,
  FiFileText,
} from "react-icons/fi";

export default function TechnicalSpecifications() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-blue-50 to-slate-50 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
            <FiSettings size={20} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Technical Specifications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Engine details, chassis information, fuel specifications, and
              technical records.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <div className="grid gap-5 md:grid-cols-2">
          {/* VIN */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <FiHash size={14} />
              VIN Number
            </label>

            <input
              type="text"
              placeholder="17-character VIN"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* Engine Number */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <FiCpu size={14} />
              Engine Number
            </label>

            <input
              type="text"
              placeholder="Engine Number"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* Fuel Type */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <FiDroplet size={14} />
              Fuel Type
            </label>

            <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100">
              <option>Petrol (Octane 95)</option>
              <option>Diesel</option>
              <option>Hybrid</option>
              <option>Electric</option>
            </select>
          </div>

          {/* Fuel Capacity */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <FiDroplet size={14} />
              Fuel Tank Capacity
            </label>

            <input
              type="number"
              placeholder="50 Liters"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <FiFileText size={14} />
              Additional Technical Notes
            </label>

            <textarea
              rows={5}
              placeholder="Enter maintenance remarks, engine specifications, modifications, warranty information, or any other technical details..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm transition-all outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
