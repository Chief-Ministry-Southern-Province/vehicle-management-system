import DashboardLayout from "../../layouts/DashboardLayout";

import DriverStats from "../../components/driver/dashboard/DriverStats";
import TodaySchedule from "../../components/driver/dashboard/TodaySchedule";
import AssignedVehicle from "../../components/driver/dashboard/AssignedVehicle";
import FuelHistory from "../../components/driver/dashboard/FuelHistory";
import TripHistory from "../../components/driver/dashboard/TripHistory";

export default function DriverDashboard() {
  return (
    <DashboardLayout>
      <div className="bg-slate-50 min-h-screen p-6">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-8">

          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Welcome back, Robert
            </h1>

            <p className="text-slate-500 mt-2">
              You have 4 trips scheduled for today. Drive safely.
            </p>
          </div>

          <div className="flex gap-3 mt-4 lg:mt-0">
            <button className="bg-white border px-5 py-3 rounded-xl">
              Schedule
            </button>

            <button className="bg-blue-600 text-white px-5 py-3 rounded-xl">
              Quick Log
            </button>
          </div>

        </div>

        <DriverStats />

        <div className="grid lg:grid-cols-12 gap-6 mt-6">

          {/* Left */}
          <div className="lg:col-span-8">
            <TodaySchedule />
          </div>

          {/* Right */}
          <div className="lg:col-span-4 space-y-6">
            <AssignedVehicle />
            <FuelHistory />
          </div>

        </div>

        <div className="mt-8">
          <TripHistory />
        </div>

      </div>
    </DashboardLayout>
  );
}