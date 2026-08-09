import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowRight, FiLock, FiUser } from "react-icons/fi";
import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/useAuth";
import nationalEmblem from "../../assets/national-emblem.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ employee_id: "", password: "", role: "employee" });
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });
  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await loginUser({ employee_id: formData.employee_id.trim(), password: formData.password });
      const payload = response?.data ?? response;
      const token = payload?.token ?? payload?.access_token ?? payload?.accessToken ?? payload?.data?.token ?? payload?.data?.access_token ?? null;
      const backendUser = payload?.user ?? payload?.data?.user ?? payload?.data ?? payload;
      const nextUser = {
        name: backendUser?.name ?? backendUser?.full_name ?? backendUser?.username ?? formData.employee_id,
        email: backendUser?.email ?? "",
        employee_id: backendUser?.employee_id ?? backendUser?.employeeId ?? backendUser?.id ?? backendUser?.user_id ?? formData.employee_id,
        role: backendUser?.role ?? backendUser?.user_role ?? formData.role,
      };
      login(token ? { ...nextUser, token } : nextUser, token);
      toast.success("Login successful");
      const routes = { employee: "/userdashboard", department_officer: "/departmentofficerdashboard", subject_officer: "/subjectofficerdashboard", deputy_secretary: "/deputysecretarydashboard", senior_deputy_secretary: "/seniordeputysecretarydashboard", secretary: "/secretarydashboard", driver: "/driverdashboard" };
      navigate(routes[nextUser.role] || "/");
    } catch (error) {
      toast.error(error?.message || error?.error || error?.detail || "Login failed. Please check your credentials.");
    } finally { setIsLoading(false); }
  };

  const inputClass = "w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-800 outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100";
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[42%_58%]">
      <section className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-[#061a3a] via-[#0b3474] to-[#062452] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-5">
            <div className="rounded-2xl bg-white p-3 shadow-xl"><img src={nationalEmblem} alt="National Emblem" className="h-20 w-20 object-contain" /></div>
            <div><h1 className="text-3xl font-bold">Vehicle Management</h1><p className="text-xl font-semibold text-blue-200">System</p><p className="mt-3 text-sm text-blue-100">Chief Ministry<br />Dakshinapaya, Labuduwa, Galle</p></div>
          </div>
          <div className="mt-24 border-l-4 border-amber-400 pl-7">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-200">Official Government Portal</p>
            <h2 className="mt-5 text-5xl font-bold leading-tight">Government Vehicle<br />Management System</h2>
          </div>
        </div>
        <p className="relative border-t border-white/20 pt-6 text-sm text-blue-100">Government of Sri Lanka</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-10 md:px-12 lg:px-20">
        <div className="w-full max-w-md">
          <div className="text-center">
            <img src={nationalEmblem} alt="National Emblem" className="mx-auto h-24 w-24 object-contain lg:hidden" />
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-blue-700">Authorized Access</p>
            <h2 className="mt-3 text-4xl font-bold text-slate-900">Sign In</h2>
          </div>
          <form onSubmit={handleLogin} className="mt-10 space-y-6">
            <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Employee ID</span><div className="relative"><FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" name="employee_id" value={formData.employee_id} onChange={handleChange} required autoComplete="username" placeholder="Enter your Employee ID" className={inputClass} /></div></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Password</span><div className="relative"><FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className={inputClass} /></div></label>
            <button type="submit" disabled={isLoading} className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#0b3474] px-6 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-[#08285b] disabled:cursor-not-allowed disabled:opacity-60">{isLoading ? "Signing In..." : <>Sign In <FiArrowRight className="transition group-hover:translate-x-1" /></>}</button>
            <div className="flex justify-between text-sm"><Link to="/forgot-password" className="font-medium text-blue-700 hover:text-blue-900">Forgot Password?</Link></div>
          </form>
          <p className="mt-12 text-center text-xs uppercase tracking-[0.2em] text-slate-400">Government of Sri Lanka</p>
        </div>
      </section>
    </main>
  );
}
