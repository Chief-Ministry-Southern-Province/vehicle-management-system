import DashboardLayout from "../../layouts/DashboardLayout";

import ExecutiveStats from "../../components/deputySecretary/ExecutiveStats";
import HighPriorityQueue from "../../components/deputySecretary/HighPriorityQueue";
import AllocationEfficiency from "../../components/deputySecretary/AllocationEfficiency";
import NotificationCard from "../../components/deputySecretary/NotificationCard";
import QuickActions from "../../components/deputySecretary/QuickActions";

import { FiFileText } from "react-icons/fi";

export default function DeputySecretaryDashboard() {
  return (
    <DashboardLayout>
      <div className="p-6 bg-slate-50 min-h-screen">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">

          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Executive Overview
            </h1>

            <p className="text-gray-500 mt-2">
              System summary and pending executive approvals for today.
            </p>
          </div>

          <div className="flex items-center gap-4">

            <div className="flex -space-x-3">
              <img
                src="https://i.pravatar.cc/40?img=1"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="https://i.pravatar.cc/40?img=2"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="https://i.pravatar.cc/40?img=3"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
            </div>

            <button className="flex items-center gap-2 px-5 py-3 bg-white border rounded-xl font-medium hover:bg-gray-50">
              <FiFileText />
              Generate Report
            </button>

          </div>

        </div>

        <ExecutiveStats />

        <div className="grid lg:grid-cols-2 gap-6 mt-6">

          <div>
            <HighPriorityQueue />
            <NotificationCard />
          </div>

          <AllocationEfficiency />

        </div>

        <QuickActions />

      </div>
    </DashboardLayout>
  );
}