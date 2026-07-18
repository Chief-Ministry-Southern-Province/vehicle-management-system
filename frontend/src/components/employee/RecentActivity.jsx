import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiMapPin,
} from "react-icons/fi";

const activities = [
  {
    id: "REQ-8830",
    title: "Request Approved",
    description: "Travel request approved by Department Head",
    time: "5 hours ago",
    status: "approved",
  },
  {
    id: "REQ-8832",
    title: "Request Submitted",
    description: "Waiting for Department Recommendation",
    time: "Yesterday",
    status: "pending",
  },
  {
    id: "REQ-8821",
    title: "Request Rejected",
    description: "Vehicle unavailable for requested period",
    time: "2 days ago",
    status: "pending",
  },
  {
    id: "REQ-8818",
    title: "Journey Completed",
    description: "Official visit completed successfully",
    time: "3 days ago",
    status: "pending",
  },
  //    {
  //     id: "REQ-8829",
  //     title: "Vehicle Allocated",
  //     description: "Toyota Prius assigned for Field Visit",
  //     time: "2 hours ago",
  //     status: "approved",
  //   },
];

const statusStyles = {
  approved: {
    icon: <FiCheckCircle size={18} />,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    badge: "bg-emerald-50 text-emerald-700",
    line: "bg-emerald-400",
    label: "Approved",
  },

  pending: {
    icon: <FiClock size={18} />,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    badge: "bg-amber-50 text-amber-700",
    line: "bg-amber-400",
    label: "Pending",
  },

  rejected: {
    icon: <FiXCircle size={18} />,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    badge: "bg-red-50 text-red-700",
    line: "bg-red-400",
    label: "Rejected",
  },

  completed: {
    icon: <FiMapPin size={18} />,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badge: "bg-blue-50 text-blue-700",
    line: "bg-blue-400",
    label: "Completed",
  },
};

export default function RecentActivity() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest updates from your transport requests
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100">
          View All
          <FiArrowRight size={16} />
        </button>
      </div>

      {/* Timeline */}

      <div className="p-6">
        <div className="space-y-5">
          {activities.map((activity, index) => {
            const style = statusStyles[activity.status];

            return (
              <div
                key={activity.id}
                className="group relative flex gap-5 rounded-2xl border border-slate-100 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-slate-50 hover:shadow-lg"
              >
                {/* Timeline */}

                <div className="relative flex flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${style.iconBg} ${style.iconColor}`}
                  >
                    {style.icon}
                  </div>

                  {index !== activities.length - 1 && (
                    <div
                      className={`mt-2 h-12 w-1 rounded-full ${style.line}`}
                    />
                  )}
                </div>

                {/* Content */}

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {activity.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {activity.description}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}
                    >
                      {style.label}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {activity.id}
                    </span>

                    <span className="text-xs text-slate-400">
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
