import {
  FiCalendar,
  FiClock,
  FiArrowRight,
  FiMapPin,
} from "react-icons/fi";

export default function TodayAssignments() {
  const assignments = [
    {
      title: "VIP Convoy",
      time: "08:00 AM",
      location: "Government Secretariat",
      status: "Completed",
    },
    {
      title: "Airport Transfer",
      time: "11:30 AM",
      location: "Bandaranaike Airport",
      status: "In Progress",
    },
    {
      title: "Dept. Inspection",
      time: "02:15 PM",
      location: "Regional Office",
      status: "Upcoming",
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Today's Assignments
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Scheduled vehicle deployments
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
          <FiCalendar className="text-blue-600" size={14} />
          <span className="text-xs font-medium text-blue-600">
            3 Tasks
          </span>
        </div>
      </div>

      {/* Assignment List */}
      <div className="p-4 space-y-3">
        {assignments.map((item) => (
          <div
            key={item.title}
            className="group rounded-2xl border border-slate-100 bg-gradient-to-r from-white to-slate-50 p-4 transition-all duration-300 hover:border-slate-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">

              {/* Left Section */}
              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FiCalendar size={18} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <FiClock size={12} />
                    {item.time}
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <FiMapPin size={12} />
                    {item.location}
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === "Completed"
                      ? "bg-green-100 text-green-600"
                      : item.status === "In Progress"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {item.status}
                </span>

                <FiArrowRight className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
        <button className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 transition">
          View Full Schedule
        </button>
      </div>
    </div>
  );
}