import {
  FiClock,
  FiMapPin,
  FiNavigation,
  FiTruck,
  FiAlertTriangle,
  FiDroplet,
  FiHome,
  FiUser,
  FiClipboard,
} from "react-icons/fi";

export default function MobileDriverDashboard() {
  return (
    <div className="lg:hidden min-h-screen bg-slate-50">

      {/* Header */}

      <div className="bg-white px-4 pt-4 pb-3 border-b sticky top-0 z-50">

        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
              Driver
            </span>

            <h1 className="font-bold text-lg mt-1">
              VMS Driver
            </h1>
          </div>

          <div className="text-right">
            <h3 className="font-semibold">
              DRV-B129
            </h3>

            <p className="text-xs text-slate-500">
              Operational Driver
            </p>
          </div>
        </div>

        {/* Current Status */}

        <div className="bg-slate-50 border rounded-2xl p-4">

          <div className="flex justify-between items-center">

            <div>
              <h3 className="font-semibold">
                Currently On Duty
              </h3>

              <p className="text-xs text-slate-500">
                Available for assignments
              </p>
            </div>

            <button className="border px-4 py-2 rounded-xl text-sm">
              Go Off
            </button>

          </div>

        </div>

      </div>

      {/* Main Content */}

      <div className="p-4 space-y-5">

        {/* Next Assignment */}

        <div>

          <div className="flex justify-between mb-3">
            <h3 className="font-bold">
              Next Assignment
            </h3>

            <button className="text-blue-600 text-sm">
              View All
            </button>
          </div>

          <div className="bg-white rounded-2xl border p-4">

            <div className="flex justify-between mb-3">
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                LIVE
              </span>

              <span className="text-xs text-slate-500">
                ID: REQ-9902
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <FiClock />
              14:30 - 16:00
            </div>

            <h2 className="font-bold text-lg">
              VIP Transport: Ministry HQ
            </h2>

            <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
              <FiMapPin />
              Central Plaza, Government District
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">

              <button className="bg-blue-600 text-white py-3 rounded-xl font-medium">
                Start Trip
              </button>

              <button className="border border-red-200 text-red-500 py-3 rounded-xl font-medium">
                Issue
              </button>

            </div>

          </div>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-2 gap-3">

          <div className="bg-white rounded-2xl border p-4">
            <FiNavigation className="text-blue-600 mb-3" />

            <p className="text-sm text-slate-500">
              Today's Trips
            </p>

            <h3 className="text-3xl font-bold">
              4
            </h3>
          </div>

          <div className="bg-white rounded-2xl border p-4">
            <FiMapPin className="text-blue-600 mb-3" />

            <p className="text-sm text-slate-500">
              Distance
            </p>

            <h3 className="text-3xl font-bold">
              124 km
            </h3>
          </div>

        </div>

        {/* Vehicle Card */}

        <div className="bg-white rounded-2xl border p-4">

          <div className="flex justify-between items-center mb-4">

            <h3 className="font-semibold">
              Assigned Vehicle
            </h3>

            <span className="text-xs px-2 py-1 bg-slate-100 rounded-full">
              Toyota Camry
            </span>

          </div>

          <div className="grid grid-cols-3 gap-3">

            <div className="border rounded-xl p-3 text-center">
              <FiDroplet className="mx-auto text-blue-600 mb-2" />
              <p className="font-bold">78%</p>
              <span className="text-xs text-slate-500">
                Fuel
              </span>
            </div>

            <div className="border rounded-xl p-3 text-center">
              <FiClock className="mx-auto text-slate-600 mb-2" />
              <p className="font-bold">24k</p>
              <span className="text-xs text-slate-500">
                Odo
              </span>
            </div>

            <div className="border rounded-xl p-3 text-center">
              <FiTruck className="mx-auto text-slate-600 mb-2" />
              <p className="font-bold">OK</p>
              <span className="text-xs text-slate-500">
                Health
              </span>
            </div>

          </div>

          <button className="w-full mt-4 text-blue-600 text-sm font-medium">
            View Maintenance Logs →
          </button>

        </div>

        {/* Schedule Timeline */}

        <div className="bg-white rounded-2xl border p-4">

          <h3 className="font-semibold mb-5">
            Daily Schedule
          </h3>

          <div className="space-y-5">

            <div className="flex gap-3">
              <div className="w-3 h-3 rounded-full bg-slate-300 mt-2"></div>

              <div>
                <h4 className="font-semibold">
                  Airport Terminal 2
                </h4>

                <p className="text-xs text-slate-500">
                  Pick up: Secretary of Transport
                </p>

                <span className="text-xs text-slate-400">
                  08:00 AM
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-600 mt-2"></div>

              <div>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  IN PROGRESS
                </span>

                <h4 className="font-semibold mt-2">
                  Ministry Headquarters
                </h4>

                <p className="text-xs text-slate-500">
                  Meeting drop-off
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-3 h-3 rounded-full bg-slate-300 mt-2"></div>

              <div>
                <h4 className="font-semibold">
                  Parliament House
                </h4>

                <p className="text-xs text-slate-500">
                  Return journey dispatch
                </p>

                <span className="text-xs text-slate-400">
                  05:15 PM
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Support */}

        <div className="bg-white border rounded-2xl p-4">

          <div className="flex gap-3">

            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <FiAlertTriangle />
            </div>

            <div>
              <h4 className="font-semibold">
                Need assistance?
              </h4>

              <p className="text-sm text-slate-500">
                Fleet support available 24/7
              </p>

              <p className="text-blue-600 font-medium mt-1">
                +1-800-VMS-CARE
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Navigation */}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3">

        <button className="flex flex-col items-center text-blue-600">
          <FiHome />
          <span className="text-xs mt-1">Home</span>
        </button>

        <button className="flex flex-col items-center text-slate-500">
          <FiNavigation />
          <span className="text-xs mt-1">Trips</span>
        </button>

        <button className="flex flex-col items-center text-slate-500">
          <FiTruck />
          <span className="text-xs mt-1">Vehicle</span>
        </button>

        <button className="flex flex-col items-center text-slate-500">
          <FiUser />
          <span className="text-xs mt-1">Profile</span>
        </button>

      </div>

      <div className="h-20"></div>

    </div>
  );
}