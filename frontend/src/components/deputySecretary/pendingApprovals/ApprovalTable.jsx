
import {
  FiSearch,
  FiFilter,
  FiMoreHorizontal,
} from "react-icons/fi";

const requests = [
  {
    id: "REQ-9012",
    requester: "Dr. Sarah Ahmed",
    department: "Ministry of Health",
    priority: "High",
    duration: "3 Days",
  },
  {
    id: "REQ-9015",
    requester: "James Wilson",
    department: "Dept. of Public Works",
    priority: "Medium",
    duration: "1 Day",
  },
  {
    id: "REQ-9018",
    requester: "Amara Kante",
    department: "Finance Ministry",
    priority: "Low",
    duration: "5 Days",
  },
  {
    id: "REQ-9021",
    requester: "Robert Chen",
    department: "Ministry of Education",
    priority: "High",
    duration: "2 Days",
  },
  {
    id: "REQ-9025",
    requester: "Elena Rodriguez",
    department: "Social Welfare Dept",
    priority: "Medium",
    duration: "1 Day",
  },
];

export default function ApprovalTable() {
  return (
    <div className="bg-white border rounded-2xl overflow-hidden">

      {/* Top */}
      <div className="p-5 border-b">

        <div className="flex justify-between items-center mb-4">

          <div>
            <h2 className="font-bold text-xl">
              Departmental Recommendations
            </h2>

            <p className="text-sm text-gray-500">
              Requests verified by Department Officers
            </p>
          </div>

          <div className="flex gap-3">

            <div className="relative">
              <FiSearch className="absolute left-3 top-3.5 text-gray-400" />

              <input
                type="text"
                placeholder="Search by ID or Requester..."
                className="border rounded-lg pl-10 py-2 pr-4"
              />
            </div>

            <button className="border px-4 rounded-lg flex items-center gap-2">
              <FiFilter />
              Filters
            </button>

            <button className="border px-4 rounded-lg">
              <FiMoreHorizontal />
            </button>

          </div>

        </div>

      </div>

      <table className="w-full">

        <thead className="bg-gray-50 border-b text-sm text-gray-600">
          <tr>
            <th className="p-4 text-left">Request ID</th>
            <th className="p-4 text-left">Requester</th>
            <th className="p-4 text-left">Department</th>
            <th className="p-4 text-left">Priority</th>
            <th className="p-4 text-left">Duration</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>

          {requests.map((item) => (
            <tr
              key={item.id}
              className="border-b hover:bg-slate-50"
            >
              <td className="p-4 text-blue-600 font-medium">
                {item.id}
              </td>

              <td className="p-4 font-medium">
                {item.requester}
              </td>

              <td className="p-4 text-gray-600">
                {item.department}
              </td>

              <td className="p-4">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.priority === "High"
                      ? "bg-red-50 text-red-600"
                      : item.priority === "Medium"
                      ? "bg-yellow-50 text-yellow-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.priority}
                </span>

              </td>

              <td className="p-4 text-gray-600">
                {item.duration}
              </td>

              <td className="p-4">

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Review & Assign
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

      <div className="p-4 flex justify-between items-center text-sm">

        <p className="text-gray-500">
          Showing 1 to 5 of 24 requests
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

    </div>
  );
}