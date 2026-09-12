import { FiPlus, FiTrash2 } from "react-icons/fi";

export default function DepartmentManagementSection({ addingDepartment, departmentName, departments, onAddDepartment, onRemoveDepartment, removingDepartmentId, setDepartmentName }) {
  return (
    <section aria-labelledby="department-management-title">
      <header className="flex flex-col gap-2 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-700">Organization setup</p>
          <h1 id="department-management-title" className="mt-1 text-3xl font-bold text-slate-900">Department Management</h1>
          <p className="mt-2 text-sm text-slate-500">Create, review, and maintain the department directory.</p>
        </div>
        <div className="rounded-xl bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-800">{departments.length} departments</div>
      </header>

      <form onSubmit={onAddDepartment} className="mt-8 flex flex-col gap-3 rounded-2xl border border-cyan-200 bg-cyan-50/40 p-5 sm:flex-row">
        <label className="flex-1"><span className="mb-2 block text-sm font-semibold text-slate-700">New department name</span><input value={departmentName} onChange={(event) => setDepartmentName(event.target.value)} maxLength="255" required placeholder="Enter department name" className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" /></label>
        <button type="submit" disabled={addingDepartment || !departmentName.trim()} className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"><FiPlus aria-hidden="true" /> {addingDepartment ? "Adding..." : "Add department"}</button>
      </form>

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Department ID</th><th className="px-5 py-4">Department name</th><th className="px-5 py-4 text-right">Action</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {departments.length === 0 ? <tr><td colSpan="3" className="px-5 py-10 text-center text-slate-500">No departments configured.</td></tr> : departments.map((department) => <tr key={department.id} className="text-slate-700"><td className="px-5 py-4 font-medium">{department.id}</td><td className="px-5 py-4 font-semibold text-slate-900">{department.name}</td><td className="px-5 py-4 text-right"><button type="button" onClick={() => onRemoveDepartment(department)} disabled={removingDepartmentId === department.id} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"><FiTrash2 aria-hidden="true" /> {removingDepartmentId === department.id ? "Removing..." : "Remove"}</button></td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
