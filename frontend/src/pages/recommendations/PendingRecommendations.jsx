import DashboardLayout from "../../layouts/DashboardLayout";
import PendingRequestsTable from "../../components/departmentOfficer/PendingRequestsTable";
export default function PendingRecommendations() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <PendingRequestsTable />
      </div>
    </DashboardLayout>
  );
}
