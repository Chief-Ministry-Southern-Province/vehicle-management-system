import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiChevronDown,
  FiGlobe,
  FiKey,
  FiLock,
  FiMapPin,
  FiPhone,
  FiShield,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { forgotPassword } from "../../api/authApi";
import { useLanguage } from "../../context/useLanguage";
import nationalEmblem from "../../assets/national-emblem.png";
import loginPageBackground from "../../assets/login-page.png";

export default function ForgotPassword() {
  const { language, languages, setLanguage, t } = useLanguage();
  const recoveryLanguages = useMemo(() => languages.filter(({ code }) => ["en", "si"].includes(code)), [languages]);
  const [form, setForm] = useState({ employee_id: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!recoveryLanguages.some(({ code }) => code === language)) setLanguage("en");
  }, [language, recoveryLanguages, setLanguage]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await forgotPassword(form);
      toast.success(response.message);
    } catch (error) {
      const messages = error?.errors || {};
      setErrors(messages);
      const message = Object.values(messages).flat()[0]
        || error?.message
        || "Unable to send a temporary password. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError) => `w-full rounded-2xl border bg-white px-14 py-4 text-[15px] text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${hasError ? "border-rose-500 focus:border-rose-600 focus:ring-rose-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"}`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f9ff] text-[#082a62] lg:grid lg:grid-cols-[55%_45%]">
      <section className="relative hidden min-h-screen overflow-hidden lg:block">
        <img src={loginPageBackground} alt="Chief Ministry building and official vehicle fleet" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-[#031d4e]/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-transparent to-[#003b9c]/20" />
        <div className="relative z-10 flex min-h-screen flex-col px-10 py-7 xl:px-14 xl:py-9">
          <div className="flex w-fit items-start gap-4 rounded-2xl bg-white/70 px-4 py-3 backdrop-blur-sm">
            <img src={nationalEmblem} alt="Chief Ministry emblem" className="h-20 w-20 object-contain" />
            <div className="pt-1 font-serif leading-tight text-[#06275d]"><p className="text-2xl font-semibold">Chief Ministry</p><p className="text-lg">Southern Province</p><p className="text-sm">Sri Lanka</p><div className="mt-2 h-px w-full bg-[#1c5a9f]/35" /><p className="mt-2 font-sans text-[11px] font-semibold tracking-wide">Efficient Vehicles · Stronger Service · A Better Tomorrow</p></div>
          </div>
          <div className="mt-12 max-w-xl rounded-3xl bg-white/66 px-8 py-7 backdrop-blur-[2px] xl:mt-16">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#2765a8]">Secure account access</p>
            <h1 className="mt-3 text-5xl font-extrabold leading-[1.06] tracking-tight text-[#062961]">Password Recovery</h1>
            <p className="mt-4 max-w-md text-base font-medium leading-relaxed text-[#123a76]">Recover your account securely using your registered mobile number.</p>
            <div className="mt-7 flex items-center gap-3 text-sm font-bold text-[#083d82]"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl text-[#0759b2] shadow-md"><FiShield aria-hidden="true" /></span> Your account details stay protected.</div>
          </div>
          <p className="mt-auto flex items-center gap-2 text-sm font-medium text-white drop-shadow-md"><FiMapPin aria-hidden="true" /> Chief Ministry, Dakshinapaya, Labuduwa, Galle, Sri Lanka</p>
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a7ed2] via-[#0756aa] to-[#032c70] px-5 py-8 sm:px-8 lg:px-10 xl:px-14">
        <div className="absolute -left-24 top-8 h-96 w-96 rounded-full border-[46px] border-white/10" />
        <div className="absolute -right-20 bottom-[-7rem] h-80 w-80 rounded-full border-[45px] border-cyan-300/10" />
        <label className="absolute right-5 top-5 z-20 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-sm font-semibold text-[#073978] shadow-lg sm:right-8 sm:top-7">
          <FiGlobe className="text-lg" aria-hidden="true" /><span className="sr-only">{t("language.label", "Language")}</span>
          <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label={t("language.label", "Language")} className="max-w-24 cursor-pointer appearance-none bg-transparent pr-4 outline-none">{recoveryLanguages.map(({ code, nativeLabel }) => <option key={code} value={code}>{nativeLabel}</option>)}</select>
          <FiChevronDown className="pointer-events-none absolute right-3.5 text-xs" aria-hidden="true" />
        </label>

        <form onSubmit={submit} className="relative z-10 w-full max-w-[42rem] rounded-[2rem] border border-white/80 bg-white/95 px-6 py-7 shadow-[0_30px_80px_rgba(0,24,73,0.38)] backdrop-blur-xl sm:px-10 sm:py-8 lg:px-12">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center gap-3 text-[#0759b2]"><FiTruck className="text-5xl" aria-hidden="true" /><div className="text-left leading-tight"><h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">VMS-GOV</h1><p className="text-sm font-medium text-[#284c81]">Vehicle Management System</p></div></div>
            <span className="mx-auto mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-[#0759b2]"><FiKey aria-hidden="true" /></span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#082a62]">Forgot Password</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#345588] sm:text-base">Enter your User ID and registered mobile number. We will send a temporary password by SMS.</p>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block"><span className="mb-2 block text-sm font-semibold text-[#183b72]">User ID</span><span className="relative block"><FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-[#52709f]" aria-hidden="true" /><input required autoComplete="username" value={form.employee_id} onChange={(event) => updateField("employee_id", event.target.value)} placeholder="Enter your User ID" aria-invalid={Boolean(errors.employee_id)} aria-describedby={errors.employee_id ? "employee-id-error" : undefined} className={inputClass(Boolean(errors.employee_id))} /></span>{errors.employee_id && <span id="employee-id-error" role="alert" className="mt-2 block text-xs font-medium text-rose-600">{errors.employee_id[0]}</span>}</label>
            <label className="block"><span className="mb-2 block text-sm font-semibold text-[#183b72]">Registered mobile number</span><span className="relative block"><FiPhone className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-[#52709f]" aria-hidden="true" /><input required type="tel" autoComplete="tel" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="077XXXXXXX or 9477XXXXXXX" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} className={inputClass(Boolean(errors.phone))} /></span>{errors.phone && <span id="phone-error" role="alert" className="mt-2 block text-xs font-medium text-rose-600">{errors.phone[0]}</span>}</label>
          </div>

          <button type="submit" disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#095cab] to-[#063d83] px-6 py-3.5 text-lg font-bold text-white shadow-[0_12px_22px_rgba(6,67,145,0.28)] transition hover:from-[#064d94] hover:to-[#032d67] focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Sending temporary password..." : <>Send temporary password <FiLock aria-hidden="true" /></>}</button>
          <Link to="/" className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-[#075bd0] transition hover:text-[#043c94] hover:underline"><FiArrowLeft aria-hidden="true" /> Back to sign in</Link>
          <div className="mt-5 flex items-center gap-4 rounded-2xl bg-[#eaf5ff] px-5 py-3.5 text-[#0751a3]"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm"><FiShield aria-hidden="true" /></span><p className="text-sm leading-relaxed"><span className="block font-bold">Secure password recovery</span><span className="text-xs text-[#285992]">A temporary password is sent only when the User ID and mobile number match.</span></p></div>
        </form>
      </section>
    </main>
  );
}
