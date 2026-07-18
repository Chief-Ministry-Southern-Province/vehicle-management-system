import {
  FiCheckCircle,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiDroplet,
} from "react-icons/fi";

const logs = [
  {
    date: "Oct 24, 2024",
    vehicle: "GV-8821",
    model: "Toyota Land Cruiser",
    driver: "James Miller",
    liters: 46.5,
    price: 1.25,
    amount: 58.13,
    status: "Verified",
  },
  {
    date: "Oct 23, 2024",
    vehicle: "GV-4402",
    model: "Honda Accord",
    driver: "Robert Wilson",
    liters: 39.2,
    price: 1.21,
    amount: 47.43,
    status: "Verified",
  },
  {
    date: "Oct 22, 2024",
    vehicle: "GV-1193",
    model: "Mitsubishi Pajero",
    driver: "Michael Brown",
    liters: 12.5,
    price: 1.29,
    amount: 16.12,
    status: "Pending",
  },
  {
    date: "Oct 21, 2024",
    vehicle: "GV-7754",
    model: "Toyota Camry",
    driver: "James Miller",
    liters: 82,
    price: 1.25,
    amount: 102.5,
    status: "Verified",
  },
  {
    date: "Oct 20, 2024",
    vehicle: "GV-9921",
    model: "Toyota Hilux",
    driver: "Robert Wilson",
    liters: 42.2,
    price: 1.22,
    amount: 51.48,
    status: "Verified",
  },
];

export default function FuelTable() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4 text-left">Date</th>

              <th className="px-6 py-4 text-left">Vehicle</th>

              <th className="px-6 py-4 text-left">Driver</th>

              <th className="px-6 py-4 text-left">Fuel</th>

              <th className="px-6 py-4 text-left">Price/L</th>

              <th className="px-6 py-4 text-left">Amount</th>

              <th className="px-6 py-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log, index) => (
              <tr
                key={index}
                className="border-b border-slate-100 transition hover:bg-slate-50"
              >
                <td className="px-6 py-4 text-sm text-slate-600">{log.date}</td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FiDroplet size={18} />
                    </div>

                    <div>
                      <h4 className="font-medium text-blue-600">
                        {log.vehicle}
                      </h4>

                      <p className="text-xs text-slate-500">{log.model}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-slate-600">
                  {log.driver}
                </td>

                <td className="px-6 py-4">
                  <span className="font-medium text-slate-800">
                    {log.liters} L
                  </span>
                </td>

                <td className="px-6 py-4 text-slate-600">
                  ${log.price.toFixed(2)}
                </td>

                <td className="px-6 py-4">
                  <span className="font-semibold text-slate-900">
                    ${log.amount.toFixed(2)}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {log.status === "Verified" ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      <FiCheckCircle size={12} />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                      <FiClock size={12} />
                      Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
        <p className="text-sm text-slate-500">
          Showing 1–5 of 128 fuel records
        </p>

        <div className="flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50">
            <FiChevronLeft />
          </button>

          <button className="h-9 w-9 rounded-xl bg-blue-600 text-sm font-medium text-white">
            1
          </button>

          <button className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-sm">
            2
          </button>

          <button className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-sm">
            3
          </button>

          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50">
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
