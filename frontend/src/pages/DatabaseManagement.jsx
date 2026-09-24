import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  downloadDatabaseBackup,
  getDatabaseBackupHistory,
} from "../api/authApi";
import DashboardLayout from "../layouts/DashboardLayout";
import DatabaseManagementSection from "./system-changes/DatabaseManagementSection";

export default function DatabaseManagement() {
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [backups, setBackups] = useState([]);
  const [loadingBackups, setLoadingBackups] = useState(true);
  const [backupHistoryError, setBackupHistoryError] = useState("");

  const loadBackups = useCallback(async () => {
    try {
      setLoadingBackups(true);
      setBackupHistoryError("");
      const response = await getDatabaseBackupHistory();
      setBackups(response?.data?.backups || []);
    } catch (error) {
      setBackups([]);
      setBackupHistoryError(
        error?.message || "Unable to load backup history.",
      );
    } finally {
      setLoadingBackups(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(loadBackups, 0);
    return () => clearTimeout(timeoutId);
  }, [loadBackups]);

  const createBackup = async () => {
    setCreatingBackup(true);
    try {
      await downloadDatabaseBackup();
      await loadBackups();
      toast.success("Database backup created and downloaded.");
    }
    catch (error) { toast.error(error.message || "Unable to create the database backup."); }
    finally { setCreatingBackup(false); }
  };

  return <DashboardLayout><section className="mx-auto min-h-full w-full max-w-6xl rounded-2xl border border-slate-200 bg-white px-5 py-7 shadow-sm sm:px-7 lg:px-10"><DatabaseManagementSection backups={backups} loadingBackups={loadingBackups} backupHistoryError={backupHistoryError} creatingBackup={creatingBackup} onCreateBackup={createBackup} /></section></DashboardLayout>;
}
