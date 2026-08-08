import DashboardLayout from "../../layouts/DashboardLayout";
import DriverStats from "../../components/driver/dashboard/DriverStats";
import ScheduledJourney from "../../components/driver/dashboard/TodaySchedule";
import { useAuth } from "../../context/useAuth";

export default function DriverDashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.trim().split(/\s+/)[0] || "Driver";

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Driver Workspace
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Welcome back, {firstName}
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Review your assigned journeys and drive safely.
            </p>
          </div>
        </div>

        <DriverStats />

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-12">
            <ScheduledJourney />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
