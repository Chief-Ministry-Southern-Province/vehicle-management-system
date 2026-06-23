import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

import FuelStats from "../../components/subjectOfficer/fuel/FuelStats";
import FuelFilters from "../../components/subjectOfficer/fuel/FuelFilters";
import FuelTable from "../../components/subjectOfficer/fuel/FuelTable";
import FuelLogModal from "../../components/subjectOfficer/fuel/FuelLogModal";

import {
  FiPlus,
  FiDownload,
} from "react-icons/fi";

export default function FuelManagement() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* Header */}

        <div className="flex justify-between items-start">

          <div>
            <h1 className="text-4xl font-bold">
              Fuel Management
            </h1>

            <p className="text-gray-500 mt-2">
              Track fleet fuel usage, expenses and fuel logs.
            </p>
          </div>

          <div className="flex gap-3">

            <button className="border px-5 py-3 rounded-xl flex items-center gap-2">
              <FiDownload />
              Export CSV
            </button>

            <button
              onClick={() => setOpenModal(true)}
              className="bg-blue-600 text-white px-5 py-3 rounded-xl flex items-center gap-2"
            >
              <FiPlus />
              Add Fuel Log
            </button>

          </div>

        </div>

        <FuelStats />

        <div className="bg-white border rounded-2xl overflow-hidden">

          <FuelFilters />

          <FuelTable />

        </div>

      </div>

      {openModal && (
        <FuelLogModal
          onClose={() => setOpenModal(false)}
        />
      )}

    </DashboardLayout>
  );
}