import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiBriefcase, FiCamera, FiCheck, FiLock, FiMail, FiMoon, FiPhone, FiSave, FiSettings, FiShield, FiSun, FiUser, FiX } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import { changePassword, getProfile, updateProfile } from "../api/authApi";
import { useAuth } from "../context/useAuth";

export default function Setting({ embedded = false, onClose }) {
  const { user, token, login } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [profile, setProfile] = useState({
    phone: user?.phone || "",
    email: user?.email || "",
  });
  const [account, setAccount] = useState(user || {});
  const [profilePicture, setProfilePicture] = useState(null);
  const [picturePreview, setPicturePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => () => {
    if (picturePreview) URL.revokeObjectURL(picturePreview);
  }, [picturePreview]);

  useEffect(() => {
    let active = true;
    getProfile().then((response) => {
      const currentUser = response?.data?.user;
      if (!active || !currentUser) return;
      setAccount(currentUser);
      setProfile({
        phone: currentUser.phone || "",
        email: currentUser.email || "",
      });
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
      const formData = new FormData();
      formData.append("phone", profile.phone || "");
      if (profilePicture) formData.append("profile_picture", profilePicture);
      const response = await updateProfile(formData);
      const updatedUser = response?.data?.user;
      if (updatedUser) {
        setAccount(updatedUser);
        setProfilePicture(null);
        setPicturePreview(null);
        login({ ...user, ...updatedUser }, token);
      }
      toast.success("Profile updated successfully");
    } catch (error) { toast.error(error?.message || "Unable to update profile details."); }
    finally { setSaving(false); }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    if (passwords.password !== passwords.password_confirmation) {
      toast.error("New password confirmation does not match.");
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword(passwords);
      setPasswords({ current_password: "", password: "", password_confirmation: "" });
      toast.success("Password changed successfully.");
    } catch (error) {
      toast.error(error?.message || "Unable to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  const driver = account.driver;
  const serverUrl =
    import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
    "http://127.0.0.1:8000";
  const storedPicture = account.profile_picture_path
    ? `${serverUrl}/${account.profile_picture_path}`
    : null;
  const displayedPicture = picturePreview || storedPicture;

  const selectProfilePicture = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile picture must be 5 MB or smaller.");
      return;
    }
    if (picturePreview) URL.revokeObjectURL(picturePreview);
    setProfilePicture(file);
    setPicturePreview(URL.createObjectURL(file));
  };

  const field = "mt-2 min-h-12 w-full rounded-xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100/80 disabled:bg-slate-100/70 dark:border-slate-700/90 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:focus:border-blue-400 dark:focus:ring-blue-950";
  const content = (
      <div className="relative mx-auto max-w-7xl space-y-5 sm:space-y-7">
        <div className="pointer-events-none absolute inset-x-12 top-28 -z-10 h-72 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-700/10" />
        <header className="relative overflow-hidden rounded-[1.75rem] bg-linear-to-br from-slate-950 via-[#102a5c] to-blue-700 p-5 text-white shadow-[0_28px_70px_-32px_rgba(15,23,42,0.9)] sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-indigo-400/20 blur-3xl" />
          <div className="relative flex items-center gap-4 sm:gap-6">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/25 bg-white/10 text-2xl text-cyan-100 shadow-xl shadow-blue-950/30 backdrop-blur sm:h-16 sm:w-16 sm:text-3xl">
              {displayedPicture ? <img src={displayedPicture} alt="Profile" className="h-full w-full object-cover" /> : <FiSettings />}
              <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-blue-900 bg-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2"><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-200">Your workspace</p>{account.role && <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-50 backdrop-blur">{account.role.replaceAll("_", " ")}</span>}</div>
              <h1 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-4xl">User Settings</h1>
              <p className="mt-2 max-w-xl text-xs leading-5 text-blue-100/90 sm:text-sm sm:leading-6">Manage your profile, visual preferences, and account security from one refined space.</p>
              <div className="mt-3 hidden flex-wrap items-center gap-2 text-[11px] text-blue-100/90 sm:flex"><span className="rounded-lg border border-white/10 bg-white/[0.08] px-2.5 py-1.5">{account.name || "Your account"}</span>{account.employee_id && <span className="rounded-lg border border-white/10 bg-white/[0.08] px-2.5 py-1.5">ID · {account.employee_id}</span>}</div>
            </div>
            {onClose && <button type="button" onClick={onClose} className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white/40" aria-label="Close user settings"><FiX size={20} /></button>}
          </div>
        </header>
        <section className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.55)] dark:border-slate-700/80 dark:bg-slate-900 sm:p-6">
          <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 shadow-sm dark:bg-violet-950 dark:text-violet-300"><FiSun /></span><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">Display</p><h2 className="mt-0.5 font-bold text-slate-900 dark:text-white">Appearance</h2><p className="mt-0.5 text-xs text-slate-500 sm:text-sm">Choose how the system appears on this device.</p></div></div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
            {[{ value: "light", label: "Light mode", Icon: FiSun }, { value: "dark", label: "Dark mode", Icon: FiMoon }].map(({ value, label, Icon }) => (
              <button key={value} type="button" onClick={() => changeTheme(value)} className={`relative flex min-w-0 flex-col items-start gap-3 rounded-2xl border p-3 text-left transition duration-200 hover:-translate-y-0.5 sm:flex-row sm:items-center sm:p-5 ${theme === value ? "border-blue-500 bg-blue-50/80 ring-2 ring-blue-100 shadow-sm dark:bg-blue-950/60 dark:ring-blue-900" : "border-slate-200 bg-slate-50/60 hover:border-blue-200 hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-800"}`}>
                <span className={`rounded-xl p-2.5 shadow-sm sm:p-3 ${theme === value ? "bg-blue-600 text-white shadow-blue-200" : "bg-white text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}><Icon size={20} /></span><span className="min-w-0"><strong className="block text-xs text-slate-900 dark:text-white sm:text-base">{label}</strong><span className="mt-0.5 hidden text-xs text-slate-500 sm:block sm:text-sm">{value === "light" ? "Standard bright display" : "Reduced-light display"}</span></span>{theme === value && <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] text-white sm:right-4 sm:top-4"><FiCheck /></span>}
              </button>
            ))}
          </div>
        </section>
        <section className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white p-4 shadow-[0_24px_55px_-38px_rgba(15,23,42,0.65)] dark:border-slate-700/80 dark:bg-slate-900 sm:p-6">
          <div className="-mx-4 -mt-4 flex items-center gap-3 border-b border-slate-100 bg-linear-to-r from-blue-50 via-white to-white px-4 py-4 dark:border-slate-700 dark:from-blue-950/40 dark:via-slate-900 dark:to-slate-900 sm:-mx-6 sm:-mt-6 sm:px-6 sm:py-5"><span className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-200/70 dark:shadow-none"><FiUser /></span><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">Personal identity</p><h2 className="mt-0.5 font-bold text-slate-900 dark:text-white">Profile Details</h2><p className="mt-0.5 text-xs text-slate-500 sm:text-sm">Keep the essentials on your account current.</p></div></div>
          {loading ? <p className="py-10 text-center text-sm text-slate-500">Loading profile…</p> : (
            <form onSubmit={saveProfile} className="mt-6 space-y-6">
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40 sm:flex-row sm:p-5">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-linear-to-br from-blue-100 to-indigo-100 text-blue-700 shadow-lg shadow-blue-100/70 dark:border-slate-800 dark:from-blue-950 dark:to-indigo-950 dark:text-blue-300">
                  {displayedPicture ? <img src={displayedPicture} alt="Profile" className="h-full w-full object-cover" /> : <FiUser size={36} />}
                  <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-800" />
                </div>
                <div className="min-w-0 flex-1"><p className="font-semibold text-slate-800 dark:text-slate-100">Profile picture</p><p className="mt-1 text-xs leading-5 text-slate-500">A clear photo helps colleagues recognize your account.</p>
                  <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-blue-700 dark:hover:text-blue-300">
                    <FiCamera /> Choose Profile Picture
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={selectProfilePicture} className="sr-only" />
                  </label>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Full Name<input disabled value={account.name || ""} className={`${field} cursor-not-allowed opacity-70`} /></label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Phone Number<input value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} className={field} /></label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email Address<input required type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} className={field} /></label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">NIC<input disabled value={account.employee_id || ""} className={`${field} cursor-not-allowed opacity-70`} /></label>
              </div>
              <div className="grid gap-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 sm:grid-cols-3"><span className="flex min-w-0 items-center gap-2 rounded-xl bg-white/80 px-3 py-2 dark:bg-slate-900/60"><FiMail className="shrink-0 text-blue-600 dark:text-blue-300" /><span className="truncate">{profile.email || "Email not provided"}</span></span><span className="flex min-w-0 items-center gap-2 rounded-xl bg-white/80 px-3 py-2 dark:bg-slate-900/60"><FiPhone className="shrink-0 text-blue-600 dark:text-blue-300" /><span className="truncate">{profile.phone || "Phone not provided"}</span></span><span className="flex min-w-0 items-center gap-2 rounded-xl bg-white/80 px-3 py-2 dark:bg-slate-900/60"><FiBriefcase className="shrink-0 text-blue-600 dark:text-blue-300" /><span className="truncate">{account.department || "Department not provided"}</span></span></div>
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800"><p className="text-xs text-slate-500">Your account identity fields are protected.</p><button disabled={saving} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-700 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200/70 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-none sm:w-auto"><FiSave />{saving ? "Saving..." : "Save Changes"}</button></div>
            </form>
          )}

          {!loading && account.role === "driver" && driver && (
            <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/30">
              <div className="flex items-center gap-3"><span className="rounded-xl bg-indigo-100 p-2.5 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"><FiBriefcase /></span><div><h3 className="font-bold text-slate-900 dark:text-white">Driver Details</h3><p className="mt-1 text-sm text-slate-500">Your registered driver and licence information.</p></div></div>
              <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {[
                  ["Name", driver.full_name],
                  ["NIC", driver.nic],
                  ["Address", driver.address],
                  ["Licence Type", driver.licence_type],
                  ["Licence Number", driver.licence_number],
                  ["Licence Expiry Date", driver.licence_renewal_date],
                  ["Contact Number", driver.contact_number],
                  ["Allocated Vehicle", driver.allocated_vehicle || "Not allocated"],
                  ["Blood Group", driver.blood_group],
                ].map(([label, value]) => (
                  <label key={label} className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {label}<input disabled value={value || "Not provided"} className={`${field} cursor-not-allowed opacity-70`} />
                  </label>
                ))}
              </div>
            </div>
          )}

          {!loading && (
            <form onSubmit={savePassword} className="mt-8 rounded-2xl border border-amber-100 bg-linear-to-br from-amber-50/80 to-white p-4 dark:border-amber-900/50 dark:from-amber-950/20 dark:to-slate-900 sm:p-5">
              <div className="flex items-center gap-3"><span className="rounded-2xl bg-amber-100 p-3 text-amber-700 shadow-sm dark:bg-amber-950 dark:text-amber-300"><FiShield /></span><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">Protected access</p><h3 className="mt-0.5 font-bold text-slate-900 dark:text-white">Password &amp; Security</h3><p className="mt-1 text-xs text-slate-500 sm:text-sm">Confirm your current password before setting a new one.</p></div></div>
              <div className="mt-5 grid gap-5 md:grid-cols-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Current Password<input required type="password" autoComplete="current-password" value={passwords.current_password} onChange={(e) => setPasswords((p) => ({ ...p, current_password: e.target.value }))} className={field} /></label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">New Password<input required minLength={8} type="password" autoComplete="new-password" value={passwords.password} onChange={(e) => setPasswords((p) => ({ ...p, password: e.target.value }))} className={field} /></label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Confirm New Password<input required minLength={8} type="password" autoComplete="new-password" value={passwords.password_confirmation} onChange={(e) => setPasswords((p) => ({ ...p, password_confirmation: e.target.value }))} className={field} /></label>
              </div>
              <div className="mt-5 flex justify-end"><button disabled={changingPassword} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300/60 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:shadow-none dark:hover:bg-blue-700 sm:w-auto"><FiLock />{changingPassword ? "Changing..." : "Change Password"}</button></div>
            </form>
          )}
        </section>
      </div>
  );

  return embedded ? content : <DashboardLayout>{content}</DashboardLayout>;
}
