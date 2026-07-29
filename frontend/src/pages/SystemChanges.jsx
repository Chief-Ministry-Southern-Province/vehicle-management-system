import { useEffect, useState } from "react";
import { FiAlertCircle, FiShield, FiTrash2, FiUsers } from "react-icons/fi";
import toast from "react-hot-toast";
import { deleteUser, getUsers } from "../api/authApi";
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

  useEffect(() => {
    let active = true;

    getUsers()
      .then((response) => {
        if (active) setUsers(response.data?.users ?? []);
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
                  ) : users.length === 0 ? (
                    <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-500">No users found.</td></tr>
                  ) : users.map((user) => {
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
