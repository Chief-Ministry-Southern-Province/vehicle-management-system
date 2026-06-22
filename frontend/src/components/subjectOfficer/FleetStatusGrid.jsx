import {
  FiTruck,
  FiCheckCircle,
  FiTool,
  FiAlertTriangle,
} from "react-icons/fi";

const vehicles = [
  "KAA123A",
  "KAB456B",
  "KAC789C",
  "KAD012D",
  "KAE345E",
  "KAF678F",
  "KAG901G",
  "KAH234H",
  "KAI567I",
  "KAJ890J",
  "KAK123K",
  "KAL456L",
  "KAM789M",
  "KAN012N",
  "KAO345O",
  "KAP678P",
];

export default function FleetStatusGrid() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex justify-between items-center">
          
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Fleet Status Overview
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Real-time availability of government vehicles
            </p>
          </div>

          <div className="hidden md:flex gap-6 text-sm">
            <div>
              <p className="text-slate-500">Available</p>
              <p className="font-bold text-green-600">12</p>
            </div>

            <div>
              <p className="text-slate-500">Maintenance</p>
              <p className="font-bold text-amber-600">2</p>
            </div>

            <div>
              <p className="text-slate-500">Unavailable</p>
              <p className="font-bold text-red-600">2</p>
            </div>
          </div>

        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="p-6">

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">

          {vehicles.map((vehicle, index) => {
            const status =
              index % 7 === 0
                ? "maintenance"
                : index % 5 === 0
                ? "unavailable"
                : "available";

            return (
              <div
                key={vehicle}
                className="group bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="flex justify-between items-start">

                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      status === "available"
                        ? "bg-green-100 text-green-600"
                        : status === "maintenance"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    <FiTruck size={18} />
                  </div>

                  <span
                    className={`w-3 h-3 rounded-full ${
                      status === "available"
                        ? "bg-green-500"
                        : status === "maintenance"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                  />
                </div>

                <h3 className="font-semibold text-slate-800 mt-4">
                  {vehicle}
                </h3>

                <div className="mt-3">
                  {status === "available" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      <FiCheckCircle size={12} />
                      Available
                    </span>
                  )}

                  {status === "maintenance" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                      <FiTool size={12} />
                      Maintenance
                    </span>
                  )}

                  {status === "unavailable" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                      <FiAlertTriangle size={12} />
                      Unavailable
                    </span>
                  )}
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}