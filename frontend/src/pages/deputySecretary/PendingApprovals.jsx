import DashboardLayout from "../../layouts/DashboardLayout";


import {
  FiClipboard,
  FiActivity,
} from "react-icons/fi";
import ApprovalQueue from "../../components/deputySecretary/dashboard/ApprovalQueue";

export default function PendingApprovals() {
  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* Approval Table */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <ApprovalQueue />

        </div>

      </div>

    </DashboardLayout>
  );
}