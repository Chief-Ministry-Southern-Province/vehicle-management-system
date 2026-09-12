import { useEffect, useMemo, useState } from "react";
import { FiShield, FiUsers } from "react-icons/fi";
import toast from "react-hot-toast";
import { createDepartment, deleteDepartment, deleteUser, downloadDatabaseBackup, getDepartments, getUsers, updateUser } from "../api/authApi";
import DashboardLayout from "../layouts/DashboardLayout";
import DatabaseManagementSection from "./system-changes/DatabaseManagementSection";
import DepartmentManagementSection from "./system-changes/DepartmentManagementSection";
import UserManagementSection from "./system-changes/UserManagementSection";
import { roleLabels } from "./system-changes/constants";

export default function SystemChanges() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [addingDepartment, setAddingDepartment] = useState(false);
  const [removingDepartmentId, setRemovingDepartmentId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({});
  const [savingUser, setSavingUser] = useState(false);

  const availableRoles = useMemo(() => [...new Set(users.map((user) => user.role).filter(Boolean))]
    .sort((a, b) => (roleLabels[a] || a).localeCompare(roleLabels[b] || b)), [users]);
  const availableDepartments = useMemo(() => [...new Set([
    ...departments.map((department) => department.name),
    ...users.map((user) => user.department).filter(Boolean),
  ])].sort((a, b) => a.localeCompare(b)), [departments, users]);
  const roleDistribution = useMemo(() => distribution(users, (user) => user.role || "unassigned", (role) => roleLabels[role] || "Unassigned"), [users]);
  const departmentDistribution = useMemo(() => distribution(
    [...users, ...departments.filter((department) => !users.some((user) => user.department === department.name)).map((department) => ({ department: department.name }))],
    (item) => item.department || "Unassigned",
    (department) => department,
  ), [departments, users]);
  const filteredUsers = useMemo(() => users.filter((user) => (
    (!roleFilter || user.role === roleFilter) && (!departmentFilter || user.department === departmentFilter)
  )), [departmentFilter, roleFilter, users]);

  useEffect(() => {
    let active = true;
    Promise.all([getUsers(), getDepartments()])
      .then(([usersResponse, departmentsResponse]) => {
        if (!active) return;
        setUsers(usersResponse.data?.users ?? []);
        setDepartments(departmentsResponse.data?.departments ?? []);
      })
      .catch((requestError) => active && setError(requestError.message || "Unable to load administration data."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const addDepartment = async (event) => {
    event.preventDefault();
    const name = departmentName.trim();
    if (!name) return;
    setAddingDepartment(true);
    try {
      const response = await createDepartment(name);
      setDepartments((current) => [...current, response.data.department].sort((a, b) => a.name.localeCompare(b.name)));
      setDepartmentName("");
      toast.success(response.message || "Department added successfully.");
    } catch (requestError) { toast.error(requestError.message || "Unable to add this department."); } finally { setAddingDepartment(false); }
  };

  const removeDepartment = async (department) => {
    if (!window.confirm(`Remove ${department.name}? Users assigned to it will become unassigned.`)) return;
    setRemovingDepartmentId(department.id);
    try {
      const response = await deleteDepartment(department.id);
      setDepartments((current) => current.filter((item) => item.id !== department.id));
      setUsers((current) => current.map((user) => (user.department === department.name ? { ...user, department: null } : user)));
      if (departmentFilter === department.name) setDepartmentFilter("");
      toast.success(response.message || "Department removed successfully.");
    } catch (requestError) { toast.error(requestError.message || "Unable to remove this department."); } finally { setRemovingDepartmentId(null); }
  };

  const removeUser = async (user) => {
    if (!window.confirm(`Remove ${user.name} from the system?`)) return;
    setRemovingId(user.id);
    try {
      const response = await deleteUser(user.id);
      setUsers((current) => current.filter((item) => item.id !== user.id));
      toast.success(response.message || "User removed successfully.");
    } catch (requestError) { toast.error(requestError.message || "Unable to remove this user."); } finally { setRemovingId(null); }
  };

  const openUserEditor = (user) => {
    setEditingUser(user);
    setUserForm({ employee_id: user.employee_id || "", name: user.name || "", email: user.email || "", phone: user.phone || "", department: user.department || "", status: user.status || "active" });
  };
  const closeUserEditor = () => !savingUser && setEditingUser(null);
  const saveUser = async (event) => {
    event.preventDefault();
    if (!editingUser) return;
    setSavingUser(true);
    try {
      const response = await updateUser(editingUser.id, { ...userForm, employee_id: userForm.employee_id.trim(), name: userForm.name.trim(), email: userForm.email.trim(), phone: userForm.phone.trim() || null, department: userForm.department || null });
      if (response.data?.user) setUsers((current) => current.map((user) => (user.id === response.data.user.id ? response.data.user : user)));
      setEditingUser(null);
      toast.success(response.message || "User updated successfully.");
    } catch (requestError) { toast.error(requestError.message || "Unable to update this user."); } finally { setSavingUser(false); }
  };
  const createBackup = async () => {
    setCreatingBackup(true);
    try { await downloadDatabaseBackup(); toast.success("Database backup created and downloaded."); }
    catch (requestError) { toast.error(requestError.message || "Unable to create the database backup."); }
    finally { setCreatingBackup(false); }
  };

  return (
    <DashboardLayout>
      <section className="mx-auto min-h-full w-full max-w-7xl rounded-2xl border border-slate-200 bg-white px-5 py-8 shadow-sm md:px-10">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-700">Administration Panel</p><h1 className="mt-2 text-3xl font-bold text-slate-900">System Changes</h1><p className="mt-2 text-sm text-slate-500">Manage user accounts, departments, and database protection in dedicated sections.</p></div>
          <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800"><FiShield aria-hidden="true" /><FiUsers aria-hidden="true" />{loading ? "Loading users..." : `${users.length} users`}</div>
        </header>
        <UserManagementSection {...{ availableDepartments, availableRoles, departmentDistribution, departmentFilter, editingUser, error, filteredUsers, loading, onCloseEditor: closeUserEditor, onOpenEditor: openUserEditor, onRemoveUser: removeUser, onSaveUser: saveUser, removingId, roleDistribution, roleFilter, savingUser, setDepartmentFilter, setRoleFilter, setUserForm, userForm, users }} />
        <DepartmentManagementSection {...{ addingDepartment, departmentName, departments, onAddDepartment: addDepartment, onRemoveDepartment: removeDepartment, removingDepartmentId, setDepartmentName }} />
        <DatabaseManagementSection creatingBackup={creatingBackup} onCreateBackup={createBackup} />
      </section>
    </DashboardLayout>
  );
}

function distribution(items, keyFor, labelFor) {
  const counts = items.reduce((result, item) => {
    const key = keyFor(item);
    result[key] = (result[key] || 0) + 1;
    return result;
  }, {});
  return Object.entries(counts).map(([key, count]) => ({ key, name: labelFor(key), count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
