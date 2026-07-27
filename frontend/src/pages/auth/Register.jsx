import { useState } from "react";
import toast from "react-hot-toast";
import {
  FiArrowRight, FiCalendar, FiCreditCard, FiDroplet,
  FiHash, FiHome, FiLock, FiMail, FiPhone, FiTruck, FiUser,
} from "react-icons/fi";
import { registerUser } from "../../api/authApi";
import DashboardLayout from "../../layouts/DashboardLayout";

const initialForm = {
  nic: "", name: "", email: "", phone: "", department: "", role: "employee",
  date_of_birth: "", address: "", licence_number: "", licence_type: "",
  licence_renewal_date: "", allocated_vehicle: "", blood_group: "",
  password: "", password_confirmation: "",
};
const roleOptions = [
  ["employee", "Employee"], ["department_officer", "Department Officer"],
  ["subject_officer", "Subject Officer"], ["deputy_secretary", "Deputy Secretary"],
  ["senior_deputy_secretary", "Senior Deputy Secretary"], ["secretary", "Secretary"], ["driver", "Driver"],
];
const branchOptions = ["Admin", "Planning", "Health", "Local Government", "Accounting", "IT Branch"];
const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const inputClass = "w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100";
const selectClass = "w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100";

function Field({ label, name, value, onChange, type = "text", placeholder, icon: Icon, required = true }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} className={inputClass} />
      </div>
    </label>
  );
}

export default function Register() {
  const [formData, setFormData] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = ({ target: { name, value } }) => setFormData((current) => ({ ...current, [name]: value }));
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.password_confirmation) { toast.error("Password confirmation does not match"); return; }
    setIsLoading(true);
    try { await registerUser(formData); toast.success("Employee account created successfully"); setFormData(initialForm); }
    catch (error) { toast.error(error?.message || error?.error || error?.detail || "Registration failed. Please check the entered details."); }
    finally { setIsLoading(false); }
  };
  const fieldProps = { onChange: handleChange };
  const needsBranch = ["employee", "department_officer", "subject_officer"].includes(formData.role);
  const isDriver = formData.role === "driver";

  return (
    <DashboardLayout>
      <section className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white px-5 py-8 shadow-sm md:px-10">
        <div className="w-full">
          <div className="flex items-center gap-4 border-b border-slate-200 pb-5">
            <div><p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-700">Administration Panel</p><h2 className="mt-2 text-3xl font-bold text-slate-900">Create Employee</h2><p className="mt-2 text-sm text-slate-500">Create and assign a staff account.</p></div>
          </div>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-5 md:grid-cols-2"><Field {...fieldProps} label="NIC" name="nic" value={formData.nic} placeholder="National Identity Card number" icon={FiCreditCard} /><Field {...fieldProps} label="Full Name" name="name" value={formData.name} placeholder="Full name" icon={FiUser} /></div>
            <div className="grid gap-5 md:grid-cols-2"><Field {...fieldProps} label="Email Address" name="email" value={formData.email} type="email" placeholder="name@gov.lk" icon={FiMail} /><Field {...fieldProps} label="Phone Number" name="phone" value={formData.phone} placeholder="07XXXXXXXX" icon={FiPhone} /></div>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Role</span><select name="role" value={formData.role} onChange={handleChange} className={selectClass}>{roleOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            </div>

            {needsBranch && (
              <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Branch</span><select name="department" value={formData.department} onChange={handleChange} required className={selectClass}><option value="" disabled>Select a branch</option>{branchOptions.map((branch) => <option key={branch} value={branch}>{branch}</option>)}</select></label>
            )}

            {isDriver && (
              <div className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                <h3 className="text-base font-bold text-slate-800">Driver Details</h3>
                <div className="grid gap-5 md:grid-cols-2"><Field {...fieldProps} label="Date of Birth" name="date_of_birth" value={formData.date_of_birth} type="date" icon={FiCalendar} /><Field {...fieldProps} label="Address" name="address" value={formData.address} placeholder="Residential address" icon={FiHome} /></div>
                <div className="grid gap-5 md:grid-cols-2"><Field {...fieldProps} label="License Number" name="licence_number" value={formData.licence_number} placeholder="License number" icon={FiHash} /><Field {...fieldProps} label="License Type" name="licence_type" value={formData.licence_type} placeholder="e.g. B, B1" icon={FiCreditCard} /></div>
                <div className="grid gap-5 md:grid-cols-2"><Field {...fieldProps} label="License Expiry Date" name="licence_renewal_date" value={formData.licence_renewal_date} type="date" icon={FiCalendar} /><Field {...fieldProps} label="Allocated Vehicle Registration (Optional)" name="allocated_vehicle" value={formData.allocated_vehicle} placeholder="e.g. GV-1002" icon={FiTruck} required={false} /></div>
                <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Blood Group</span><div className="relative"><FiDroplet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><select name="blood_group" value={formData.blood_group} onChange={handleChange} required className={`${selectClass} pl-11`}><option value="" disabled>Select blood group</option>{bloodGroupOptions.map((group) => <option key={group} value={group}>{group}</option>)}</select></div></label>
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2"><Field {...fieldProps} label="Password" name="password" value={formData.password} type="password" placeholder="••••••••" icon={FiLock} /><Field {...fieldProps} label="Confirm Password" name="password_confirmation" value={formData.password_confirmation} type="password" placeholder="••••••••" icon={FiLock} /></div>
            <button type="submit" disabled={isLoading} className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#0b3474] px-6 py-4 font-semibold text-white shadow-lg transition hover:bg-[#08285b] disabled:cursor-not-allowed disabled:opacity-60">{isLoading ? "Creating Account..." : <>Create Account <FiArrowRight className="transition group-hover:translate-x-1" /></>}</button>
          </form>
        </div>
      </section>
    </DashboardLayout>
  );
}
