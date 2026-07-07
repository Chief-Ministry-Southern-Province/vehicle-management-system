import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiBriefcase,
  FiShield,
  FiArrowRight,
} from "react-icons/fi";

import { registerUser } from "../../api/authApi";
import nationalEmblem from "../../assets/national-emblem.png";

const initialForm = {
  employee_id: "",
  name: "",
  email: "",
  phone: "",
  department: "",
  role: "employee",
  password: "",
  password_confirmation: "",
};

const roleOptions = [
  { value: "employee", label: "Employee" },
  {
    value: "department_officer",
    label: "Department Officer",
  },
  {
    value: "subject_officer",
    label: "Subject Officer",
  },
  {
    value: "deputy_secretary",
    label: "Deputy Secretary",
  },
  {
    value: "secretary",
    label: "Secretary",
  },
  {
    value: "driver",
    label: "Driver",
  },
];

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState(initialForm);

  const [isLoading, setIsLoading] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      formData.password !==
      formData.password_confirmation
    ) {
      toast.error(
        "Password confirmation does not match"
      );
      return;
    }

    setIsLoading(true);

    try {
      await registerUser(formData);

      toast.success("Registration successful");

      navigate("/");
    } catch (error) {
      const message =
        error?.message ||
        error?.error ||
        error?.detail ||
        "Registration failed. Please check the entered details.";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl"></div>

        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-cyan-200/30 blur-3xl"></div>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">

        <div className="grid w-full max-w-7xl overflow-hidden rounded-[32px] bg-white shadow-2xl lg:grid-cols-2">

          {/* ================================= */}
          {/* LEFT PANEL */}
          {/* ================================= */}

          <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-10 text-white">

            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl"></div>

            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"></div>

            <div className="relative">

              <div className="flex items-center gap-5">

                <div className="rounded-3xl bg-white p-3 shadow-xl">

                  <img
                    src={nationalEmblem}
                    alt="National Emblem"
                    className="h-20 w-20 object-contain"
                  />

                </div>

                <div>

                  <h1 className="text-3xl font-bold tracking-wide">
                    Vehicle Management
                  </h1>

                  <h2 className="text-xl font-semibold text-blue-200">
                    System
                  </h2>

                  <p className="mt-2 text-sm text-slate-300">
                    Chief Ministry
                  </p>

                  <p className="text-sm text-slate-300">
                    Dakshinapaya, Labuduwa
                  </p>

                </div>

              </div>

              <div className="mt-16">

                <h3 className="text-4xl font-bold leading-tight">

                  Government Fleet
                  <br />
                  Registration Portal

                </h3>

                <p className="mt-6 max-w-md text-lg leading-8 text-slate-300">

                  Register employees securely to access
                  the official Government Vehicle
                  Management System.

                </p>

              </div>

            </div>

            <div className="space-y-5">

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">

                <div className="rounded-xl bg-blue-500 p-3">

                  <FiShield size={22} />

                </div>

                <div>

                  <h4 className="font-semibold">
                    Secure Authentication
                  </h4>

                  <p className="text-sm text-slate-300">
                    Protected government access.
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">

                <div className="rounded-xl bg-cyan-500 p-3">

                  <FiBriefcase size={22} />

                </div>

                <div>

                  <h4 className="font-semibold">
                    Official Staff Portal
                  </h4>

                  <p className="text-sm text-slate-300">
                    Register ministry employees.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ================================= */}
          {/* RIGHT PANEL */}
          {/* ================================= */}

          <div className="bg-white p-8 md:p-12">

            <div className="mb-10">

              <span className="rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">

                Government Registration

              </span>

              <h2 className="mt-5 text-4xl font-bold text-slate-800">

                Create Account

              </h2>

              <p className="mt-3 text-slate-500">

                Fill in your official information to
                register for the Vehicle Management
                System.

              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* ===========================
      Employee ID + Name
=========================== */}

<div className="grid gap-5 md:grid-cols-2">

  <div>

    <label className="mb-2 block text-sm font-semibold text-slate-700">
      Employee ID
    </label>

    <div className="relative">

      <FiBriefcase
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />

      <input
        type="text"
        name="employee_id"
        value={formData.employee_id}
        onChange={handleChange}
        required
        placeholder="EMP-001"
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-700 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />

    </div>

  </div>

  <div>

    <label className="mb-2 block text-sm font-semibold text-slate-700">
      Full Name
    </label>

    <div className="relative">

      <FiUser
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="Mayura Pabasara"
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-700 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />

    </div>

  </div>

</div>

{/* ===========================
      Email + Phone
=========================== */}

<div className="grid gap-5 md:grid-cols-2">

  <div>

    <label className="mb-2 block text-sm font-semibold text-slate-700">
      Email Address
    </label>

    <div className="relative">

      <FiMail
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        placeholder="name@gov.lk"
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-700 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />

    </div>

  </div>

  <div>

    <label className="mb-2 block text-sm font-semibold text-slate-700">
      Phone Number
    </label>

    <div className="relative">

      <FiPhone
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />

      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
        placeholder="07XXXXXXXX"
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-700 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />

    </div>

  </div>

</div>

{/* ===========================
      Department + Role
=========================== */}

<div className="grid gap-5 md:grid-cols-2">

  <div>

    <label className="mb-2 block text-sm font-semibold text-slate-700">
      Department
    </label>

    <div className="relative">

      <FiBriefcase
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />

      <input
        type="text"
        name="department"
        value={formData.department}
        onChange={handleChange}
        required
        placeholder="Information Technology"
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-700 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />

    </div>

  </div>

  <div>

    <label className="mb-2 block text-sm font-semibold text-slate-700">
      Role
    </label>

    <select
      name="role"
      value={formData.role}
      onChange={handleChange}
      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
    >

      {roleOptions.map((option) => (

        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>

      ))}

    </select>

  </div>

</div>

{/* ===========================
      Passwords
=========================== */}

<div className="grid gap-5 md:grid-cols-2">

  <div>

    <label className="mb-2 block text-sm font-semibold text-slate-700">
      Password
    </label>

    <div className="relative">

      <FiLock
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
        placeholder="••••••••"
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-700 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />

    </div>

  </div>

  <div>

    <label className="mb-2 block text-sm font-semibold text-slate-700">
      Confirm Password
    </label>

    <div className="relative">

      <FiLock
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />

      <input
        type="password"
        name="password_confirmation"
        value={formData.password_confirmation}
        onChange={handleChange}
        required
        placeholder="••••••••"
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-700 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />

    </div>

  </div>

</div>

{/* Submit */}

<button
  type="submit"
  disabled={isLoading}
  className="group mt-2 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 px-6 py-4 font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
>

  {isLoading
    ? "Creating Account..."
    : "Create Account"}

  {!isLoading && (
    <FiArrowRight
      className="transition-transform duration-300 group-hover:translate-x-1"
      size={18}
    />
  )}

</button>

<div className="pt-2 text-center text-sm text-slate-500">

  Already have an account?

  <Link
    to="/"
    className="ml-2 font-semibold text-blue-700 transition hover:text-blue-900"
  >
    Sign In
  </Link>

</div>

            </form>

            {/* Divider */}

            <div className="my-8 flex items-center">

              <div className="h-px flex-1 bg-slate-200"></div>

              <span className="px-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Government of Sri Lanka
              </span>

              <div className="h-px flex-1 bg-slate-200"></div>

            </div>

            {/* Footer */}

            <div className="space-y-3 text-center">

              <p className="text-sm text-slate-500 leading-6">
                Vehicle Management System provides a secure platform for
                government officers to manage vehicle requests, approvals,
                fleet operations, and transportation services.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2">

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  Secure Registration
                </span>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  Government Portal
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  Version 1.0
                </span>

              </div>

              <div className="pt-4 border-t border-slate-200">

                <h4 className="font-semibold text-slate-800">
                  Chief Ministry
                </h4>

                <p className="text-sm text-slate-500">
                  Dakshinapaya, Labuduwa, Galle
                </p>

                <p className="mt-3 text-xs text-slate-400">
                  © {new Date().getFullYear()} Government of Sri Lanka.
                  All Rights Reserved.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}