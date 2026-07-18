import DashboardLayout from "../../layouts/DashboardLayout";
import DriverStats from "../../components/driver/dashboard/DriverStats";
import TodaySchedule from "../../components/driver/dashboard/TodaySchedule";
import AssignedVehicle from "../../components/driver/dashboard/AssignedVehicle";
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
