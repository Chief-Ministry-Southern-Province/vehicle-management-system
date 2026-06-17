import DashboardLayout from "../../layouts/DashboardLayout";

import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiPlus,
} from "react-icons/fi";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

const trendData = [
  { month: "Jan", total: 4, approved: 3 },
  { month: "Feb", total: 7, approved: 5 },
  { month: "Mar", total: 5, approved: 4 },
  { month: "Apr", total: 12, approved: 10 },
  { month: "May", total: 8, approved: 7 },
  { month: "Jun", total: 15, approved: 12 },
];

const weeklyUsageData = [
  { day: "Mon", hours: 4.2 },
  { day: "Tue", hours: 6.1 },
  { day: "Wed", hours: 2.0 },
  { day: "Thu", hours: 8.2 },
  { day: "Fri", hours: 4.8 },
  { day: "Sat", hours: 1.1 },
  { day: "Sun", hours: 0.4 },
];

const activities = [
  {
    title: "Request #REQ-8829 Allocated",
    description: "Toyota Prius assigned for Field Visit",
    time: "2 hours ago",
  },
  {
    title: "Request #REQ-8830 Approved",
    description: "Approved travel to Regional Office",
    time: "5 hours ago",
  },
  {
    title: "New Request Submitted",
    description: "Awaiting department recommendation",
    time: "Yesterday",
  },
  {
    title: "Request #REQ-8821 Rejected",
    description: "Vehicle unavailable for requested period",
    time: "2 days ago",
  },
  {
    title: "Journey Completed",
    description: "Trip to Ministry HQ completed successfully",
    time: "3 days ago",
  },
];

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-sm">{title}</span>

        <div className={`text-xl ${color}`}>
          {icon}
        </div>
      </div>

      <h2 className="text-3xl font-bold mt-4">{value}</h2>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, Jane!
            </h1>

            <p className="text-gray-500 mt-1">
              Here is what's happening with your transport requests today.
            </p>
          </div>

          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition">
            <FiPlus />
            Create New Request
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            title="Pending Requests"
            value="3"
            icon={<FiClock />}
            color="text-orange-500"
          />

          <StatCard
            title="Approved"
            value="12"
            icon={<FiCheckCircle />}
            color="text-green-500"
          />

          <StatCard
            title="Rejected"
            value="1"
            icon={<FiXCircle />}
            color="text-red-500"
          />

          <StatCard
            title="Upcoming Allocations"
            value="2"
            icon={<FiCalendar />}
            color="text-blue-500"
          />
        </div>

        {/* Activity Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Recent Activity */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-semibold text-lg">
                  Recent Activity
                </h2>

                <p className="text-sm text-gray-500">
                  Track the status of your vehicle requests
                </p>
              </div>

              <button className="text-blue-600 text-sm hover:text-blue-700">
                View All →
              </button>
            </div>

            <div className="space-y-5">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-4 last:border-0"
                >
                  <h3 className="font-medium text-gray-800">
                    {activity.title}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    {activity.description}
                  </p>

                  <span className="text-xs text-gray-400">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Cards */}
          <div className="space-y-6">

            {/* Create Request Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full">
                Priority Feature
              </span>

              <h2 className="text-xl font-bold mt-4">
                Need a vehicle?
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Submit a new request for department approval.
              </p>

              <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition">
                Create New Request
              </button>
            </div>

            {/* Weekly Usage */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-lg">
                Weekly Usage
              </h2>

              <p className="text-sm text-gray-500 mb-4">
                Hours utilized this week
              </p>

              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyUsageData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />

                  <Bar
                    dataKey="hours"
                    fill="#22D3EE"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>

              <div className="flex justify-between mt-4">
                <div>
                  <p className="font-bold">28.9 hrs</p>
                  <p className="text-xs text-gray-500">
                    Total Weekly
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-green-600">
                    +12%
                  </p>

                  <p className="text-xs text-gray-500">
                    vs Last Week
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Request Trends */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="mb-5">
            <h2 className="font-semibold text-lg">
              Request Trends
            </h2>

            <p className="text-sm text-gray-500">
              Frequency of requests and approvals over the last 6 months
            </p>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="total"
                stroke="#2563EB"
                strokeWidth={3}
                name="Total Requests"
              />

              <Line
                type="monotone"
                dataKey="approved"
                stroke="#16A34A"
                strokeWidth={3}
                name="Approved Requests"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </DashboardLayout>
  );
}