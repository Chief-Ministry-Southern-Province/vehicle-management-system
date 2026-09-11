import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiDatabase, FiLayers, FiPlus, FiShield, FiUserCheck, FiUsers } from "react-icons/fi";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getDepartments, getUsers } from "../../api/authApi";

const roleLabels = {
  employee: "Employee",
  department_officer: "Department Officer",
  subject_officer: "Subject Officer",
  deputy_secretary: "Assistant Secretary",
  system_admin: "System Administrator",
  senior_deputy_secretary: "Senior Assistant Secretary",
  secretary: "Secretary",
  driver: "Driver",
};

export default function SystemAdminDashboard() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([getUsers(), getDepartments()])
      .then(([usersResponse, departmentsResponse]) => {
        if (!active) return;
        setUsers(usersResponse.data?.users ?? []);
        setDepartments(departmentsResponse.data?.departments ?? []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load administration data.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const activeUsers = users.filter((user) => user.status === "active").length;
  const roleSummary = useMemo(() => Object.entries(users.reduce((counts, user) => {
    const role = user.role || "unassigned";
    counts[role] = (counts[role] || 0) + 1;
    return counts;
  }, {}))
    .map(([role, count]) => ({ role, count, label: roleLabels[role] || "Unassigned" }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)), [users]);

  const stats = [
    { label: "Registered users", value: users.length, icon: FiUsers, colour: "bg-blue-50 text-blue-700" },
    { label: "Active accounts", value: activeUsers, icon: FiUserCheck, colour: "bg-emerald-50 text-emerald-700" },
    { label: "Departments", value: departments.length, icon: FiLayers, colour: "bg-violet-50 text-violet-700" },
  ];

  return (
    <DashboardLayout>
      <main className="min-h-screen bg-[#f4f7fb] px-3 py-4 dark:bg-slate-950 sm:px-5 sm:py-6 lg:px-7">
        <div className="mx-auto max-w-7xl space-y-5 sm:space-y-7">
          <header className="relative overflow-hidden rounded-[24px] bg-linear-to-br from-slate-950 via-blue-950 to-indigo-900 px-5 py-6 text-white shadow-[0_24px_60px_-30px_rgba(30,64,175,0.85)] sm:px-7 sm:py-8">
            <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300 sm:text-xs">System administration</p>
                <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">System Admin Dashboard</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100/85 sm:text-base">Manage user accounts, departments, and system backups.</p>
              </div>
              <Link to="/register" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-blue-800 transition hover:bg-blue-50">
                <FiPlus aria-hidden="true" /> Create employee
              </Link>
            </div>
          </header>

          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <section className="grid gap-4 sm:grid-cols-3" aria-label="Administration summary">
            {stats.map(({ label, value, icon: Icon, colour }) => (
              <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className={`inline-flex rounded-xl p-3 ${colour}`}><Icon size={21} aria-hidden="true" /></span>
                <p className="mt-4 text-3xl font-bold text-slate-900">{loading ? "—" : value}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Access overview</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">Users by role</h2>
                </div>
                <FiShield className="text-blue-700" size={24} aria-hidden="true" />
              </div>
              <div className="mt-5 space-y-3">
                {loading ? <p className="text-sm text-slate-500">Loading user roles…</p> : roleSummary.length ? roleSummary.map(({ role, label, count }) => (
                  <div key={role} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-900 shadow-sm">{count}</span>
                  </div>
                )) : <p className="text-sm text-slate-500">No user accounts have been registered.</p>}
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Quick actions</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">Administration tools</h2>
              <div className="mt-5 space-y-3">
                <Link to="/register" className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50">
                  <span className="rounded-lg bg-blue-100 p-2 text-blue-700"><FiPlus aria-hidden="true" /></span>
                  <span className="min-w-0 flex-1"><strong className="block text-sm text-slate-900">Create employee</strong><span className="text-xs text-slate-500">Register a user account and role.</span></span>
                  <FiArrowRight className="text-slate-400" aria-hidden="true" />
                </Link>
                <Link to="/systemchanges" className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50">
                  <span className="rounded-lg bg-indigo-100 p-2 text-indigo-700"><FiUsers aria-hidden="true" /></span>
                  <span className="min-w-0 flex-1"><strong className="block text-sm text-slate-900">Manage users and departments</strong><span className="text-xs text-slate-500">Review accounts, departments, and roles.</span></span>
                  <FiArrowRight className="text-slate-400" aria-hidden="true" />
                </Link>
                <Link to="/systemchanges#database-backup-title" className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50">
                  <span className="rounded-lg bg-emerald-100 p-2 text-emerald-700"><FiDatabase aria-hidden="true" /></span>
                  <span className="min-w-0 flex-1"><strong className="block text-sm text-slate-900">Create database backup</strong><span className="text-xs text-slate-500">Download a secure database copy.</span></span>
                  <FiArrowRight className="text-slate-400" aria-hidden="true" />
                </Link>
              </div>
            </article>
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}
