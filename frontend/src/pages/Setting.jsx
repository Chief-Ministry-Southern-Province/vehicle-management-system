import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCamera, FiCheck, FiLock, FiMoon, FiSave, FiSun, FiUser } from "react-icons/fi";
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
              <div className="flex justify-end"><button disabled={saving} className="flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"><FiSave />{saving ? "Saving..." : "Save Changes"}</button></div>
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
            <form onSubmit={savePassword} className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-700">
              <div className="flex items-center gap-3"><span className="rounded-xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><FiLock /></span><div><h3 className="font-bold text-slate-900 dark:text-white">Change Password</h3><p className="text-sm text-slate-500">Confirm your current password before setting a new one.</p></div></div>
              <div className="mt-5 grid gap-5 md:grid-cols-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Current Password<input required type="password" autoComplete="current-password" value={passwords.current_password} onChange={(e) => setPasswords((p) => ({ ...p, current_password: e.target.value }))} className={field} /></label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">New Password<input required minLength={8} type="password" autoComplete="new-password" value={passwords.password} onChange={(e) => setPasswords((p) => ({ ...p, password: e.target.value }))} className={field} /></label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Confirm New Password<input required minLength={8} type="password" autoComplete="new-password" value={passwords.password_confirmation} onChange={(e) => setPasswords((p) => ({ ...p, password_confirmation: e.target.value }))} className={field} /></label>
              </div>
              <div className="mt-5 flex justify-end"><button disabled={changingPassword} className="flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"><FiLock />{changingPassword ? "Changing..." : "Change Password"}</button></div>
            </form>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
