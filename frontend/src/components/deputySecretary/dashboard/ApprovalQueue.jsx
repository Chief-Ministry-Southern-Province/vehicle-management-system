import {
  FiFilter,
  FiChevronDown,
} from "react-icons/fi";

const requests = [
  {
    id: "REQ-9012",
    name: "Dr. Sarah Ahmed",
    dept: "Ministry of Health",
    priority: "Urgent",
  },
  {
    id: "REQ-9015",
    name: "James Wilson",
    dept: "Dept. Public Works",
    priority: "High",
  },
  {
    id: "REQ-9018",
    name: "Amara Kante",
    dept: "Finance Ministry",
    priority: "Normal",
  },
  {
    id: "REQ-9021",
    name: "Robert Chen",
    dept: "Education",
    priority: "High",
  },
  {
    id: "REQ-9025",
    name: "Elena Rodriguez",
    dept: "Social Welfare",
    priority: "Normal",
  },
];

export default function ApprovalQueue() {
  return (
    <div className="bg-white border rounded-2xl overflow-hidden">

      <div className="p-5 border-b flex justify-between">

        <div>
          <h2 className="text-2xl font-bold">
            Approval Queue
          </h2>

          <p className="text-gray-500 text-sm">
            Review and allocate vehicles
          </p>
        </div>

        <button className="border rounded-lg px-4 py-2 flex items-center gap-2">
          <FiFilter />
          Filters
        </button>

      </div>

      <table className="w-full">

        <thead className="bg-gray-50 text-sm">
          <tr>
            <th className="p-4 text-left">ID</th>
            <th className="p-4 text-left">Requester</th>
            <th className="p-4 text-left">Department</th>
            <th className="p-4 text-left">Priority</th>
            <th className="p-4 text-left">Action</th>
          </tr>
        </thead>

        <tbody>

          {requests.map((item) => (
            <tr
              key={item.id}
              className="border-t hover:bg-slate-50"
            >
              <td className="p-4 text-blue-600 font-medium">
                {item.id}
              </td>

              <td className="p-4 font-medium">
                {item.name}
              </td>

              <td className="p-4">
                {item.dept}
              </td>

              <td className="p-4">
                <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs">
                  {item.priority}
                </span>
              </td>

              <td className="p-4">
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
                  Review
                  <FiChevronDown />
                </button>
              </td>
            </tr>
          ))}

        </tbody>

      </table>

      <div className="p-5 text-center">
        <button className="text-blue-600 font-medium">
          View All 156 Historical Requests →
        </button>
      </div>

    </div>
  );
}