import { FiDownload } from "react-icons/fi";
import DashboardLayout from "../../layouts/DashboardLayout";
import HistoryStats from "../../components/departmentOfficer/history/HistoryStats";
import HistoryFilters from "../../components/departmentOfficer/history/HistoryFilter";
import HistoryTable from "../../components/departmentOfficer/history/HistoryTable";
import AuditCard from "../../components/departmentOfficer/history/AuditCard";

export default function DepartmentRequestHistory() {
    return (

        <DashboardLayout>
            <div className="space-y-6">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Request History
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Monitor and manage your vehicle allocation requests.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 border px-4 py-2 rounded-xl hover:bg-gray-50">
                            <FiDownload />
                            Export Archive (.XLSX)
                        </button>
                        <button className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700">
                            Review Pending Requests
                        </button>
                    </div>
                </div>

                <HistoryStats />
                <HistoryFilters />
                <HistoryTable />
                <AuditCard />
            </div>
        </DashboardLayout>
    )
}