import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ServiceStats from "../../components/subjectOfficer/service/ServiceStats";
import ServiceFilters from "../../components/subjectOfficer/service/ServiceFilters";
import ServiceScheduleTable from "../../components/subjectOfficer/service/ServiceScheduleTable";
import ScheduleServiceModal from "../../components/subjectOfficer/service/ScheduleServiceModal";
import { FiTool, FiPlus } from "react-icons/fi";
export default function ServiceRecords() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Premium Header */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-100 blur-3xl opacity-60" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-cyan-100 blur-3xl opacity-40" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                <FiTool size={14} />
                Fleet Maintenance Center
              </div>

              <h1 className="mt-3 text-3xl font-bold text-slate-900">
                Service & Maintenance Records
              </h1>

              <p className="mt-2 text-slate-500">
                Monitor fleet health, maintenance schedules, vendor assignments,
                and service performance.
              </p>
            </div>

            <button
              onClick={() => setOpenModal(true)}
              className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              <FiPlus />
              Schedule Service
            </button>
          </div>
        </div>

        {/* KPI Section */}
        <div className="grid gap-4 xl:grid-cols-4">
          <div className="xl:col-span-3">
            <ServiceStats />
          </div>

          {/* <PriorityMaintenance /> */}
        </div>

        {/* Filters */}
        <ServiceFilters />

        {/* Table */}
        <ServiceScheduleTable />
      </div>

      {/* Modal */}
      <ScheduleServiceModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </DashboardLayout>
  );
}
