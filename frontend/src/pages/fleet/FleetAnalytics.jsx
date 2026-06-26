import DashboardLayout from "../../layouts/DashboardLayout";

import AnalyticsStats from "../../components/subjectOfficer/analytics/AnalyticsStats";
import ExpenditureChart from "../../components/subjectOfficer/analytics/ExpenditureChart";

import {
  FiCalendar,
  FiDownload,
  FiBarChart2,
} from "react-icons/fi";

export default function FleetAnalytics() {
  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* Premium Header */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-100 blur-3xl opacity-60" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-cyan-100 blur-3xl opacity-40" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                <FiBarChart2 size={14} />
                Executive Analytics Center
              </div>

              <h1 className="mt-3 text-3xl font-bold text-slate-900">
                Fleet Analytics Dashboard
              </h1>

              <p className="mt-2 max-w-3xl text-slate-500">
                Analyze fleet utilization, operational efficiency,
                maintenance expenditure, fuel consumption, and
                department performance across the government vehicle fleet.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium hover:bg-slate-50">
                <FiCalendar />
                Last 6 Months
              </button>

              <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium hover:bg-slate-50">
                PDF
              </button>

              <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium hover:bg-slate-50">
                Excel
              </button>

              <button className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
                <FiDownload />
                Export Report
              </button>

            </div>

          </div>

        </div>

        {/* KPI Cards */}
        <AnalyticsStats />

        {/* Expenditure Chart */}
        <ExpenditureChart />

      </div>

    </DashboardLayout>
  );
}