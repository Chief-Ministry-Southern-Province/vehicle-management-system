import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCamera, FiCheck, FiLock, FiMoon, FiSave, FiSettings, FiShield, FiSun, FiUser } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import { changePassword, getProfile, updateProfile } from "../api/authApi";
import { useAuth } from "../context/useAuth";

export default function Setting() {
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
  const storedPicture = account.profile_picture_path
    ? `http://127.0.0.1:8000/${account.profile_picture_path}`
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

  const field = "mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-800 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600 dark:focus:ring-blue-950";
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
        <header className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-950 via-blue-950 to-blue-800 p-5 text-white shadow-[0_20px_55px_-30px_rgba(30,64,175,0.9)] sm:p-7">
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-xl text-cyan-200 ring-1 ring-inset ring-white/20 sm:h-14 sm:w-14 sm:text-2xl"><FiSettings /></span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200">Account control</p>{account.role && <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-blue-100 ring-1 ring-inset ring-white/15">{account.role.replaceAll("_", " ")}</span>}</div>
              <h1 className="mt-1 text-xl font-bold sm:text-3xl">User Settings</h1>
              <p className="mt-1 text-xs leading-5 text-blue-100/90 sm:text-sm">Personalize your profile, appearance, and account security.</p>
            </div>
          </div>
        </header>
        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_12px_35px_-25px_rgba(15,23,42,0.45)] dark:border-slate-700 dark:bg-slate-900 sm:p-6">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300"><FiSun /></span><div><h2 className="font-bold text-slate-900 dark:text-white">Appearance</h2><p className="text-xs text-slate-500 sm:text-sm">Choose how the system appears on this device.</p></div></div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
            {[{ value: "light", label: "Light mode", Icon: FiSun }, { value: "dark", label: "Dark mode", Icon: FiMoon }].map(({ value, label, Icon }) => (
              <button key={value} type="button" onClick={() => changeTheme(value)} className={`relative flex min-w-0 flex-col items-start gap-3 rounded-2xl border p-3 text-left transition sm:flex-row sm:items-center sm:p-5 ${theme === value ? "border-blue-500 bg-blue-50/80 ring-2 ring-blue-100 dark:bg-blue-950/60 dark:ring-blue-900" : "border-slate-200 hover:border-blue-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"}`}>
                <span className={`rounded-xl p-2.5 shadow-sm sm:p-3 ${theme === value ? "bg-blue-600 text-white" : "bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}><Icon size={20} /></span><span className="min-w-0"><strong className="block text-xs text-slate-900 dark:text-white sm:text-base">{label}</strong><span className="mt-0.5 hidden text-xs text-slate-500 sm:block sm:text-sm">{value === "light" ? "Standard bright display" : "Reduced-light display"}</span></span>{theme === value && <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] text-white sm:right-4 sm:top-4"><FiCheck /></span>}
              </button>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_16px_45px_-30px_rgba(15,23,42,0.5)] dark:border-slate-700 dark:bg-slate-900 sm:p-6">
          <div className="-mx-4 -mt-4 flex items-center gap-3 border-b border-slate-100 bg-linear-to-r from-blue-50/80 to-white px-4 py-4 dark:border-slate-700 dark:from-blue-950/40 dark:to-slate-900 sm:-mx-6 sm:-mt-6 sm:px-6 sm:py-5"><span className="rounded-xl bg-blue-600 p-3 text-white shadow-md shadow-blue-200 dark:shadow-none"><FiUser /></span><div><h2 className="font-bold text-slate-900 dark:text-white">Profile Details</h2><p className="text-xs text-slate-500 sm:text-sm">Update your personal information.</p></div></div>
          {loading ? <p className="py-10 text-center text-sm text-slate-500">Loading profile…</p> : (
            <form onSubmit={saveProfile} className="mt-6 space-y-5">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-blue-50 text-blue-700 shadow-md dark:border-slate-800 dark:bg-blue-950 dark:text-blue-300">
                  {displayedPicture ? <img src={displayedPicture} alt="Profile" className="h-full w-full object-cover" /> : <FiUser size={36} />}
                </div>
                <div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
                    <FiCamera /> Choose Profile Picture
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={selectProfilePicture} className="sr-only" />
                  </label>
                  <p className="mt-2 text-xs text-slate-500">JPG, PNG or WebP, up to 5 MB.</p>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Full Name<input disabled value={account.name || ""} className={`${field} cursor-not-allowed opacity-70`} /></label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Phone Number<input value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} className={field} /></label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email Address<input required type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} className={field} /></label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">NIC<input disabled value={account.employee_id || ""} className={`${field} cursor-not-allowed opacity-70`} /></label>
              </div>
              <div className="flex justify-end"><button disabled={saving} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-700 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 disabled:opacity-60 dark:shadow-none sm:w-auto"><FiSave />{saving ? "Saving..." : "Save Changes"}</button></div>
            </form>
          )}

          {!loading && account.role === "driver" && driver && (
            <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white">Driver Details</h3>
              <p className="mt-1 text-sm text-slate-500">Your registered driver and licence information.</p>
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
            <form onSubmit={savePassword} className="mt-8 rounded-2xl border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20 sm:p-5">
              <div className="flex items-center gap-3"><span className="rounded-xl bg-amber-100 p-3 text-amber-700 dark:bg-amber-950 dark:text-amber-300"><FiShield /></span><div><h3 className="font-bold text-slate-900 dark:text-white">Password &amp; Security</h3><p className="text-xs text-slate-500 sm:text-sm">Confirm your current password before setting a new one.</p></div></div>
              <div className="mt-5 grid gap-5 md:grid-cols-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Current Password<input required type="password" autoComplete="current-password" value={passwords.current_password} onChange={(e) => setPasswords((p) => ({ ...p, current_password: e.target.value }))} className={field} /></label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">New Password<input required minLength={8} type="password" autoComplete="new-password" value={passwords.password} onChange={(e) => setPasswords((p) => ({ ...p, password: e.target.value }))} className={field} /></label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Confirm New Password<input required minLength={8} type="password" autoComplete="new-password" value={passwords.password_confirmation} onChange={(e) => setPasswords((p) => ({ ...p, password_confirmation: e.target.value }))} className={field} /></label>
              </div>
              <div className="mt-5 flex justify-end"><button disabled={changingPassword} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-700 sm:w-auto"><FiLock />{changingPassword ? "Changing..." : "Change Password"}</button></div>
            </form>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
