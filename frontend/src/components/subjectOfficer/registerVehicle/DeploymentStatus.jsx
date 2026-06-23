import {
  FiMapPin,
  FiInfo,
  FiUsers,
  FiCheckCircle,
} from "react-icons/fi";

export default function DeploymentStatus() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-purple-50 via-violet-50 to-slate-50 px-6 py-5">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-lg">
            <FiMapPin size={20} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Deployment Status
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Configure the vehicle's initial assignment and operational deployment.
            </p>
          </div>

        </div>

      </div>

      {/* Content */}
      <div className="p-6">

        {/* Assignment */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <FiUsers size={14} />
            Initial Assignment
          </label>

          <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100">
            <option>General Pool</option>
            <option>Finance Department</option>
            <option>Administration Division</option>
            <option>Public Works Department</option>
            <option>Transport Division</option>
            <option>Secretary Office</option>
          </select>
        </div>

        {/* Deployment Summary */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Deployment Type
            </p>

            <h4 className="mt-2 font-semibold text-slate-900">
              Shared Fleet Pool
            </h4>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Initial Status
            </p>

            <h4 className="mt-2 flex items-center gap-2 font-semibold text-amber-600">
              <FiCheckCircle size={14} />
              Pending Inspection
            </h4>
          </div>

        </div>

        {/* Notice */}
        <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4">

          <div className="flex gap-3">

            <FiInfo className="mt-1 text-amber-600" />

            <div>
              <h4 className="font-medium text-slate-800">
                Deployment Notice
              </h4>

              <p className="mt-1 text-sm text-slate-600">
                Newly registered vehicles remain inactive until the
                mandatory fleet inspection and compliance verification
                process is completed by the transport administration.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}