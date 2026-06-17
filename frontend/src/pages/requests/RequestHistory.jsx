import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  FiSearch,
  FiCalendar,
  FiFilter,
  FiDownload,
  FiMoreHorizontal,
  FiPlus,
} from "react-icons/fi";

const requests = [
  {
    id: "REQ-8842",
    date: "2024-05-12",
    destination: "Central Secretariat",
    purpose: "Inter-departmental Meeting",
    pax: 3,
    priority: "HIGH",
    status: "Approved",
  },
  {
    id: "REQ-8840",
    date: "2024-05-10",
    destination: "State Guest House",
    purpose: "VIP Transport",
    pax: 1,
    priority: "MEDIUM",
    status: "Completed",
  },
  {
    id: "REQ-8835",
    date: "2024-05-08",
    destination: "Industrial Zone A",
    purpose: "Field Inspection",
    pax: 4,
    priority: "LOW",
    status: "Completed",
  },
  {
    id: "REQ-8831",
    date: "2024-05-05",
    destination: "Civil Hospital",
    purpose: "Health Audit",
    pax: 2,
    priority: "HIGH",
    status: "Pending",
  },
  {
    id: "REQ-8828",
    date: "2024-05-01",
    destination: "Digital Hub North",
    purpose: "IT Support Visit",
    pax: 2,
    priority: "MEDIUM",
    status: "Rejected",
  },
  {
    id: "REQ-8822",
    date: "2024-04-28",
    destination: "Ministry of Finance",
    purpose: "Budget Presentation",
    pax: 3,
    priority: "HIGH",
    status: "Completed",
  },
  {
    id: "REQ-8815",
    date: "2024-04-25",
    destination: "District Admin Office",
    purpose: "Public Hearing",
    pax: 5,
    priority: "LOW",
    status: "Cancelled",
  },
];

const statusColor = {
  Approved: "bg-green-100 text-green-700",
  Completed: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Rejected: "bg-red-100 text-red-700",
  Cancelled: "bg-gray-100 text-gray-700",
};

export default function RequestHistory() {
    const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Request History
            </h1>

            <p className="text-gray-500 mt-1">
              Monitor and manage your vehicle allocation requests.
            </p>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2">
            <FiPlus />
            Create New Request
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <div className="flex flex-col lg:flex-row gap-4">

            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />

              <input
                type="text"
                placeholder="Search by ID, destination or purpose..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg"
              />
            </div>

            <button className="border px-4 py-3 rounded-lg flex items-center gap-2">
              <FiCalendar />
              Last 30 Days
            </button>

            <button className="border px-4 py-3 rounded-lg flex items-center gap-2">
              <FiFilter />
              Status
            </button>

            <button className="border px-4 py-3 rounded-lg flex items-center gap-2">
              <FiDownload />
              Export Data
            </button>

          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-sm text-gray-600">
                  <th className="p-4">Request ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Destination</th>
                  <th className="p-4">Purpose</th>
                  <th className="p-4">Pax</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>

                {requests.map((request) => (
                  <tr
                    key={request.id}
                     //onClick={() => navigate(`/requests/${request.id}`)}
                     onClick={() => navigate(`/employee/requests/${request.id}`)}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <span className="text-blue-600 font-medium">
                        {request.id}
                      </span>
                    </td>

                    <td className="p-4 text-gray-600">
                      {request.date}
                    </td>

                    <td className="p-4">
                      {request.destination}
                    </td>

                    <td className="p-4 text-gray-600">
                      {request.purpose}
                    </td>

                    <td className="p-4 text-center">
                      {request.pax}
                    </td>

                    <td className="p-4">
                      <span
                        className={`font-semibold text-xs ${
                          request.priority === "HIGH"
                            ? "text-red-600"
                            : request.priority === "MEDIUM"
                            ? "text-gray-700"
                            : "text-gray-500"
                        }`}
                      >
                        ● {request.priority}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusColor[request.status]
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <button>
                        <FiMoreHorizontal />
                      </button>
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4 border-t">

            <p className="text-sm text-gray-500">
              Page 1 of 4
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

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-5">

          <div className="bg-blue-50 rounded-xl p-6">
            <p className="text-blue-600 text-sm font-medium">
              Approved This Month
            </p>

            <h2 className="text-3xl font-bold mt-2">
              12
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              +2 from previous month
            </p>
          </div>

          <div className="bg-cyan-50 rounded-xl p-6">
            <p className="text-cyan-600 text-sm font-medium">
              Avg. Processing Time
            </p>

            <h2 className="text-3xl font-bold mt-2">
              4.2 hrs
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Faster than department average
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-gray-600 text-sm font-medium">
              Rejected Requests
            </p>

            <h2 className="text-3xl font-bold mt-2">
              1
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Due to resource unavailability
            </p>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}