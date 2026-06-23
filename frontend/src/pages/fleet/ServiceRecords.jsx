import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

import ServiceStats from "../../components/subjectOfficer/service/ServiceStats";
import PriorityMaintenance from "../../components/subjectOfficer/service/PriorityMaintenance";
import ServiceFilters from "../../components/subjectOfficer/service/ServiceFilters";
import ServiceScheduleTable from "../../components/subjectOfficer/service/ServiceScheduleTable";
import ScheduleServiceModal from "../../components/subjectOfficer/service/ScheduleServiceModal";

export default function ServiceRecords() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <DashboardLayout>

      <div className="p-6 space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Service & Maintenance Records
            </h1>

            <p className="text-gray-500 mt-1">
              Monitor fleet health and maintenance schedules.
            </p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl"
          >
            Schedule New Service
          </button>
        </div>

        <ServiceStats />

        <PriorityMaintenance />

        <ServiceFilters />

        <ServiceScheduleTable />

      </div>

      <ScheduleServiceModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />

    </DashboardLayout>
  );
}