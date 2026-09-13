import { confirmLocalized } from "../i18n/runtime.js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createDepartment, deleteDepartment, getDepartments } from "../api/authApi";
import DashboardLayout from "../layouts/DashboardLayout";
import DepartmentManagementSection from "./system-changes/DepartmentManagementSection";

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [addingDepartment, setAddingDepartment] = useState(false);
  const [removingDepartmentId, setRemovingDepartmentId] = useState(null);

  useEffect(() => { getDepartments().then((response) => setDepartments(response.data?.departments ?? [])).catch((error) => toast.error(error.message || "Unable to load departments.")); }, []);
  const addDepartment = async (event) => {
    event.preventDefault();
    const name = departmentName.trim();
    if (!name) return;
    setAddingDepartment(true);
    try { const response = await createDepartment(name); setDepartments((current) => [...current, response.data.department].sort((a, b) => a.name.localeCompare(b.name))); setDepartmentName(""); toast.success(response.message || "Department added successfully."); }
    catch (error) { toast.error(error.message || "Unable to add this department."); }
    finally { setAddingDepartment(false); }
  };
  const removeDepartment = async (department) => {
    if (!confirmLocalized(`Remove ${department.name}? Users assigned to it will become unassigned.`)) return;
    setRemovingDepartmentId(department.id);
    try { const response = await deleteDepartment(department.id); setDepartments((current) => current.filter((item) => item.id !== department.id)); toast.success(response.message || "Department removed successfully."); }
    catch (error) { toast.error(error.message || "Unable to remove this department."); }
    finally { setRemovingDepartmentId(null); }
  };

  return <DashboardLayout><section className="mx-auto min-h-full w-full max-w-5xl rounded-2xl border border-slate-200 bg-white px-5 py-8 shadow-sm md:px-10"><DepartmentManagementSection {...{ addingDepartment, departmentName, departments, onAddDepartment: addDepartment, onRemoveDepartment: removeDepartment, removingDepartmentId, setDepartmentName }} /></section></DashboardLayout>;
}
