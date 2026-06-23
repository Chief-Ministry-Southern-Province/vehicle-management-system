import {
  FiTool,
  FiAlertTriangle,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const repairs = [
  {
    vehicle: "GV-8842",
    model: "Toyota Hilux",
    type: "Engine Overhaul",
    severity: "Critical",
    cost: "$775.00",
    downtime: "5 Days",
    date: "Oct 12, 2023",
  },
  {
    vehicle: "GV-2109",
    model: "Nissan Navara",
    type: "Suspension Repair",
    severity: "Moderate",
    cost: "$320.00",
    downtime: "2 Days",
    date: "Oct 15, 2023",
  },
  {
    vehicle: "GV-5512",
    model: "Toyota Camry",
    type: "Body Work",
    severity: "Low",
    cost: "$150.00",
    downtime: "1 Day",
    date: "Oct 18, 2023",
  },
  {
    vehicle: "GV-9003",
    model: "Isuzu D-Max",
    type: "Brake System",
    severity: "Critical",
    cost: "$480.00",
    downtime: "3 Days",
    date: "Oct 20, 2023",
  },
];

export default function RepairTable() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">

        <div>
          <h3 className="font-semibold text-slate-900">
            Repair Records
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Track vehicle repair history and workshop activities.
          </p>
        </div>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          {repairs.length} Records
        </span>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">

              <th className="px-6 py-4 text-left">
                Vehicle
              </th>

              <th className="px-6 py-4 text-left">
                Repair Type
              </th>

              <th className="px-6 py-4 text-left">
                Severity
              </th>

              <th className="px-6 py-4 text-left">
                Cost
              </th>

              <th className="px-6 py-4 text-left">
                Downtime
              </th>

              <th className="px-6 py-4 text-left">
                Date
              </th>

            </tr>
          </thead>

          <tbody>

            {repairs.map((item, index) => (
              <tr
                key={index}
                className="border-b border-slate-100 transition hover:bg-slate-50"
              >

                <td className="px-6 py-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FiTool size={18} />
                    </div>

                    <div>

                      <h4 className="font-medium text-slate-900">
                        {item.vehicle}
                      </h4>

                      <p className="text-xs text-slate-500">
                        {item.model}
                      </p>

                    </div>

                  </div>

                </td>

                <td className="px-6 py-4 text-sm text-slate-600">
                  {item.type}
                </td>

                <td className="px-6 py-4">

                  {item.severity === "Critical" && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                      <FiAlertTriangle size={12} />
                      Critical
                    </span>
                  )}

                  {item.severity === "Moderate" && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                      <FiClock size={12} />
                      Moderate
                    </span>
                  )}

                  {item.severity === "Low" && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      Low
                    </span>
                  )}

                </td>

                <td className="px-6 py-4 font-medium text-slate-900">
                  {item.cost}
                </td>

                <td className="px-6 py-4 text-sm text-slate-600">
                  {item.downtime}
                </td>

                <td className="px-6 py-4 text-sm text-slate-600">
                  {item.date}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">

        <p className="text-sm text-slate-500">
          Showing 1–4 of 42 repair records
        </p>

        <div className="flex items-center gap-2">

          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50">
            <FiChevronLeft />
          </button>

          <button className="h-9 w-9 rounded-xl bg-blue-600 text-sm font-medium text-white">
            1
          </button>

          <button className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-sm">
            2
          </button>

          <button className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-sm">
            3
          </button>

          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50">
            <FiChevronRight />
          </button>

        </div>

      </div>

    </div>
  );
}