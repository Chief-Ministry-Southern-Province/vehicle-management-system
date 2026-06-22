import {
  FiEdit,
  FiDownload,
  FiMapPin,
  FiCalendar,
  FiActivity,
} from "react-icons/fi";

export default function VehicleHeader() {
  return (
    <div className="bg-white border rounded-2xl p-6">

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Vehicle Image */}

        <div>
          <div className="relative overflow-hidden rounded-2xl border">

            <img
              src="https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200"
              alt="vehicle"
              className="w-full h-[320px] object-cover"
            />

            <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
              ID: VMS-2024-C342
            </span>

          </div>
        </div>

        {/* Details */}

        <div>

          <div className="flex justify-between">

            <div>

              <h1 className="text-5xl font-bold">
                KBA 452G
              </h1>

              <div className="flex gap-4 mt-3 text-gray-600 text-xl">
                <span>Toyota Camry Hybrid</span>
                <span>•</span>
                <span>White Pearl</span>
              </div>

              <p className="text-gray-500 mt-2">
                Model Year 2023
              </p>

            </div>

            <div className="flex gap-3">

              <button className="border px-4 py-3 rounded-xl flex items-center gap-2">
                <FiEdit />
                Edit Details
              </button>

              <button className="bg-blue-600 text-white px-4 py-3 rounded-xl flex items-center gap-2">
                <FiDownload />
                Export Log
              </button>

            </div>

          </div>

          {/* Stats */}

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-8">

            <div className="border rounded-xl p-4">
              <p className="text-xs text-gray-500">
                CURRENT STATUS
              </p>

              <h4 className="font-bold mt-2 text-green-600">
                Available
              </h4>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-xs text-gray-500">
                TOTAL ODOMETER
              </p>

              <h4 className="font-bold mt-2">
                45,230 km
              </h4>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-xs text-gray-500">
                ASSIGNED TO
              </p>

              <h4 className="font-bold mt-2">
                Public Works
              </h4>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-xs text-gray-500">
                LAST SERVICE
              </p>

              <h4 className="font-bold mt-2">
                10 Apr 2024
              </h4>
            </div>

          </div>

          {/* Health */}

          <div className="border rounded-xl p-5 mt-5">

            <div className="flex justify-between items-center">

              <div className="w-full">

                <div className="flex justify-between mb-2">

                  <span className="text-sm font-semibold text-blue-600">
                    HEALTH SCORE
                  </span>

                  <span className="font-bold text-blue-600">
                    92%
                  </span>

                </div>

                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-blue-600"
                    style={{ width: "92%" }}
                  />

                </div>

              </div>

              <div className="ml-8 text-sm text-gray-600 flex items-center gap-2">
                <FiActivity />
                No critical maintenance alerts
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}