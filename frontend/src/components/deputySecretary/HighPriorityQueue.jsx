import {
  FiArrowRight,
  FiAlertCircle,
  FiClock,
} from "react-icons/fi";

const requests = [
  {
    name: "Dr. Sarah Ahmed",
    department: "Public Health",
    priority: "High",
    time: "2h ago",
    id: "REQ-9842",
  },
  {
    name: "Mr. James Wilson",
    department: "Infrastructure",
    priority: "Medium",
    time: "4h ago",
    id: "REQ-9839",
  },
  {
    name: "Hon. Elena Rodriguez",
    department: "International Relations",
    priority: "Emergency",
    time: "5h ago",
    id: "REQ-9835",
  },
  {
    name: "Maj. David Chen",
    department: "Security Affairs",
    priority: "High",
    time: "6h ago",
    id: "REQ-9831",
  },
];

const getPriorityStyle = (priority) => {
  switch (priority) {
    case "Emergency":
      return "bg-red-50 text-red-700 border-red-200";

    case "High":
      return "bg-amber-50 text-amber-700 border-amber-200";

    default:
      return "bg-blue-50 text-blue-700 border-blue-200";
  }
};

export default function HighPriorityQueue() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">

        <div>

          <div className="flex items-center gap-2">

            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
              <FiAlertCircle className="text-red-600" />
            </div>

            <div>

              <h2 className="font-bold text-xl text-slate-900">
                High-Priority Queue
              </h2>

              <p className="text-sm text-slate-500">
                Requests awaiting executive approval
              </p>

            </div>

          </div>

        </div>

        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
          {requests.length} Pending
        </span>

      </div>

      {/* Requests */}
      <div className="space-y-3">

        {requests.map((item, index) => (
          <div
            key={index}
            className="group flex items-center justify-between rounded-2xl border border-slate-200 p-4 hover:border-blue-200 hover:bg-slate-50 transition"
          >

            <div className="flex items-center gap-4">

              {/* Avatar */}
              <img
                src={`https://i.pravatar.cc/100?img=${index + 10}`}
                alt={item.name}
                className="w-12 h-12 rounded-xl object-cover"
              />

              {/* Details */}
              <div>

                <div className="flex items-center gap-2 flex-wrap">

                  <h3 className="font-semibold text-slate-900">
                    {item.name}
                  </h3>

                  <span
                    className={`px-2 py-1 rounded-full text-[11px] border font-medium ${getPriorityStyle(
                      item.priority
                    )}`}
                  >
                    {item.priority}
                  </span>

                </div>

                <p className="text-sm text-slate-500">
                  {item.department}
                </p>

                <div className="flex items-center gap-3 mt-1">

                  <span className="text-xs font-medium text-blue-600">
                    {item.id}
                  </span>

                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <FiClock size={11} />
                    {item.time}
                  </span>

                </div>

              </div>

            </div>

            {/* Action */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-white hover:shadow-sm transition">

              Review

              <FiArrowRight size={14} />

            </button>

          </div>
        ))}

      </div>

      {/* Footer */}
      <div className="pt-5 mt-5 border-t border-slate-100">

        <button className="w-full rounded-2xl bg-slate-900 py-3 text-sm font-medium text-white hover:bg-slate-800 transition">
          View All Pending Requests
        </button>

      </div>

    </div>
  );
}