import {
  FiMoreVertical,
  FiTruck,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const vehicles = [
  {
    reg: "GV-8821",
    name: "Toyota Land Cruiser",
    year: "2022",
    type: "SUV",
    status: "Available",
    service: "15 Nov 2025",
    fuel: 85,
  },
  {
    reg: "GV-4402",
    name: "Honda Accord",
    year: "2021",
    type: "Sedan",
    status: "In-Use",
    service: "10 Jan 2026",
    fuel: 45,
  },
  {
    reg: "GV-1193",
    name: "Mitsubishi Pajero",
    year: "2020",
    type: "SUV",
    status: "Maintenance",
    service: "01 Mar 2026",
    fuel: 10,
  },
  {
    reg: "GV-7754",
    name: "Toyota Camry",
    year: "2023",
    type: "Sedan",
    status: "Available",
    service: "20 Feb 2026",
    fuel: 92,
  },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "Available":
      return "bg-green-100 text-green-700";

    case "In-Use":
      return "bg-blue-100 text-blue-700";

    case "Maintenance":
      return "bg-amber-100 text-amber-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

export default function VehicleTable() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="w-full">

          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4 text-left">
                Registration
              </th>

              <th className="px-6 py-4 text-left">
                Vehicle
              </th>

              <th className="px-6 py-4 text-left">
                Type
              </th>

              <th className="px-6 py-4 text-left">
                Status
              </th>

              <th className="px-6 py-4 text-left">
                Last Service
              </th>

              <th className="px-6 py-4 text-left">
                Fuel Level
              </th>

              <th className="px-6 py-4 text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.reg}
                className="border-b border-slate-100 transition hover:bg-slate-50"
              >
                {/* Registration */}
                <td className="px-6 py-4">
                  <span className="font-semibold text-blue-600">
                    {vehicle.reg}
                  </span>
                </td>

                {/* Vehicle */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FiTruck size={18} />
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-800">
                        {vehicle.name}
                      </h4>

                      <p className="text-xs text-slate-500">
                        Year {vehicle.year}
                      </p>
                    </div>

                  </div>
                </td>

                {/* Type */}
                <td className="px-6 py-4 text-slate-600">
                  {vehicle.type}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                      vehicle.status
                    )}`}
                  >
                    {vehicle.status}
                  </span>
                </td>

                {/* Service */}
                <td className="px-6 py-4 text-slate-600">
                  {vehicle.service}
                </td>

                {/* Fuel */}
                <td className="px-6 py-4 w-56">
                  <div className="flex items-center gap-3">

                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full ${
                          vehicle.fuel < 20
                            ? "bg-red-500"
                            : vehicle.fuel < 50
                            ? "bg-amber-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${vehicle.fuel}%`,
                        }}
                      />
                    </div>

                    <span className="text-xs font-medium text-slate-600">
                      {vehicle.fuel}%
                    </span>

                  </div>
                </td>

                {/* Action */}
                <td className="px-6 py-4 text-center">
                  <button className="rounded-xl p-2 transition hover:bg-slate-100">
                    <FiMoreVertical />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Footer */}

      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">

        <p className="text-sm text-slate-500">
          Showing 1–8 of 42 vehicles
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