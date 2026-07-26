import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Topbar />

      <div className="flex min-h-0 flex-1">
        <Sidebar />

        <main className="min-w-0 flex-1 overflow-auto bg-linear-to-br from-slate-50 via-white to-blue-50/70 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
