import {
  FiBookOpen,
  FiHeadphones,
  FiShield,
  FiArrowRight,
} from "react-icons/fi";

export default function SupportCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-800 text-white shadow-xl">

      {/* Background Decoration */}
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl"></div>

      <div className="relative p-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <FiShield size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Operational Support
            </h2>

            <p className="text-xs text-blue-100 mt-1">
              Fleet & System Assistance Center
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-blue-100">
          Need technical assistance, report a vehicle tracking issue,
          or access system resources? Our support team is available
          to ensure uninterrupted fleet operations.
        </p>

        {/* Quick Stats */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-100">
              Support Availability
            </span>

            <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-300">
              Online
            </span>
          </div>

          <div className="mt-3 text-2xl font-bold">
            24 / 7
          </div>

          <p className="text-xs text-blue-200 mt-1">
            IT Operations & Fleet Monitoring
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">

          <button className="group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm transition hover:bg-white/15">
            <div className="flex items-center gap-3">
              <FiBookOpen />
              <span className="font-medium">
                Documentation Center
              </span>
            </div>

            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </button>

          <button className="group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm transition hover:bg-white/15">
            <div className="flex items-center gap-3">
              <FiHeadphones />
              <span className="font-medium">
                Contact IT Support
              </span>
            </div>

            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </button>

        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-white/10 pt-4">
          <p className="text-xs text-blue-200">
            Average response time: <span className="font-semibold text-white">5 minutes</span>
          </p>
        </div>

      </div>
    </div>
  );
}