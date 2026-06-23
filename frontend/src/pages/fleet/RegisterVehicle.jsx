import DashboardLayout from "../../layouts/DashboardLayout";

import BasicInformation from "../../components/subjectOfficer/registerVehicle/BasicInformation";
import VehicleImageUpload from "../../components/subjectOfficer/registerVehicle/VehicleImageUpload";
import TechnicalSpecifications from "../../components/subjectOfficer/registerVehicle/TechnicalSpecifications";
import ComplianceRegulatory from "../../components/subjectOfficer/registerVehicle/ComplianceRegulatory";
import DeploymentStatus from "../../components/subjectOfficer/registerVehicle/DeploymentStatus";

import {
  FiSave,
  FiTruck,
  FiArrowLeft,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

export default function RegisterVehicle() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-4">

        {/* Compact Header */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="flex items-center gap-2">
              <FiTruck className="text-blue-600" />

              <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
                Vehicle Registration
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Register New Vehicle
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Add a new vehicle to the government fleet registry.
            </p>
          </div>

          <div className="flex gap-2">

            <span className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600">
              VMS-NEW-042
            </span>

            <span className="rounded-xl bg-green-50 px-3 py-2 text-sm font-medium text-green-600">
              Draft
            </span>

          </div>

        </div>

        {/* Content */}
        <div className="grid gap-4 xl:grid-cols-12">

          {/* Left Section */}
          <div className="space-y-4 xl:col-span-8">

            <BasicInformation />

            <TechnicalSpecifications />

            <ComplianceRegulatory />

          </div>

          {/* Right Section */}
          <div className="xl:col-span-4">

            <div className="sticky top-4 space-y-4">

              <VehicleImageUpload />

              <DeploymentStatus />

              {/* Registration Progress */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Registration Progress
                </h3>

                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">
                    Completion
                  </span>

                  <span className="font-medium">
                    65%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: "65%" }}
                  />
                </div>

              </div>

              {/* Action Buttons */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                <h3 className="mb-4 text-sm font-semibold text-slate-900">
                  Actions
                </h3>

                <div className="space-y-2">

                  <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-medium text-white transition hover:bg-blue-700">
                    <FiSave />
                    Save Vehicle
                  </button>

                  <button
                    onClick={() => navigate(-1)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <FiArrowLeft />
                    Cancel
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}