import {
  FiDroplet,
  FiTruck,
  FiTrendingUp,
  FiArrowRight,
} from "react-icons/fi";

export default function FuelLogs() {
  const logs = [
    {
      vehicle: "KAA 123A",
      fuel: "42.5 L",
      cost: "$58.40",
      status: "Normal",
    },
    {
      vehicle: "KAB 456B",
      fuel: "30.0 L",
      cost: "$41.20",
      status: "Efficient",
    },
    {
      vehicle: "KAE 345E",
      fuel: "55.2 L",
      cost: "$76.10",
      status: "High Usage",
    },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
            <FiDroplet size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Fuel Consumption
            </h2>

            <p className="text-sm text-slate-500">
              Recent refueling transactions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1.5">
          <FiTrendingUp className="text-green-600" size={14} />
          <span className="text-xs font-medium text-green-600">
            +12.4%
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 px-6 pt-5">
        <div className="rounded-2xl bg-cyan-50 p-4">
          <p className="text-sm text-slate-500">
            Fuel Consumed
          </p>

          <h3 className="mt-1 text-2xl font-bold text-cyan-600">
            127.7 L
          </h3>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4">
          <p className="text-sm text-slate-500">
            Total Cost
          </p>

          <h3 className="mt-1 text-2xl font-bold text-blue-600">
            $175.70
          </h3>
        </div>
      </div>

      {/* Fuel Logs */}
      <div className="p-6 space-y-3">
        {logs.map((log) => (
          <div
            key={log.vehicle}
            className="group rounded-2xl border border-slate-100 bg-gradient-to-r from-white to-slate-50 p-4 transition-all duration-300 hover:border-slate-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">

              {/* Vehicle Info */}
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <FiTruck size={18} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    {log.vehicle}
                  </h3>

                  <p className="text-sm text-slate-500">
                    Fuel Added: {log.fuel}
                  </p>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-4">

                <div className="text-right">
                  <p className="font-bold text-slate-800">
                    {log.cost}
                  </p>

                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      log.status === "Efficient"
                        ? "bg-green-100 text-green-600"
                        : log.status === "High Usage"
                        ? "bg-red-100 text-red-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {log.status}
                  </span>
                </div>

                <FiArrowRight className="text-slate-400 transition-transform group-hover:translate-x-1" />
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 bg-slate-50 px-6 py-3">
        <button className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 transition">
          View Fuel History
        </button>
      </div>

    </div>
  );
}