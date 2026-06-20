import { FiMoreHorizontal } from "react-icons/fi";

const requests = [
  {
    id: "REQ-9012",
    employee: "Sarah Jenkins",
    vehicle: "Sedan",
    requestDate: "Oct 12, 2023",
    officer: "Michael Chen",
    status: "Approved",
    decisionDate: "Oct 14, 2023",
  },
  {
    id: "REQ-8945",
    employee: "David Okoro",
    vehicle: "SUV (4x4)",
    requestDate: "Oct 10, 2023",
    officer: "Michael Chen",
    status: "Rejected",
    decisionDate: "Oct 11, 2023",
  },
  {
    id: "REQ-8830",
    employee: "Elena Rodriguez",
    vehicle: "Electric Sedan",
    requestDate: "Oct 05, 2023",
    officer: "Sarah Jenkins",
    status: "Approved",
    decisionDate: "Oct 08, 2023",
  },
];

export default function HistoryTable() {
  return (
    <div className="bg-white border rounded-xl overflow-hidden">

      <div className="p-5 border-b">
        <h2 className="font-semibold text-xl">
          Request Archive
        </h2>

        <p className="text-sm text-gray-500">
          Departmental records scoped to active and past financial years.
        </p>
      </div>

      <table className="w-full">

        <thead className="bg-gray-50">
          <tr className="text-left text-sm text-gray-500">
            <th className="p-4">REQUEST ID</th>
            <th>EMPLOYEE NAME</th>
            <th>VEHICLE TYPE</th>
            <th>REQUEST DATE</th>
            <th>RECOMMENDED BY</th>
            <th>STATUS</th>
            <th>DECISION DATE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>

          {requests.map((item) => (
            <tr
              key={item.id}
              className="border-t hover:bg-gray-50"
            >
              <td className="p-4 font-medium">
                {item.id}
              </td>

              <td>{item.employee}</td>

              <td>{item.vehicle}</td>

              <td>{item.requestDate}</td>

              <td>{item.officer}</td>

              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    item.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>
              </td>

              <td>{item.decisionDate}</td>

              <td>
                <button>
                  <FiMoreHorizontal />
                </button>
              </td>
            </tr>
          ))}

        </tbody>

      </table>

      <div className="flex justify-between items-center p-4 border-t">

        <p className="text-sm text-gray-500">
          Showing 1 to 6 of 124 historical records
        </p>

        <div className="flex gap-2">

          <button className="border px-3 py-1 rounded">
            ‹
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
            ›
          </button>

        </div>

      </div>

    </div>
  );
}