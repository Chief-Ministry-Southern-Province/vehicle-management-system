import {
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiTrendingUp,
} from "react-icons/fi";

const stats = [
  {
    title: "Pending Recommendations",
    value: "12",
    description: "4 requests pending over 24 hours",
    trend: "+18%",
    trendText: "vs last week",
    icon: FiClock,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    border: "border-blue-100",
  },
  {
    title: "High Priority Requests",
    value: "03",
    description: "Requires immediate recommendation",
    trend: "+2",
    trendText: "new today",
    icon: FiAlertCircle,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    border: "border-red-100",
  },
  {
    title: "Completed Today",
    value: "08",
    description: "Recommended / Rejected in last 24h",
    trend: "+24%",
    trendText: "efficiency increase",
    icon: FiCheckCircle,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    border: "border-green-100",
  },
];

export default function RecommendationStats() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div
            key={index}
            className={`relative overflow-hidden bg-white rounded-2xl border ${stat.border} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
          >
            {/* Top Accent Line */}
            <div className="h-1 bg-linear-to-r from-blue-500 to-cyan-400" />

            <div className="p-6">

              {/* Header */}
              <div className="flex justify-between items-start">

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>

                  <h2 className="text-4xl font-bold text-gray-900 mt-3">
                    {stat.value}
                  </h2>
                </div>

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.iconBg}`}
                >
                  <Icon
                    className={`text-2xl ${stat.iconColor}`}
                  />
                </div>

              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 mt-4">
                {stat.description}
              </p>

              {/* Trend */}
              <div className="flex items-center gap-2 mt-5">

                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                  <FiTrendingUp />
                  {stat.trend}
                </div>

                <span className="text-sm text-gray-400">
                  {stat.trendText}
                </span>

              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}