import {
  FiCheckCircle,
  FiClock,
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
    amount: 102.50,
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
    <>
      <table className="w-full">

        <thead className="bg-gray-50 border-b">

          <tr className="text-left text-sm text-gray-500">
            <th className="p-4">Date</th>
            <th>Vehicle</th>
            <th>Driver</th>
            <th>Liters</th>
            <th>Price/L</th>
            <th>Total Amount</th>
            <th>Status</th>
          </tr>

        </thead>

        <tbody>

          {logs.map((log, index) => (
            <tr
              key={index}
              className="border-b hover:bg-gray-50"
            >
              <td className="p-4">{log.date}</td>

              <td>
                <div>
                  <h4 className="font-medium text-blue-600">
                    {log.vehicle}
                  </h4>

                  <p className="text-sm text-gray-500">
                    {log.model}
                  </p>
                </div>
              </td>

              <td>{log.driver}</td>

              <td>{log.liters} L</td>

              <td>${log.price}</td>

              <td className="font-medium">
                ${log.amount}
              </td>

              <td>
                {log.status === "Verified" ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                    <FiCheckCircle />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-medium">
                    <FiClock />
                    Pending
                  </span>
                )}
              </td>

            </tr>
          ))}

        </tbody>

      </table>

      {/* Pagination */}

      <div className="flex justify-between items-center p-5">

        <p className="text-sm text-gray-500">
          Showing 5 of 128 records
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