import DashboardLayout from "../../layouts/DashboardLayout";
import DriverStats from "../../components/driver/dashboard/DriverStats";
import ScheduledJourney from "../../components/driver/dashboard/TodaySchedule";

export default function DriverDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Driver Workspace
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              Welcome back, Robert
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Review your assigned journeys and drive safely.
            </p>
          </div>
        </div>

        <DriverStats />

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-10 xl:col-span-9">
            <ScheduledJourney />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
