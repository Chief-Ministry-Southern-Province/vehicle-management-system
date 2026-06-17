import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen flex bg-slate-50">

        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
            <Topbar />

            <main className="flex-1 overflow-y-auto p-6">
                {children}
            </main>
        </div>
    </div>
  );
}
