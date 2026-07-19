import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowRight, FiBriefcase, FiLock, FiMail, FiPhone, FiUser } from "react-icons/fi";
import { registerUser } from "../../api/authApi";
import nationalEmblem from "../../assets/national-emblem.png";

const initialForm = { employee_id: "", name: "", email: "", phone: "", department: "", role: "employee", password: "", password_confirmation: "" };
const roleOptions = [
  ["employee", "Employee"], ["department_officer", "Department Officer"],
  ["subject_officer", "Subject Officer"], ["deputy_secretary", "Deputy Secretary"],
  ["senior_deputy_secretary", "Senior Deputy Secretary"], ["secretary", "Secretary"], ["driver", "Driver"],
];
const inputClass = "w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100";

function Field({ label, name, value, onChange, type = "text", placeholder, icon: Icon }) {
  return (
    <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span><div className="relative"><Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input type={type} name={name} value={value} onChange={onChange} required placeholder={placeholder} className={inputClass} /></div></label>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = ({ target: { name, value } }) => setFormData((current) => ({ ...current, [name]: value }));
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.password_confirmation) { toast.error("Password confirmation does not match"); return; }
    setIsLoading(true);
    try { await registerUser(formData); toast.success("Registration successful"); navigate("/"); }
    catch (error) { toast.error(error?.message || error?.error || error?.detail || "Registration failed. Please check the entered details."); }
    finally { setIsLoading(false); }
  };
  const fieldProps = { onChange: handleChange };

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[38%_62%]">
      <section className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-[#061a3a] via-[#0b3474] to-[#062452] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-5">
            <div className="rounded-2xl bg-white p-3 shadow-xl"><img src={nationalEmblem} alt="National Emblem" className="h-20 w-20 object-contain" /></div>
            <div><h1 className="text-3xl font-bold">Vehicle Management</h1><p className="text-xl font-semibold text-blue-200">System</p><p className="mt-3 text-sm text-blue-100">Chief Ministry<br />Dakshinapaya, Labuduwa, Galle</p></div>
          </div>
          <div className="mt-24 border-l-4 border-amber-400 pl-7"><p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-200">Official Government Portal</p><h2 className="mt-5 text-5xl font-bold leading-tight">Staff Account<br />Registration</h2></div>
        </div>
        <p className="relative border-t border-white/20 pt-6 text-sm text-blue-100">Government of Sri Lanka</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-8 md:px-10 lg:px-14 xl:px-20">
        <div className="w-full max-w-3xl">
          <div className="flex items-center gap-4 border-b border-slate-200 pb-5">
            <img src={nationalEmblem} alt="National Emblem" className="h-16 w-16 object-contain lg:hidden" />
            <div><p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-700">Official Registration</p><h2 className="mt-2 text-3xl font-bold text-slate-900">Create Account</h2></div>
          </div>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-5 md:grid-cols-2"><Field {...fieldProps} label="Employee ID" name="employee_id" value={formData.employee_id} placeholder="EMP-001" icon={FiBriefcase} /><Field {...fieldProps} label="Full Name" name="name" value={formData.name} placeholder="Full name" icon={FiUser} /></div>
            <div className="grid gap-5 md:grid-cols-2"><Field {...fieldProps} label="Email Address" name="email" value={formData.email} type="email" placeholder="name@gov.lk" icon={FiMail} /><Field {...fieldProps} label="Phone Number" name="phone" value={formData.phone} placeholder="07XXXXXXXX" icon={FiPhone} /></div>
            <div className="grid gap-5 md:grid-cols-2">
              <Field {...fieldProps} label="Department" name="department" value={formData.department} placeholder="Department" icon={FiBriefcase} />
              <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Role</span><select name="role" value={formData.role} onChange={handleChange} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100">{roleOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            </div>
            <div className="grid gap-5 md:grid-cols-2"><Field {...fieldProps} label="Password" name="password" value={formData.password} type="password" placeholder="••••••••" icon={FiLock} /><Field {...fieldProps} label="Confirm Password" name="password_confirmation" value={formData.password_confirmation} type="password" placeholder="••••••••" icon={FiLock} /></div>
            <button type="submit" disabled={isLoading} className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#0b3474] px-6 py-4 font-semibold text-white shadow-lg transition hover:bg-[#08285b] disabled:cursor-not-allowed disabled:opacity-60">{isLoading ? "Creating Account..." : <>Create Account <FiArrowRight className="transition group-hover:translate-x-1" /></>}</button>
            <p className="text-center text-sm text-slate-500">Already have an account? <Link to="/" className="ml-1 font-semibold text-blue-700 hover:text-blue-900">Sign In</Link></p>
          </form>
        </div>
      </section>
    </main>
  );
}
