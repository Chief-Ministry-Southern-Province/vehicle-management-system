import {
  FiFilter,
  FiChevronRight,
  FiArrowRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-700 border border-red-200";

      case "High":
        return "bg-orange-100 text-orange-700 border border-orange-200";

      default:
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-5 border-b bg-gradient-to-r from-slate-50 to-white">

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Approval Queue
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Review pending transport requests and allocate vehicles.
          </p>
        </div>

        <button
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
        >
          <FiFilter />

          Filters
        </button>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr className="text-left text-xs uppercase tracking-wider text-slate-500">

              <th className="px-6 py-4 font-semibold">
                Request ID
              </th>

              <th className="px-6 py-4 font-semibold">
                Requester
              </th>

              <th className="px-6 py-4 font-semibold">
                Department
              </th>

              <th className="px-6 py-4 font-semibold">
                Priority
              </th>

              <th className="px-6 py-4 text-center font-semibold">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {requests.map((item) => (

              <tr
                key={item.id}
                onClick={() => navigate("/approval/:id")}
                className="cursor-pointer border-t border-slate-100 transition-all duration-200 hover:bg-blue-50/40"
              >

                <td className="px-6 py-5">

                  <span className="font-semibold text-blue-600">
                    {item.id}
                  </span>

                </td>

                <td className="px-6 py-5">

                  <div>

                    <p className="font-semibold text-slate-800">
                      {item.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      Government Employee
                    </p>

                  </div>

                </td>

                <td className="px-6 py-5 text-slate-600">
                  {item.dept}
                </td>

                <td className="px-6 py-5">

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                      item.priority
                    )}`}
                  >
                    {item.priority}
                  </span>

                </td>

                <td className="px-6 py-5">

                  <div className="flex justify-center">

                    <button
                      className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow transition-all duration-300 hover:shadow-lg hover:scale-105"
                    >
                      Review

                      <FiChevronRight className="transition-transform group-hover:translate-x-1" />

                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Footer */}

      <div className="flex items-center justify-between border-t bg-slate-50 px-6 py-4">

        <p className="text-sm text-slate-500">
          Showing <span className="font-semibold">5</span> of{" "}
          <span className="font-semibold">156</span> requests
        </p>

        <button
          className="group flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          View All Requests

          <FiArrowRight className="transition-transform group-hover:translate-x-1" />

        </button>

      </div>

    </div>
  );
}