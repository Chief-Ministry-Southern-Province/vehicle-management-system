import { useState } from "react";
import toast from "react-hot-toast";
import { downloadDatabaseBackup } from "../api/authApi";
import DashboardLayout from "../layouts/DashboardLayout";
import DatabaseManagementSection from "./system-changes/DatabaseManagementSection";

export default function DatabaseManagement() {
  const [creatingBackup, setCreatingBackup] = useState(false);
  const createBackup = async () => {
    setCreatingBackup(true);
    try { await downloadDatabaseBackup(); toast.success("Database backup created and downloaded."); }
    catch (error) { toast.error(error.message || "Unable to create the database backup."); }
    finally { setCreatingBackup(false); }
  };

  return <DashboardLayout><section className="mx-auto min-h-full w-full max-w-5xl rounded-2xl border border-slate-200 bg-white px-5 py-8 shadow-sm md:px-10"><DatabaseManagementSection creatingBackup={creatingBackup} onCreateBackup={createBackup} /></section></DashboardLayout>;
}
