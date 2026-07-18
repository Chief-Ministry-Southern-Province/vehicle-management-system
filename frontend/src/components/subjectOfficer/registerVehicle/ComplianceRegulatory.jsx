import {
  FiShield,
  FiCalendar,
  FiFileText,
  FiCheckCircle,
} from "react-icons/fi";

export default function ComplianceRegulatory() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-green-50 via-emerald-50 to-slate-50 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg">
            <FiShield size={20} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Compliance & Regulatory
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Registration details, insurance coverage, and legal compliance
              records.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <div className="grid gap-5 md:grid-cols-2">
          {/* Registration Expiry */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <FiCalendar size={14} />
              Registration Expiry Date
            </label>

            <input
              type="date"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
            />
          </div>

          {/* Revenue License */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <FiCalendar size={14} />
              Revenue License Expiry
            </label>

            <input
              type="date"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
            />
          </div>

          {/* Insurance Policy */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <FiFileText size={14} />
              Insurance Policy Number
            </label>

            <input
              placeholder="POL-2026-001245"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
            />
          </div>

          {/* Insurance Provider */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <FiShield size={14} />
              Insurance Provider
            </label>

            <input
              placeholder="Sri Lanka Insurance"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
            />
          </div>
        </div>

        {/* Compliance Status */}
        <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <FiCheckCircle />
            </div>

            <div>
              <h4 className="font-medium text-slate-800">
                Compliance Verification
              </h4>

              <p className="mt-1 text-sm text-slate-600">
                Ensure all registration, insurance, and licensing information is
                valid and up to date before activating the vehicle within the
                fleet management system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
