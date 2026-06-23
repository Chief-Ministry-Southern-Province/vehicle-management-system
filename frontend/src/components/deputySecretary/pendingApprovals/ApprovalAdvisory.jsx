import {
  FiClock,
  FiAlertCircle,
  FiArrowRight,
} from "react-icons/fi";

export default function ApprovalAdvisory() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

      {/* Accent */}
      <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-amber-400 to-orange-500" />

      <div className="pl-3">

        {/* Header */}
        <div className="flex items-start justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50">

              <FiAlertCircle
                size={18}
                className="text-amber-600"
              />

            </div>

            <div>

              <h3 className="font-semibold text-slate-900">
                Allocation Advisory
              </h3>

              <p className="text-xs text-slate-500">
                Fleet Operations Recommendation
              </p>

            </div>

          </div>

          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            Priority
          </span>

        </div>

        {/* Content */}
        <div className="mt-4">

          <p className="text-sm leading-relaxed text-slate-600">
            Priority requests from the
            <span className="font-semibold text-slate-900">
              {" "}Ministry of Health
            </span>
            {" "}should be processed first due to the upcoming
            national immunization campaign. Current SUV
            utilization has reached
            <span className="font-semibold text-amber-600">
              {" "}80%
            </span>
            , limiting standby capacity.
          </p>

        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">

          <div className="flex items-center gap-2 text-xs text-slate-500">

            <FiClock size={12} />

            Updated 20 minutes ago

          </div>

          <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">

            Review Details

            <FiArrowRight size={14} />

          </button>

        </div>

      </div>

    </div>
  );
}