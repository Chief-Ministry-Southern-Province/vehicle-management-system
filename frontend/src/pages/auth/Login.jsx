import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowRight,
  FiChevronDown,
  FiEye,
  FiEyeOff,
  FiGlobe,
  FiLock,
  FiMapPin,
  FiShield,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/useAuth";
import { useLanguage } from "../../context/useLanguage";
import nationalEmblem from "../../assets/national-emblem.png";
import loginPageBackground from "../../assets/login-page.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language, languages, setLanguage, t } = useLanguage();
  const loginLanguages = useMemo(() => languages.filter(({ code }) => ["en", "si"].includes(code)), [languages]);
  const [formData, setFormData] = useState({ employee_id: "", password: "", role: "employee" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!loginLanguages.some(({ code }) => code === language)) setLanguage("en");
  }, [language, loginLanguages, setLanguage]);

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
      const routes = { employee: "/userdashboard", department_officer: "/departmentofficerdashboard", subject_officer: "/subjectofficerdashboard", deputy_secretary: "/deputysecretarydashboard", system_admin: "/systemadmindashboard", senior_deputy_secretary: "/seniordeputysecretarydashboard", secretary: "/secretarydashboard", driver: "/driverdashboard" };
      navigate(routes[nextUser.role] || "/");
    } catch (error) {
      toast.error(error?.message || error?.error || error?.detail || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-14 py-4 text-[15px] text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f9ff] text-[#082a62] lg:grid lg:grid-cols-[55%_45%]">
      <section className="relative hidden min-h-screen overflow-hidden lg:block">
        <img src={loginPageBackground} alt="Chief Ministry building and official vehicle fleet" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-[#031d4e]/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-transparent to-[#003b9c]/20" />

        <div className="relative z-10 flex min-h-screen flex-col px-10 py-7 xl:px-14 xl:py-9">
          <div className="flex w-fit items-start gap-4 rounded-2xl bg-white/70 px-4 py-3 backdrop-blur-sm">
            <img src={nationalEmblem} alt="Chief Ministry emblem" className="h-20 w-20 object-contain" />
            <div className="pt-1 font-serif leading-tight text-[#06275d]">
              <p className="text-2xl font-semibold">Chief Ministry</p>
              <p className="text-lg">Southern Province</p>
              <p className="text-sm">Sri Lanka</p>
              <div className="mt-2 h-px w-full bg-[#1c5a9f]/35" />
              <p className="mt-2 font-sans text-[11px] font-semibold tracking-wide">Efficient Vehicles · Stronger Service · A Better Tomorrow</p>
            </div>
          </div>

          <div className="mt-10 max-w-xl rounded-3xl bg-white/66 px-6 py-5 backdrop-blur-[2px] xl:mt-14 xl:px-8 xl:py-6">
            <p className="text-4xl font-extrabold leading-[1.06] tracking-tight text-[#062961] xl:text-5xl">Vehicle Management<br />System <span className="font-medium">(VMS)</span></p>
            <p className="mt-3 text-sm font-medium text-[#123a76] xl:text-base">Manage Vehicles | Optimize Resources | Deliver Better Services</p>
            <div className="mt-6 grid grid-cols-4 gap-3 text-center text-[#083d82]">
              {[
                [FiTruck, "Efficient", "Allocation"],
                [FiMapPin, "Better", "Planning"],
                [FiShield, "Accountable", "Operations"],
                [FiArrowRight, "Data Driven", "Decisions"],
              ].map(([Icon, firstLine, secondLine]) => (
                <div key={firstLine} className="flex flex-col items-center gap-1.5 text-[10px] font-bold leading-tight xl:text-xs">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl text-[#0759b2] shadow-md xl:h-12 xl:w-12"><Icon aria-hidden="true" /></span>
                  <span>{firstLine}<br />{secondLine}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-auto flex items-center gap-2 text-sm font-medium text-white drop-shadow-md"><FiMapPin aria-hidden="true" /> Chief Ministry, Dakshinapaya, Labuduwa, Galle, Sri Lanka</p>
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a7ed2] via-[#0756aa] to-[#032c70] px-5 py-8 sm:px-8 lg:px-10 xl:px-14">
        <div className="absolute -left-24 top-8 h-96 w-96 rounded-full border-[46px] border-white/10" />
        <div className="absolute -right-20 bottom-[-7rem] h-80 w-80 rounded-full border-[45px] border-cyan-300/10" />

        <label className="absolute right-5 top-5 z-20 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-sm font-semibold text-[#073978] shadow-lg sm:right-8 sm:top-7">
          <FiGlobe className="text-lg" aria-hidden="true" />
          <span className="sr-only">{t("language.label", "Language")}</span>
          <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label={t("language.label", "Language")} className="max-w-24 cursor-pointer appearance-none bg-transparent pr-4 outline-none">
            {loginLanguages.map(({ code, nativeLabel }) => <option key={code} value={code}>{nativeLabel}</option>)}
          </select>
          <FiChevronDown className="pointer-events-none absolute right-3.5 text-xs" aria-hidden="true" />
        </label>

        <div className="relative z-10 w-full max-w-[42rem] rounded-[2rem] border border-white/80 bg-white/95 px-6 py-10 shadow-[0_30px_80px_rgba(0,24,73,0.38)] backdrop-blur-xl sm:px-10 sm:py-12 lg:px-12">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center gap-3 text-[#0759b2]">
              <FiTruck className="text-5xl" aria-hidden="true" />
              <div className="text-left leading-tight"><h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">VMS-GOV</h1><p className="text-sm font-medium text-[#284c81]">Vehicle Management System</p></div>
            </div>
            <h2 className="mt-9 text-3xl font-extrabold tracking-tight text-[#082a62]">Welcome Back</h2>
            <p className="mt-2 text-sm text-[#345588] sm:text-base">Sign in to continue to the Vehicle Management System</p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <label className="block"><span className="sr-only">Employee ID</span><div className="relative"><FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-[#52709f]" aria-hidden="true" /><input type="text" name="employee_id" value={formData.employee_id} onChange={handleChange} required autoComplete="username" placeholder="User ID" className={inputClass} /></div></label>
            <label className="block"><span className="sr-only">Password</span><div className="relative"><FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-[#52709f]" aria-hidden="true" /><input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required autoComplete="current-password" placeholder="Password" className={inputClass} /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#52709f] transition hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">{showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}</button></div></label>
            <div className="flex justify-end"><Link to="/forgot-password" className="text-sm font-semibold text-[#075bd0] transition hover:text-[#043c94] hover:underline">Forgot Password?</Link></div>
            <button type="submit" disabled={isLoading} className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#095cab] to-[#063d83] px-6 py-4 text-lg font-bold text-white shadow-[0_12px_22px_rgba(6,67,145,0.28)] transition hover:from-[#064d94] hover:to-[#032d67] focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60">{isLoading ? "Signing In..." : <>Login <FiArrowRight className="text-xl transition group-hover:translate-x-1" aria-hidden="true" /></>}</button>
          </form>

          <div className="my-8 flex items-center gap-4 text-sm font-semibold text-[#123d7c] before:h-px before:flex-1 before:bg-[#d4e1f2] after:h-px after:flex-1 after:bg-[#d4e1f2]">or</div>
          <div className="flex items-center gap-4 rounded-2xl bg-[#eaf5ff] px-5 py-4 text-[#0751a3]"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm"><FiShield aria-hidden="true" /></span><p className="text-sm leading-relaxed"><span className="block font-bold">Authorized Users Only</span><span className="text-xs text-[#285992]">For official use of the Chief Ministry - Southern Province.</span></p></div>
        </div>

        <p className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap text-xs font-medium text-blue-100 lg:block">People&nbsp;&nbsp; | &nbsp;&nbsp;Service&nbsp;&nbsp; | &nbsp;&nbsp;Sustainability</p>
      </section>
    </main>
  );
}
