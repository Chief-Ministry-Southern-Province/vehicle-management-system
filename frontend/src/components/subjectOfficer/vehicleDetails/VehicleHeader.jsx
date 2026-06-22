import {
  FiEdit,
  FiDownload,
  FiActivity,
  FiCheckCircle,
} from "react-icons/fi";
import VehicleStats from "./VehicleStats";

export default function VehicleHeader() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      <div className="grid gap-6 lg:grid-cols-[320px_1fr] p-5">

        {/* Vehicle Image */}
        <div>
          <div className="relative overflow-hidden rounded-2xl">

            <img
              src="https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200"
              alt="Vehicle"
              className="h-[280px] w-full object-cover"
            />

            <div className="absolute left-4 top-4">
              <span className="rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold text-slate-700">
                VMS-2024-C342
              </span>
            </div>

            <div className="absolute right-4 top-4">
              <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white">
                Available
              </span>
            </div>

          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">

          {/* Header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

            <div>

              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-900">
                  KBA 452G
                </h1>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                  Hybrid
                </span>
              </div>

              <p className="mt-2 text-lg font-medium text-slate-700">
                Toyota Camry Hybrid
              </p>

              <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-500">
                <span>2023 Model</span>
                <span>•</span>
                <span>White Pearl</span>
                <span>•</span>
                <span>Automatic</span>
              </div>

            </div>

            {/* Actions */}
            <div className="flex gap-2">

              <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
                <FiEdit size={15} />
                Edit
              </button>

              <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                <FiDownload size={15} />
                Export
              </button>

            </div>

          </div>

          {/* Stats */}
          <VehicleStats />

          {/* Health Card */}
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex-1">

                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Vehicle Health
                  </span>

                  <span className="text-sm font-bold text-green-600">
                    92%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: "92%" }}
                  />
                </div>

              </div>

              <div className="flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-sm text-green-700">
                <FiCheckCircle />
                Excellent Condition
              </div>

            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <FiActivity className="text-blue-600" />
              No critical maintenance alerts detected
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}