import { useEffect, useMemo, useState } from "react";
import { FiAlertCircle, FiFilter, FiPlus, FiShield, FiTrash2, FiUsers } from "react-icons/fi";
import toast from "react-hot-toast";
import { createDepartment, deleteDepartment, deleteUser, getDepartments, getUsers } from "../api/authApi";
import DashboardLayout from "../layouts/DashboardLayout";

const roleLabels = {
  employee: "Employee",
  department_officer: "Department Officer",
  subject_officer: "Subject Officer",
  deputy_secretary: "Assistant Secretary",
  senior_deputy_secretary: "Senior Assistant Secretary",
  secretary: "Secretary",
  driver: "Driver",
};

export default function SystemChanges() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [addingDepartment, setAddingDepartment] = useState(false);
  const [removingDepartmentId, setRemovingDepartmentId] = useState(null);

  const availableRoles = useMemo(
    () => [...new Set(users.map((user) => user.role).filter(Boolean))]
      .sort((a, b) => (roleLabels[a] || a).localeCompare(roleLabels[b] || b)),
    [users],
  );

  const availableDepartments = useMemo(
    () => [...new Set(users.map((user) => user.department).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b)),
    [users],
  );

  const filteredUsers = useMemo(
    () => users.filter((user) => (
      (!roleFilter || user.role === roleFilter)
      && (!departmentFilter || user.department === departmentFilter)
    )),
    [departmentFilter, roleFilter, users],
  );

  useEffect(() => {
    let active = true;

    Promise.all([getUsers(), getDepartments()])
      .then(([usersResponse, departmentsResponse]) => {
        if (active) {
          setUsers(usersResponse.data?.users ?? []);
          setDepartments(departmentsResponse.data?.departments ?? []);
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load users.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const addDepartment = async (event) => {
    event.preventDefault();
    const name = departmentName.trim();
    if (!name) return;

    setAddingDepartment(true);
    try {
      const response = await createDepartment(name);
      setDepartments((current) => [...current, response.data.department]
        .sort((a, b) => a.name.localeCompare(b.name)));
      setDepartmentName("");
      toast.success(response.message || "Department added successfully.");
    } catch (requestError) {
      toast.error(requestError.message || "Unable to add this department.");
    } finally {
      setAddingDepartment(false);
    }
  };

  const removeDepartment = async (department) => {
    if (!window.confirm(
      `Remove ${department.name}? Users assigned to it will become unassigned.`,
    )) return;

    setRemovingDepartmentId(department.id);
    try {
      const response = await deleteDepartment(department.id);
      setDepartments((current) => current.filter((item) => item.id !== department.id));
      setUsers((current) => current.map((user) => (
        user.department === department.name ? { ...user, department: null } : user
      )));
      if (departmentFilter === department.name) setDepartmentFilter("");
      toast.success(response.message || "Department removed successfully.");
    } catch (requestError) {
      toast.error(requestError.message || "Unable to remove this department.");
    } finally {
      setRemovingDepartmentId(null);
    }
  };

  const removeUser = async (user) => {
    if (!window.confirm(`Remove ${user.name} from the system?`)) return;

    setRemovingId(user.id);
    try {
      const response = await deleteUser(user.id);
      setUsers((current) => current.filter((item) => item.id !== user.id));
      toast.success(response.message || "User removed successfully.");
    } catch (requestError) {
      toast.error(requestError.message || "Unable to remove this user.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <DashboardLayout>
      <section className="mx-auto w-full max-w-7xl rounded-2xl border border-slate-200 bg-white px-5 py-8 shadow-sm md:px-10">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-700">Administration Panel</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">User Management</h2>
            <p className="mt-2 text-sm text-slate-500">View and remove registered system users.</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">
            <FiUsers aria-hidden="true" />
            {loading ? "Loading users…" : `${users.length} users`}
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.7fr)]">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-blue-100 p-2 text-blue-700"><FiShield /></span>
              <div>
                <h3 className="font-bold text-slate-900">Super Admin privileges</h3>
                <p className="text-sm text-slate-500">The Assistant Secretary can manage users and add departments.</p>
              </div>
            </div>
            <form onSubmit={addDepartment} className="mt-5 flex flex-col gap-3 sm:flex-row">
              <label className="flex-1">
                <span className="sr-only">Department name</span>
                <input
                  value={departmentName}
                  onChange={(event) => setDepartmentName(event.target.value)}
                  maxLength="255"
                  required
                  placeholder="Enter department name"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <button
                type="submit"
                disabled={addingDepartment || !departmentName.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0b3474] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#08285b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiPlus /> {addingDepartment ? "Adding..." : "Add department"}
              </button>
            </form>
          </div>
          <div className="rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Configured departments</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{departments.length}</p>
            <div className="mt-3 flex max-h-24 flex-wrap gap-2 overflow-y-auto">
              {departments.map((department) => (
                <span key={department.id} className="inline-flex items-center gap-1 rounded-full bg-slate-100 py-1 pl-3 pr-1 text-xs font-semibold text-slate-700">
                  {department.name}
                  <button
                    type="button"
                    onClick={() => removeDepartment(department)}
                    disabled={removingDepartmentId === department.id}
                    title={`Remove ${department.name}`}
                    aria-label={`Remove ${department.name}`}
                    className="rounded-full p-1.5 text-slate-400 transition hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiTrash2 aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-end">
          <div className="flex items-center gap-2 pb-2 text-sm font-semibold text-slate-700 sm:mr-2">
            <FiFilter aria-hidden="true" />
            Filter users
          </div>
          <label className="flex-1">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Role</span>
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All roles</option>
              {availableRoles.map((role) => (
                <option key={role} value={role}>{roleLabels[role] || role}</option>
              ))}
            </select>
          </label>
          <label className="flex-1">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Department</span>
            <select
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All departments</option>
              {availableDepartments.map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </label>
          {(roleFilter || departmentFilter) && (
            <button
              type="button"
              onClick={() => {
                setRoleFilter("");
                setDepartmentFilter("");
              }}
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
          {error ? (
            <div className="flex items-center gap-2 p-5 text-sm text-red-700">
              <FiAlertCircle aria-hidden="true" /> {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">User</th>
                    <th className="px-5 py-4">Employee ID</th>
                    <th className="px-5 py-4">Department</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-500">Loading users…</td></tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-5 py-10 text-center text-slate-500">
                        {users.length === 0 ? "No users found." : "No users match the selected filters."}
                      </td>
                    </tr>
                  ) : filteredUsers.map((user) => {
                    const protectedUser = user.role === "deputy_secretary";
                    return (
                      <tr key={user.id} className="text-slate-700">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">{user.name}</p>
                          <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                        </td>
                        <td className="px-5 py-4">{user.employee_id}</td>
                        <td className="px-5 py-4">{user.department || "—"}</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                            {protectedUser && <FiShield aria-hidden="true" />}
                            {roleLabels[user.role] || user.role}
                          </span>
                        </td>
                        <td className="px-5 py-4 capitalize">{user.status}</td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            disabled={protectedUser || removingId === user.id}
                            title={protectedUser ? "Assistant Secretary accounts are protected" : `Remove ${user.name}`}
                            onClick={() => removeUser(user)}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400"
                          >
                            {protectedUser ? <FiShield /> : <FiTrash2 />}
                            {protectedUser ? "Protected" : removingId === user.id ? "Removing…" : "Remove"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}
