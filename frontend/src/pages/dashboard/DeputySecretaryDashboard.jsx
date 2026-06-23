import DashboardLayout from "../../layouts/DashboardLayout";

import ExecutiveStats from "../../components/deputySecretary/ExecutiveStats";
import HighPriorityQueue from "../../components/deputySecretary/HighPriorityQueue";
import AllocationEfficiency from "../../components/deputySecretary/AllocationEfficiency";
import NotificationCard from "../../components/deputySecretary/NotificationCard";
import QuickActions from "../../components/deputySecretary/QuickActions";

import {
  FiFileText,
  FiShield,
} from "react-icons/fi";

export default function DeputySecretaryDashboard() {
  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* Premium Hero Header */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-blue-100 blur-3xl opacity-40" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-indigo-100 blur-3xl opacity-30" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">

                <FiShield size={14} />

                Deputy Secretary Console

              </div>

              <h1 className="mt-4 text-4xl font-bold text-slate-900">
                Executive Overview
              </h1>

              <p className="mt-2 max-w-2xl text-slate-500">
                Monitor vehicle allocations, review pending approvals,
                oversee fleet readiness and operational performance
                across all departments.
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

              <button className="flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800">

                <FiFileText />

                Generate Report

              </button>

            </div>

          </div>

        </div>

        {/* Executive KPI Cards */}
        <ExecutiveStats />

        {/* Main Section */}
        <div className="grid gap-6 xl:grid-cols-3">

          <div className="xl:col-span-2">
            <AllocationEfficiency />
          </div>

          <HighPriorityQueue />

        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 xl:grid-cols-3">

          <div className="xl:col-span-2">
            <QuickActions />
          </div>

          <NotificationCard />

        </div>

      </div>

    </DashboardLayout>
  );
}