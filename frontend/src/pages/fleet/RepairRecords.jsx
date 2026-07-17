import DashboardLayout from "../../layouts/DashboardLayout";
import RepairFilters from "../../components/subjectOfficer/repair/RepairFilters";
import RepairTable from "../../components/subjectOfficer/repair/RepairTable";
import RepairSidebar from "../../components/subjectOfficer/repair/RepairSidebar";
import RepairStats from "../../components/subjectOfficer/repair/RepairStats";
export default function RepairRecords() {
  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Repair Records</h1>

            <p className="text-gray-500 mt-1">
              Manage ad-hoc maintenance logs, breakdown reports, and repair
              invoices.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="px-5 py-3 border rounded-xl font-medium">
              Export PDF
            </button>

            <button className="px-5 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
              + Log New Repair
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 space-y-5">
            <RepairFilters />
            <RepairTable />
            <RepairStats />
          </div>

          <div className="col-span-4">
            <RepairSidebar />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
