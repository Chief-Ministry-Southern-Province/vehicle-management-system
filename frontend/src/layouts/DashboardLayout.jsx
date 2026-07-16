import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-50">

        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
            <Topbar />

            <main className="flex-1 overflow-auto bg-linear-to-br from-slate-50 via-white to-blue-50/70 p-4 sm:p-6">
                {children}
            </main>
        </div>
    </div>
  );
}
