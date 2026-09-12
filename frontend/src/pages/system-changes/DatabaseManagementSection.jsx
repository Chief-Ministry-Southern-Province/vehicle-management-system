import { FiDatabase, FiDownload } from "react-icons/fi";

export default function DatabaseManagementSection({ creatingBackup, onCreateBackup }) {
  return (
    <section className="mt-8 rounded-2xl border border-blue-200 bg-blue-50/50 p-5" aria-labelledby="database-management-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3"><span className="rounded-xl bg-white p-3 text-blue-700 shadow-sm"><FiDatabase aria-hidden="true" /></span><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">System protection</p><h2 id="database-management-title" className="mt-1 text-2xl font-bold text-slate-900">Database Management</h2><p className="mt-1 text-sm text-slate-600">Create and download a complete database backup for secure storage.</p></div></div>
        <button type="button" onClick={onCreateBackup} disabled={creatingBackup} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"><FiDownload aria-hidden="true" /> {creatingBackup ? "Creating backup..." : "Create backup"}</button>
      </div>
    </section>
  );
}
