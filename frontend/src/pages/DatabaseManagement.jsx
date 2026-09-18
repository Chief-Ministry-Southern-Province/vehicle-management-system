import { useState } from "react";
import toast from "react-hot-toast";
import { downloadDatabaseBackup, downloadDatabaseBackupFile } from "../api/authApi";
import DashboardLayout from "../layouts/DashboardLayout";
import DatabaseManagementSection from "./system-changes/DatabaseManagementSection";

export default function DatabaseManagement() {
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [backups, setBackups] = useState([]);

  const createBackup = async () => {
    setCreatingBackup(true);
    try {
      const backup = await downloadDatabaseBackup();
      setBackups((current) => [{ ...backup, id: `${Date.now()}-${backup.filename}`, createdAt: new Date() }, ...current].slice(0, 5));
      toast.success("Database backup created and downloaded.");
    }
    catch (error) { toast.error(error.message || "Unable to create the database backup."); }
    finally { setCreatingBackup(false); }
  };

  const downloadAgain = (backup) => {
    downloadDatabaseBackupFile(backup.file, backup.filename);
    toast.success("Backup download started.");
  };

  return <DashboardLayout><section className="mx-auto min-h-full w-full max-w-6xl rounded-2xl border border-slate-200 bg-white px-5 py-7 shadow-sm sm:px-7 lg:px-10"><DatabaseManagementSection backups={backups} creatingBackup={creatingBackup} onCreateBackup={createBackup} onDownloadBackup={downloadAgain} /></section></DashboardLayout>;
}
