import { FiEye, FiRotateCcw, FiChevronDown } from "react-icons/fi";

const requests = [
  {
    id: "REQ-9012",
    requester: "Dr. Sarah Ahmed",
    department: "Ministry of Health",
    vehicle: "Toyota Land Cruiser",
    driver: "Samuel Osei",
    priority: "High",
    cost: "$450",
  },
  {
    id: "REQ-9015",
    requester: "James Wilson",
    department: "Dept. of Public Works",
    vehicle: "Ford Ranger",
    driver: "Kojo Antwi",
    priority: "Medium",
    cost: "$125",
  },
  {
    id: "REQ-9018",
    requester: "Amara Kante",
    department: "Finance Ministry",
    vehicle: "Hyundai Elantra",
    driver: "David Mensah",
    priority: "Low",
    cost: "$890",
  },
  {
    id: "REQ-9021",
    requester: "Robert Chen",
    department: "Ministry of Education",
    vehicle: "Nissan Patrol",
    driver: "Abena Sarfo",
    priority: "High",
    cost: "$310",
  },
  {
    id: "REQ-9025",
    requester: "Elena Rodriguez",
    department: "Social Welfare Dept",
    vehicle: "Suzuki Vitara",
    driver: "Peter Opoku",
    priority: "Medium",
    cost: "$115",
  },
];

export default function ApprovalQueue() {
  return (
    <div className="bg-white border rounded-2xl overflow-hidden">

      <div className="p-6 border-b">

        <div className="flex justify-between items-center">

          <div>
            <h3 className="text-xl font-bold">
              Approval Queue
            </h3>

            <p className="text-sm text-slate-500">
              Select a request to view allocation logic and costs.
            </p>
          </div>

          <div className="flex gap-2">
            <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm">
              All Pending
            </button>

            <button className="border px-4 py-2 rounded-lg text-sm">
              High Priority
            </button>

            <button className="border px-4 py-2 rounded-lg text-sm">
              Cost Flagged
            </button>
          </div>

        </div>

      </div>

      <table className="w-full">

        <thead className="bg-slate-50">
          <tr className="text-left text-sm text-slate-600">
            <th className="p-4">Request ID</th>
            <th>Requester</th>
            <th>Department</th>
            <th>Deputy Allocation</th>
            <th>Priority</th>
            <th>Cost Est.</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {requests.map((item) => (
            <tr key={item.id} className="border-t hover:bg-slate-50">

              <td className="p-4 text-blue-600 font-medium">
                {item.id}
              </td>

              <td>{item.requester}</td>

              <td>{item.department}</td>

              <td>
                <div>
                  <p>{item.vehicle}</p>
                  <p className="text-xs text-slate-500">
                    {item.driver}
                  </p>
                </div>
              </td>

              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    item.priority === "High"
                      ? "bg-red-100 text-red-600"
                      : item.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.priority}
                </span>
              </td>

              <td className="font-semibold">
                {item.cost}
              </td>

              <td>
                <div className="flex gap-2">

                  <button className="p-2 border rounded-lg">
                    <FiEye />
                  </button>

                  <button className="px-3 py-2 border rounded-lg text-xs flex items-center gap-2">
                    <FiRotateCcw />
                    RETURN
                  </button>

                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs">
                    APPROVE
                  </button>

                  <button className="p-2">
                    <FiChevronDown />
                  </button>

                </div>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

      <div className="p-4 border-t flex justify-between items-center">

        <p className="text-sm text-slate-500">
          Showing 5 of 14 pending requests
        </p>

        <div className="flex gap-2">
          <button className="border px-3 py-2 rounded">
            Previous
          </button>

          <button className="bg-blue-600 text-white px-3 py-2 rounded">
            1
          </button>

          <button className="border px-3 py-2 rounded">
            2
          </button>

          <button className="border px-3 py-2 rounded">
            3
          </button>

          <button className="border px-3 py-2 rounded">
            Next
          </button>
        </div>

      </div>

    </div>
  );
}