const repairs = [
  {
    vehicle: "GV-8842 (Toyota Hilux)",
    type: "Engine Overhaul",
    severity: "Critical",
    cost: "$775.00",
    downtime: "5 Days",
    date: "Oct 12, 2023",
  },
  {
    vehicle: "GV-2109 (Nissan Navara)",
    type: "Suspension Repair",
    severity: "Moderate",
    cost: "$320.00",
    downtime: "2 Days",
    date: "Oct 15, 2023",
  },
  {
    vehicle: "GV-5512 (Toyota Camry)",
    type: "Body Work",
    severity: "Low",
    cost: "$150.00",
    downtime: "1 Day",
    date: "Oct 18, 2023",
  },
  {
    vehicle: "GV-9003 (Isuzu D-Max)",
    type: "Brake System",
    severity: "Critical",
    cost: "$480.00",
    downtime: "3 Days",
    date: "Oct 20, 2023",
  },
];

export default function RepairTable() {
  return (
    <div className="bg-white border rounded-xl overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-50 border-b">
          <tr className="text-left text-sm text-gray-500">
            <th className="p-4">Vehicle</th>
            <th>Repair Type</th>
            <th>Severity</th>
            <th>Cost</th>
            <th>Downtime</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>

          {repairs.map((item, index) => (
            <tr
              key={index}
              className="border-b hover:bg-gray-50"
            >
              <td className="p-4 font-medium">
                {item.vehicle}
              </td>

              <td>{item.type}</td>

              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    item.severity === "Critical"
                      ? "bg-red-100 text-red-600"
                      : item.severity === "Moderate"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.severity}
                </span>
              </td>

              <td>{item.cost}</td>

              <td>{item.downtime}</td>

              <td>{item.date}</td>
            </tr>
          ))}

        </tbody>
      </table>

      <div className="p-4 flex justify-between">
        <span className="text-sm text-gray-500">
          Showing 5 of 42 records
        </span>

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
            Next
          </button>
        </div>
      </div>
    </div>
  );
}