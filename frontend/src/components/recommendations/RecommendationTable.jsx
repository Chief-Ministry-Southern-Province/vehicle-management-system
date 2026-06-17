import { FiEye } from "react-icons/fi";

const requests = [
  {
    name: "Dr. Sarah Chen",
    role: "Senior Researcher",
    priority: "High",
    destination: "Northern Wetlands Base",
    purpose: "Urgent site visit",
    pax: 3,
    date: "Oct 24, 2024",
  },
  {
    name: "Mark Thompson",
    role: "Regional Coordinator",
    priority: "Medium",
    destination: "Central District Office",
    purpose: "Routine inspection",
    pax: 2,
    date: "Oct 25, 2024",
  },
  {
    name: "Elena Rodriguez",
    role: "Public Liaison Officer",
    priority: "Low",
    destination: "Central Park Metro",
    purpose: "Community outreach",
    pax: 5,
    date: "Oct 25, 2024",
  },
];

export default function RecommendationTable() {
  return (
    <div className="bg-white border rounded-xl overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-50 border-b">
          <tr className="text-left text-sm text-gray-600">
            <th className="p-4">Requester</th>
            <th className="p-4">Priority</th>
            <th className="p-4">Purpose & Destination</th>
            <th className="p-4">Requested Date</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>

          {requests.map((item, index) => (
            <tr
              key={index}
              className="border-b hover:bg-gray-50"
            >
              <td className="p-4">
                <h3 className="font-medium">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {item.role}
                </p>
              </td>

              <td className="p-4">
                <span className="px-3 py-1 rounded-full bg-gray-100 text-xs">
                  {item.priority}
                </span>
              </td>

              <td className="p-4">
                <h4>{item.purpose}</h4>

                <p className="text-sm text-gray-500">
                  {item.destination}
                </p>

                <span className="text-xs text-blue-600">
                  {item.pax} pax
                </span>
              </td>

              <td className="p-4">
                {item.date}
              </td>

              <td className="p-4">
                <button className="border px-3 py-2 rounded-lg flex items-center gap-2">
                  <FiEye />
                  Review
                </button>
              </td>
            </tr>
          ))}

        </tbody>

      </table>

      <div className="flex justify-between p-4">
        <p className="text-sm text-gray-500">
          Showing 5 of 12 pending requests
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
            Next
          </button>
        </div>
      </div>

    </div>
  );
}