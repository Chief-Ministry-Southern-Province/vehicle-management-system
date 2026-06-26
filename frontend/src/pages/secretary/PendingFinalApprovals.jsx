import DashboardLayout from "../../layouts/DashboardLayout";

import ApprovalStats from "../../components/secretary/approvalCenter/ApprovalStats";
import ApprovalQueue from "../../components/secretary/approvalCenter/ApprovalQueue";

import { FiInfo, FiCheckCircle } from "react-icons/fi";

export default function PendingFinalApprovals() {
  return (
    <DashboardLayout>
      <div className="bg-slate-50 min-h-screen p-6">

        {/* Breadcrumb */}
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Executive Dashboard → Approval Center
        </p>

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center mt-3 mb-8">

          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Pending Final Sign-offs
            </h1>

            <p className="text-slate-500 mt-2">
              Perform executive review of departmental vehicle requests
              vetted by the Deputy Secretary.
            </p>
          </div>

          <div className="flex gap-3 mt-4 lg:mt-0">

            <button className="px-5 py-3 bg-white border rounded-xl flex items-center gap-2">
              <FiInfo />
              View Policy Guidelines
            </button>

            <button className="px-5 py-3 bg-blue-600 text-white rounded-xl flex items-center gap-2">
              <FiCheckCircle />
              Batch Approve (0)
            </button>

          </div>

        </div>

        <ApprovalStats />

        <div className="mt-6">
          <ApprovalQueue />
        </div>
      </div>
    </DashboardLayout>
  );
}