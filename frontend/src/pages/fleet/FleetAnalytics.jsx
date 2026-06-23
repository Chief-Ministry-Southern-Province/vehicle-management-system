import DashboardLayout from "../../layouts/DashboardLayout";

import AnalyticsStats from "../../components/subjectOfficer/analytics/AnalyticsStats";
import UtilizationHeatmap from "../../components/subjectOfficer/analytics/UtilizationHeatmap";
import DepartmentConsumption from "../../components/subjectOfficer/analytics/DepartmentConsumption";
import ExpenditureChart from "../../components/subjectOfficer/analytics/ExpenditureChart";
import AnalyticsInsights from "../../components/subjectOfficer/analytics/AnalyticsInsights";

import {
  FiCalendar,
  FiDownload,
} from "react-icons/fi";

export default function FleetAnalytics() {
  return (
    <DashboardLayout>
      <div className="p-6 bg-slate-50 min-h-screen">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">

          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Fleet Analytics
            </h1>

            <p className="text-gray-500 mt-2">
              Operational performance and expenditure reporting
              for Q2 2024.
            </p>
          </div>

          <div className="flex gap-3">

            <button className="flex items-center gap-2 px-4 py-3 bg-white border rounded-xl">
              <FiCalendar />
              Last 6 Months
            </button>

            <button className="px-4 py-3 bg-white border rounded-xl">
              PDF
            </button>

            <button className="px-4 py-3 bg-white border rounded-xl">
              Excel
            </button>

            <button className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl">
              <FiDownload />
              Full Report
            </button>

          </div>

        </div>

        <AnalyticsStats />

        <div className="grid lg:grid-cols-3 gap-6 mt-6">

          <div className="lg:col-span-2">
            <UtilizationHeatmap />
          </div>

          <DepartmentConsumption />

        </div>

        <div className="mt-6">
          <ExpenditureChart />
        </div>

        <div className="mt-6">
          <AnalyticsInsights />
        </div>

      </div>
    </DashboardLayout>
  );
}