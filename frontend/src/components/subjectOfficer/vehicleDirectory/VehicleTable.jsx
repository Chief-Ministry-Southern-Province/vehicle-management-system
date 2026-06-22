import { FiMoreVertical } from "react-icons/fi";

const vehicles = [
  {
    reg: "GV-8821",
    name: "Toyota Land Cruiser",
    year: "2022",
    type: "SUV",
    status: "Available",
    service: "2023-11-15",
    fuel: 85,
  },
  {
    reg: "GV-4402",
    name: "Honda Accord",
    year: "2021",
    type: "Sedan",
    status: "In-Use",
    service: "2024-01-10",
    fuel: 45,
  },
  {
    reg: "GV-1193",
    name: "Mitsubishi Pajero",
    year: "2020",
    type: "SUV",
    status: "Maintenance",
    service: "2024-03-01",
    fuel: 10,
  },
  {
    reg: "GV-7754",
    name: "Toyota Camry",
    year: "2023",
    type: "Sedan",
    status: "Available",
    service: "2024-02-20",
    fuel: 92,
  },
  {
    reg: "GV-3325",
    name: "Nissan Patrol",
    year: "2019",
    type: "SUV",
    status: "In-Use",
    service: "2023-10-05",
    fuel: 30,
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Available":
      return "bg-green-100 text-green-700";

    case "In-Use":
      return "bg-blue-100 text-blue-700";

    case "Maintenance":
      return "bg-yellow-100 text-yellow-700";

    case "Out of Service":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100";
  }
};

export default function VehicleTable() {
  return (
    <>
      <table className="w-full">

        <thead className="bg-gray-50 border-b">

          <tr className="text-left text-sm text-gray-500">
            <th className="p-4">Reg. Number</th>
            <th>Vehicle Details</th>
            <th>Type</th>
            <th>Status</th>
            <th>Last Service</th>
            <th>Fuel</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {vehicles.map((vehicle) => (
            <tr
              key={vehicle.reg}
              className="border-b hover:bg-gray-50"
            >
              <td className="p-4 font-semibold text-blue-600">
                {vehicle.reg}
              </td>

              <td>
                <div>
                  <h4 className="font-medium">
                    {vehicle.name}
                  </h4>

                  <p className="text-sm text-gray-500">
                    Year: {vehicle.year}
                  </p>
                </div>
              </td>

              <td>{vehicle.type}</td>

              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                    vehicle.status
                  )}`}
                >
                  {vehicle.status}
                </span>
              </td>

              <td>{vehicle.service}</td>

              <td className="w-44">

                <div className="flex items-center gap-3">

                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">

                    <div
                      className={`h-full ${
                        vehicle.fuel < 20
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                      style={{
                        width: `${vehicle.fuel}%`,
                      }}
                    />

                  </div>

                  <span className="text-xs">
                    {vehicle.fuel}%
                  </span>

                </div>

              </td>

              <td>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <FiMoreVertical />
                </button>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

      {/* Pagination */}

      <div className="flex justify-between items-center p-5">

        <p className="text-sm text-gray-500">
          Showing 8 of 42 vehicles
        </p>

        <div className="flex gap-2">

          <button className="border px-3 py-1 rounded">
            Previous
          </button>

          <button className="bg-blue-600 text-white px-3 py-1 rounded">
            1
          </button>

          <button className="border px-3 py-1 rounded">
            2
          </button>

          <button className="border px-3 py-1 rounded">
            3
          </button>

          <button className="border px-3 py-1 rounded">
            Next
          </button>

        </div>

      </div>
    </>
  );
}