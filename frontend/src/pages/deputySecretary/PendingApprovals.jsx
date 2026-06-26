import DashboardLayout from "../../layouts/DashboardLayout";

import ApprovalStats from "../../components/deputySecretary/pendingApprovals/ApprovalStats";
import ApprovalTable from "../../components/deputySecretary/pendingApprovals/ApprovalTable";

import {
  FiClipboard,
  FiActivity,
} from "react-icons/fi";

export default function PendingApprovals() {
  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* Executive Header */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          {/* Decorative Elements */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-100 opacity-40 blur-3xl" />
          <div className="absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-indigo-100 opacity-30 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">

                <FiClipboard size={14} />

                Executive Actions

              </div>

              <h1 className="mt-4 text-4xl font-bold text-slate-900">
                Approval Queue
              </h1>

              <p className="mt-2 max-w-2xl text-slate-500">
                Review vehicle requests, approve allocations,
                and monitor operational readiness across departments.
              </p>

            </div>

            {/* Queue Status */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-5">

              <div className="flex items-center gap-2 text-emerald-600">

                <FiActivity />

                <span className="text-sm font-medium">
                  Live Queue Status
                </span>

              </div>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                24
              </h2>

              <p className="text-sm text-slate-500">
                Requests awaiting approval
              </p>

            </div>

          </div>

        </div>

        {/* KPI Cards */}
        <ApprovalStats />

        {/* Approval Table */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">

          <div className="border-b border-slate-100 px-6 py-4">

            <h2 className="font-semibold text-slate-900">
              Pending Request Allocations
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Requests submitted by departments awaiting approval.
            </p>

          </div>

          <ApprovalTable />

        </div>

      </div>

    </DashboardLayout>
  );
}