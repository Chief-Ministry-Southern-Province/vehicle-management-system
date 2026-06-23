import {
  FiDollarSign,
  FiClock,
  FiFileText,
  FiTool,
  FiCheckCircle,
  FiPhone,
} from "react-icons/fi";

export default function RepairSidebar() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 p-6 border-b border-slate-100">

        <div className="flex items-start justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
                <FiTool size={20} />
              </div>

              <div>

                <h2 className="text-2xl font-bold text-slate-900">
                  GV-8842
                </h2>

                <p className="text-slate-500">
                  Toyota Hilux
                </p>

              </div>

            </div>

          </div>

          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            In Progress
          </span>

        </div>

      </div>

      <div className="p-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3">

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600 mb-3">
              <FiDollarSign />
            </div>

            <p className="text-xs uppercase tracking-wide text-slate-500">
              Total Cost
            </p>

            <h3 className="mt-1 text-2xl font-bold text-slate-900">
              $775
            </h3>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 mb-3">
              <FiClock />
            </div>

            <p className="text-xs uppercase tracking-wide text-slate-500">
              Downtime
            </p>

            <h3 className="mt-1 text-2xl font-bold text-slate-900">
              5 Days
            </h3>

          </div>

        </div>

        {/* Repair Summary */}
        <div className="mt-6 rounded-2xl border border-slate-200 p-5">

          <h3 className="font-semibold text-slate-900 mb-3">
            Repair Summary
          </h3>

          <p className="text-sm leading-relaxed text-slate-600">
            Complete engine teardown required due to severe overheating.
            Cylinder head resurfacing and gasket replacement are currently
            underway. Workshop diagnostics indicate no transmission damage.
          </p>

        </div>

        {/* Cost Breakdown */}
        <div className="mt-6 rounded-2xl border border-slate-200 p-5">

          <h3 className="font-semibold text-slate-900 mb-4">
            Cost Breakdown
          </h3>

          <div className="space-y-3 text-sm">

            <div className="flex justify-between">
              <span className="text-slate-500">
                Spare Parts
              </span>

              <span className="font-medium">
                $450
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Labor Fees
              </span>

              <span className="font-medium">
                $280
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Tax / Levy
              </span>

              <span className="font-medium">
                $45
              </span>
            </div>

            <div className="border-t pt-3 flex justify-between">

              <span className="font-semibold">
                Total
              </span>

              <span className="font-bold text-blue-600">
                $775
              </span>

            </div>

          </div>

        </div>

        {/* Documents */}
        <div className="mt-6">

          <h3 className="font-semibold text-slate-900 mb-4">
            Documentation
          </h3>

          <div className="space-y-3">

            <div className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50 transition">

              <div className="flex gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FiFileText />
                </div>

                <div>

                  <p className="font-medium text-sm text-slate-900">
                    Damage_Photo_Front.jpg
                  </p>

                  <p className="text-xs text-slate-500">
                    Uploaded Oct 12, 2024
                  </p>

                </div>

              </div>

            </div>

            <div className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50 transition">

              <div className="flex gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <FiCheckCircle />
                </div>

                <div>

                  <p className="font-medium text-sm text-slate-900">
                    Workshop_Invoice_4492.pdf
                  </p>

                  <p className="text-xs text-slate-500">
                    Certified Document
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mt-6">

          <button className="rounded-2xl bg-blue-600 py-3 text-sm font-medium text-white transition hover:bg-blue-700">
            Approve Invoice
          </button>

          <button className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            <FiPhone size={14} />
            Contact Workshop
          </button>

        </div>

      </div>

    </div>
  );
}