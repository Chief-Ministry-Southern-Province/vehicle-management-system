import DashboardLayout from "../../layouts/DashboardLayout";

import SecretaryStats from "../../components/secretary/dashboard/SecretaryStats";
import RequestApprovalTrend from "../../components/secretary/dashboard/RequestApprovalTrend";
import FleetUtilizationChart from "../../components/secretary/dashboard/FleetUtilizationChart";
import FinalApprovalCenter from "../../components/secretary/dashboard/FinalApprovalCenter";
import ExecutiveReports from "../../components/secretary/dashboard/ExecutiveReports";

export default function SecretaryDashboard() {
  return (
    <DashboardLayout>
      <div className="bg-slate-50 min-h-screen p-6">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">

          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Fleet Operations Overview
            </h1>

            <p className="text-slate-500 mt-2">
              Monitoring 142 active vehicles across 12 government departments.
            </p>
          </div>

          <div className="flex gap-3">

            <button className="px-5 py-3 bg-white border rounded-xl font-medium hover:bg-slate-50">
              View Detailed Analytics
            </button>

            <button className="px-5 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
              Export Monthly Audit
            </button>

          </div>

        </div>

        <SecretaryStats />

        <div className="grid lg:grid-cols-12 gap-6 mt-6">

          <div className="lg:col-span-8">
            <RequestApprovalTrend />
          </div>

          <div className="lg:col-span-4">
            <FleetUtilizationChart />
          </div>

        </div>

        <div className="grid lg:grid-cols-12 gap-6 mt-6">

          <div className="lg:col-span-8">
            <FinalApprovalCenter />
          </div>

          <div className="lg:col-span-4">
            <ExecutiveReports />
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}