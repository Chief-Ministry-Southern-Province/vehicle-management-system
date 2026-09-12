import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { deleteUser, getDepartments, getUsers, updateUser } from "../api/authApi";
import DashboardLayout from "../layouts/DashboardLayout";
import UserManagementSection from "./system-changes/UserManagementSection";
import { roleLabels } from "./system-changes/constants";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({});
  const [savingUser, setSavingUser] = useState(false);

  const availableRoles = useMemo(() => [...new Set(users.map((user) => user.role).filter(Boolean))].sort((a, b) => (roleLabels[a] || a).localeCompare(roleLabels[b] || b)), [users]);
  const availableDepartments = useMemo(() => [...new Set([...departments.map((department) => department.name), ...users.map((user) => user.department).filter(Boolean)])].sort((a, b) => a.localeCompare(b)), [departments, users]);
  const roleDistribution = useMemo(() => buildDistribution(users, (user) => user.role || "unassigned", (role) => roleLabels[role] || "Unassigned"), [users]);
  const departmentDistribution = useMemo(() => buildDistribution(users, (user) => user.department || "Unassigned", (department) => department), [users]);
  const filteredUsers = useMemo(() => users.filter((user) => (!roleFilter || user.role === roleFilter) && (!departmentFilter || user.department === departmentFilter)), [departmentFilter, roleFilter, users]);

  useEffect(() => {
    let active = true;
    Promise.all([getUsers(), getDepartments()])
      .then(([usersResponse, departmentsResponse]) => {
        if (!active) return;
        setUsers(usersResponse.data?.users ?? []);
        setDepartments(departmentsResponse.data?.departments ?? []);
      })
      .catch((requestError) => active && setError(requestError.message || "Unable to load users."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const openUserEditor = (user) => {
    setEditingUser(user);
    setUserForm({ employee_id: user.employee_id || "", name: user.name || "", email: user.email || "", phone: user.phone || "", department: user.department || "", status: user.status || "active" });
  };
  const closeUserEditor = () => !savingUser && setEditingUser(null);
  const removeUser = async (user) => {
    if (!window.confirm(`Remove ${user.name} from the system?`)) return;
    setRemovingId(user.id);
    try { const response = await deleteUser(user.id); setUsers((current) => current.filter((item) => item.id !== user.id)); toast.success(response.message || "User removed successfully."); }
    catch (requestError) { toast.error(requestError.message || "Unable to remove this user."); }
    finally { setRemovingId(null); }
  };
  const saveUser = async (event) => {
    event.preventDefault();
    if (!editingUser) return;
    setSavingUser(true);
    try {
      const response = await updateUser(editingUser.id, { ...userForm, employee_id: userForm.employee_id.trim(), name: userForm.name.trim(), email: userForm.email.trim(), phone: userForm.phone.trim() || null, department: userForm.department || null });
      if (response.data?.user) setUsers((current) => current.map((user) => (user.id === response.data.user.id ? response.data.user : user)));
      setEditingUser(null);
      toast.success(response.message || "User updated successfully.");
    } catch (requestError) { toast.error(requestError.message || "Unable to update this user."); }
    finally { setSavingUser(false); }
  };

  return <DashboardLayout><section className="mx-auto min-h-full w-full max-w-7xl rounded-2xl border border-slate-200 bg-white px-5 py-8 shadow-sm md:px-10"><UserManagementSection {...{ availableDepartments, availableRoles, departmentDistribution, departmentFilter, editingUser, error, filteredUsers, loading, onCloseEditor: closeUserEditor, onOpenEditor: openUserEditor, onRemoveUser: removeUser, onSaveUser: saveUser, removingId, roleDistribution, roleFilter, savingUser, setDepartmentFilter, setRoleFilter, setUserForm, userForm, users }} /></section></DashboardLayout>;
}

function buildDistribution(items, keyFor, labelFor) {
  const counts = items.reduce((result, item) => { const key = keyFor(item); result[key] = (result[key] || 0) + 1; return result; }, {});
  return Object.entries(counts).map(([key, count]) => ({ key, name: labelFor(key), count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
