import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import FuelStats from "../../components/subjectOfficer/fuel/FuelStats";
import FuelFilters from "../../components/subjectOfficer/fuel/FuelFilters";
import FuelTable from "../../components/subjectOfficer/fuel/FuelTable";
import FuelLogModal from "../../components/subjectOfficer/fuel/FuelLogModal";
import { FiPlus, FiDownload, FiDroplet } from "react-icons/fi";
export default function FuelManagement() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Premium Header */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Background Glow */}
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-100 blur-3xl opacity-60" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-cyan-100 blur-3xl opacity-40" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                <FiDroplet size={14} />
                Fuel Operations Center
              </div>

              <h1 className="mt-3 text-3xl font-bold text-slate-900">
                Fuel Management
              </h1>

              <p className="mt-2 text-slate-500">
                Monitor fuel consumption, expenses, efficiency, and vehicle fuel
                transaction records.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                <FiDownload />
                Export CSV
              </button>

              <button
                onClick={() => setOpenModal(true)}
                className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
              >
                <FiPlus />
                Add Fuel Log
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <FuelStats />

        {/* Fuel Records */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <FuelFilters />

          <FuelTable />
        </div>
      </div>

      {/* Fuel Log Modal */}
      {openModal && <FuelLogModal onClose={() => setOpenModal(false)} />}
    </DashboardLayout>
  );
}
