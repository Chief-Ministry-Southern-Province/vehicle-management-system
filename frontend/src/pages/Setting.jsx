import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCheck, FiMoon, FiSave, FiSun, FiUser } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import { getProfile, updateProfile } from "../api/authApi";
import { useAuth } from "../context/useAuth";

export default function Setting() {
  const { user, token, login } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [profile, setProfile] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [account, setAccount] = useState(user || {});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    let active = true;
    getProfile().then((response) => {
      const currentUser = response?.data?.user;
      if (!active || !currentUser) return;
      setAccount(currentUser);
      setProfile({ name: currentUser.name || "", phone: currentUser.phone || "" });
    }).catch((error) => toast.error(error?.message || "Unable to load profile details."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const changeTheme = (nextTheme) => {
    setTheme(nextTheme);
  };

  const saveProfile = async (event) => {
    event.preventDefault(); setSaving(true);
    try {
      const response = await updateProfile(profile);
      const updatedUser = response?.data?.user;
      if (updatedUser) { setAccount(updatedUser); login({ ...user, ...updatedUser }, token); }
      toast.success("Profile updated successfully");
    } catch (error) { toast.error(error?.message || "Unable to update profile details."); }
    finally { setSaving(false); }
  };

  const field = "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1><p className="mt-1 text-sm text-slate-500">Manage your profile and display preference.</p></div>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="font-bold text-slate-900 dark:text-white">Appearance</h2><p className="mt-1 text-sm text-slate-500">Choose how the system appears on this device.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[{ value: "light", label: "Light mode", Icon: FiSun }, { value: "dark", label: "Dark mode", Icon: FiMoon }].map(({ value, label, Icon }) => (
              <button key={value} type="button" onClick={() => changeTheme(value)} className={`relative flex items-center gap-4 rounded-2xl border p-5 text-left transition ${theme === value ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100 dark:bg-blue-950" : "border-slate-200 dark:border-slate-700"}`}>
                <span className="rounded-xl bg-white p-3 text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-300"><Icon size={22} /></span><span><strong className="block text-slate-900 dark:text-white">{label}</strong><span className="text-sm text-slate-500">{value === "light" ? "Standard bright display" : "Reduced-light display"}</span></span>{theme === value && <FiCheck className="absolute right-4 top-4 text-blue-600" />}
              </button>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5 dark:border-slate-700"><span className="rounded-xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><FiUser /></span><div><h2 className="font-bold text-slate-900 dark:text-white">Profile Details</h2><p className="text-sm text-slate-500">Update your personal information.</p></div></div>
          {loading ? <p className="py-10 text-center text-sm text-slate-500">Loading profile…</p> : (
            <form onSubmit={saveProfile} className="mt-6 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Full Name<input required value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} className={field} /></label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Phone Number<input value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} className={field} /></label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email Address<input disabled value={account.email || ""} className={`${field} cursor-not-allowed opacity-70`} /></label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Employee ID<input disabled value={account.employee_id || ""} className={`${field} cursor-not-allowed opacity-70`} /></label>
              </div>
              <div className="flex justify-end"><button disabled={saving} className="flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"><FiSave />{saving ? "Saving..." : "Save Changes"}</button></div>
            </form>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
