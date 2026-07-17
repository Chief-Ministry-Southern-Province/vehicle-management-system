import {
  FiMoreHorizontal,
  FiTool,
  FiAlertTriangle,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

const services = [
  {
    id: "SR-1001",
    vehicle: "GV-9021",
    model: "Toyota Prado",
    type: "Major Service",
    vendor: "AutoTech Solutions",
    cost: "$850",
    due: "2024-05-15",
    status: "Overdue",
  },
  {
    id: "SR-1002",
    vehicle: "GV-4482",
    model: "Mitsubishi Montero",
    type: "Routine Maintenance",
    vendor: "City Garage Ltd",
    cost: "$350",
    due: "2024-05-22",
    status: "Due Soon",
  },
  {
    id: "SR-1003",
    vehicle: "GV-1109",
    model: "Hyundai Ioniq 5",
    type: "Battery Health Check",
    vendor: "EV Experts",
    cost: "$150",
    due: "2024-06-05",
    status: "Scheduled",
  },
];

export default function ServiceScheduleTable() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h3 className="font-semibold text-slate-900">Maintenance Schedule</h3>

          <p className="mt-1 text-sm text-slate-500">
            Upcoming and active vehicle service records
          </p>
        </div>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600">
          {services.length} Records
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4 text-left">ID</th>

              <th className="px-6 py-4 text-left">Vehicle</th>

              <th className="px-6 py-4 text-left">Service Type</th>

              <th className="px-6 py-4 text-left">Vendor</th>

              <th className="px-6 py-4 text-left">Cost</th>

              <th className="px-6 py-4 text-left">Due Date</th>

              <th className="px-6 py-4 text-left">Status</th>

              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 transition hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <span className="font-medium text-slate-700">{item.id}</span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FiTool size={18} />
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-900">
                        {item.vehicle}
                      </h4>

                      <p className="text-xs text-slate-500">{item.model}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-slate-600">
                  {item.type}
                </td>

                <td className="px-6 py-4 text-sm text-slate-600">
                  {item.vendor}
                </td>

                <td className="px-6 py-4 font-medium text-slate-900">
                  {item.cost}
                </td>

                <td className="px-6 py-4 text-sm text-slate-600">{item.due}</td>

                <td className="px-6 py-4">
                  {item.status === "Overdue" && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                      <FiAlertTriangle size={12} />
                      Overdue
                    </span>
                  )}

                  {item.status === "Due Soon" && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                      <FiClock size={12} />
                      Due Soon
                    </span>
                  )}

                  {item.status === "Scheduled" && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      <FiCheckCircle size={12} />
                      Scheduled
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-center">
                  <button className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100">
                    <FiMoreHorizontal />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
        <p className="text-sm text-slate-500">
          Showing 3 maintenance schedules
        </p>

        <div className="flex gap-2">
          <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50">
            Previous
          </button>

          <button className="rounded-xl bg-blue-600 px-3 py-2 text-sm text-white">
            1
          </button>

          <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
