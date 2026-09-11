import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import Setting from "../pages/Setting";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (!settingsOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSettingsOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [settingsOpen]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f4f7fb] dark:bg-slate-950">
      <Topbar onMenuToggle={() => setSidebarOpen(true)} onSettingsOpen={() => setSettingsOpen(true)} />

      <div className="flex min-h-0 flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="min-w-0 flex-1 overflow-auto bg-linear-to-br from-slate-50 via-white to-blue-50/70 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:p-6">
          {children}
        </main>
      </div>

      {settingsOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-label="User Settings">
          <button type="button" className="absolute inset-0 cursor-default bg-slate-950/40 backdrop-blur-[1px]" onClick={() => setSettingsOpen(false)} aria-label="Close user settings" />
          <aside className="relative h-full w-full max-w-2xl overflow-y-auto border-l border-slate-200 bg-slate-50 p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-950 sm:p-6">
            <Setting embedded onClose={() => setSettingsOpen(false)} />
          </aside>
        </div>
      )}
    </div>
  );
}
