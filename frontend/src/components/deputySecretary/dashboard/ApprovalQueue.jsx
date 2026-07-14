import {
  FiFilter,
  FiChevronRight,
  FiArrowRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ApprovalQueue({ requests = [], loading = false, error = "" }) {
  const navigate = useNavigate();

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-700 border border-red-200";

      case "high":
        return "bg-orange-100 text-orange-700 border border-orange-200";

      case "medium":
        return "bg-amber-100 text-amber-700 border border-amber-200";

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
                onClick={() => navigate(`/approval/${item.id}`)}
                className="cursor-pointer border-t border-slate-100 transition-all duration-200 hover:bg-blue-50/40"
              >

                <td className="px-6 py-5">

                  <span className="font-semibold text-blue-600">
                    REQ-{String(item.id).padStart(4, "0")}
                  </span>

                </td>

                <td className="px-6 py-5">

                  <div>

                    <p className="font-semibold text-slate-800">
                      {item.requester_name || item.user?.name || "Unknown requester"}
                    </p>

                    <p className="text-xs text-slate-500">
                      {item.user?.employee_id || "Government Employee"}
                    </p>

                  </div>

                </td>

                <td className="px-6 py-5 text-slate-600">
                  {item.user?.department || "Not specified"}
                </td>

                <td className="px-6 py-5">

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                      item.department_priority
                    )}`}
                  >
                    {item.department_priority ? item.department_priority.replace("_", " ") : "Not set"}
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

      {loading && <div className="border-t border-slate-100 px-6 py-10 text-center text-sm text-slate-500">Loading requests...</div>}
      {!loading && error && <div className="border-t border-red-100 bg-red-50 px-6 py-4 text-sm text-red-700">{error}</div>}
      {!loading && !error && requests.length === 0 && <div className="border-t border-slate-100 px-6 py-10 text-center text-sm text-slate-500">No vehicle requests found.</div>}

      {/* Footer */}

      <div className="flex items-center justify-between border-t bg-slate-50 px-6 py-4">

        <p className="text-sm text-slate-500">
          Showing <span className="font-semibold">{requests.length}</span> request{requests.length === 1 ? "" : "s"}
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
