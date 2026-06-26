import DashboardLayout from "../../layouts/DashboardLayout";

import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiPlus,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import RecentActivity from "../../components/employee/RecentActivity";

const weeklyUsageData = [
  { day: "Mon", hours: 4.2 },
  { day: "Tue", hours: 6.1 },
  { day: "Wed", hours: 2.0 },
  { day: "Thu", hours: 8.2 },
  { day: "Fri", hours: 4.8 },
  { day: "Sat", hours: 1.1 },
  { day: "Sun", hours: 0.4 },
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
  const navigate = useNavigate();

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

          <button 
            onClick={() => navigate('/createvehiclerequest')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
          >
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
          <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 ">
            <RecentActivity />
          </div>
          

          {/* Right Side Cards */}
          <div className="space-y-6">

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
      </div>
    </DashboardLayout>
  );
}