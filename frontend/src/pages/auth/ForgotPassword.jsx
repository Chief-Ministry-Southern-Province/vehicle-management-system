import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft, FiKey, FiPhone, FiUser } from "react-icons/fi";
import { forgotPassword } from "../../api/authApi";

export default function ForgotPassword() {
  const [form, setForm] = useState({ employee_id: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl text-blue-700">
          <FiKey aria-hidden="true" />
        </span>
        <h1 className="text-3xl font-bold text-slate-900">Forgot Password</h1>
        <p className="mb-6 mt-3 text-slate-600">
          Enter your User ID and registered mobile number. We will send a temporary password by SMS.
        </p>

        <label className="mb-4 block text-sm font-semibold text-slate-700">
          User ID
          <span className="relative mt-2 block">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              required
              autoComplete="username"
              value={form.employee_id}
              onChange={(event) => updateField("employee_id", event.target.value)}
              placeholder="Enter your User ID"
              aria-invalid={Boolean(errors.employee_id)}
              aria-describedby={errors.employee_id ? "employee-id-error" : undefined}
              className={`w-full rounded-xl border py-3 pl-10 pr-3 outline-none transition focus:ring-2 ${errors.employee_id ? "border-rose-500 focus:border-rose-600 focus:ring-rose-100" : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"}`}
            />
          </span>
          {errors.employee_id && <span id="employee-id-error" role="alert" className="mt-2 block text-xs font-medium text-rose-600">{errors.employee_id[0]}</span>}
        </label>

        <label className="mb-6 block text-sm font-semibold text-slate-700">
          Registered mobile number
          <span className="relative mt-2 block">
            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              required
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="077XXXXXXX or 9477XXXXXXX"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={`w-full rounded-xl border py-3 pl-10 pr-3 outline-none transition focus:ring-2 ${errors.phone ? "border-rose-500 focus:border-rose-600 focus:ring-rose-100" : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"}`}
            />
          </span>
          {errors.phone && <span id="phone-error" role="alert" className="mt-2 block text-xs font-medium text-rose-600">{errors.phone[0]}</span>}
        </label>

        <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-blue-700 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? "Sending temporary password..." : "Send temporary password"}
        </button>

        <Link to="/" className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
          <FiArrowLeft aria-hidden="true" /> Back to sign in
        </Link>
      </form>
    </div>
  );
}
