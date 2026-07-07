import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FiMail,
  FiLock,
  FiShield,
  FiArrowRight,
} from "react-icons/fi";

import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/useAuth";

import nationalEmblem from "../../assets/national-emblem.png";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "employee",
  });

  const [isLoading, setIsLoading] =
    useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]:
        event.target.value,
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      const payload =
        response?.data ?? response;

      const token =
        payload?.token ??
        payload?.access_token ??
        payload?.accessToken ??
        payload?.data?.token ??
        payload?.data?.access_token ??
        null;

      const backendUser =
        payload?.user ??
        payload?.data?.user ??
        payload?.data ??
        payload;

      const nextUser = {
        name:
          backendUser?.name ??
          backendUser?.full_name ??
          backendUser?.username ??
          formData.email.split("@")[0],

        email:
          backendUser?.email ??
          formData.email,

        employee_id:
          backendUser?.employee_id ??
          backendUser?.employeeId ??
          backendUser?.id ??
          backendUser?.user_id ??
          "",

        role:
          backendUser?.role ??
          backendUser?.user_role ??
          formData.role,
      };

      login(
        token
          ? {
              ...nextUser,
              token,
            }
          : nextUser,
        token
      );

      toast.success("Login successful");

      switch (nextUser.role) {
        case "employee":
          navigate("/userdashboard");
          break;

        case "department_officer":
          navigate(
            "/departmentofficerdashboard"
          );
          break;

        case "subject_officer":
          navigate(
            "/subjectofficerdashboard"
          );
          break;

        case "deputy_secretary":
          navigate(
            "/deputysecretarydashboard"
          );
          break;

        case "secretary":
          navigate(
            "/secretarydashboard"
          );
          break;

        case "driver":
          navigate("/driverdashboard");
          break;

        default:
          navigate("/");
      }
    } catch (error) {
      const message =
        error?.message ||
        error?.error ||
        error?.detail ||
        "Login failed. Please check your credentials.";

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
          {/* LEFT GOVERNMENT PANEL */}
          {/* ================================= */}

          <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-10 text-white">

            {/* Background Decorations */}

            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"></div>

            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"></div>

            {/* Logo */}

            <div className="relative">

              <div className="flex items-center gap-5">

                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-2xl">

                  <img
                    src={nationalEmblem}
                    alt="National Emblem"
                    className="h-16 w-16 object-contain"
                  />

                </div>

                <div>

                  <h1 className="text-3xl font-bold tracking-wide">
                    Vehicle Management
                  </h1>

                  <h2 className="text-2xl font-semibold text-blue-200">
                    System
                  </h2>

                  <div className="mt-3 space-y-1 text-sm text-slate-300">

                    <p>Chief Ministry</p>

                    <p>Dakshinapaya</p>

                    <p>Labuduwa, Galle</p>

                  </div>

                </div>

              </div>

              {/* Heading */}

              <div className="mt-16">

                <span className="rounded-full border border-blue-300/30 bg-blue-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-200">

                  Government Portal

                </span>

                <h2 className="mt-6 text-5xl font-bold leading-tight">

                  Welcome
                  <br />
                  Back

                </h2>

                <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">

                  Sign in to securely access the official
                  Government Vehicle Management System and
                  manage vehicle requests, approvals,
                  fleet operations, drivers and transport
                  services.

                </p>

              </div>

            </div>

            {/* Feature Cards */}

            <div className="space-y-5">

              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm transition-all duration-300 hover:bg-white/15">

                <div className="flex items-center gap-4">

                  <div className="rounded-xl bg-blue-600 p-3">

                    <FiShield size={22} />

                  </div>

                  <div>

                    <h3 className="font-semibold text-lg">
                      Secure Authentication
                    </h3>

                    <p className="mt-1 text-sm text-slate-300">
                      Protected access for authorized
                      government officers.
                    </p>

                  </div>

                </div>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm transition-all duration-300 hover:bg-white/15">

                <div className="flex items-center gap-4">

                  <div className="rounded-xl bg-cyan-600 p-3">

                    <FiMail size={22} />

                  </div>

                  <div>

                    <h3 className="font-semibold text-lg">
                      Digital Fleet Services
                    </h3>

                    <p className="mt-1 text-sm text-slate-300">
                      Modern vehicle request and fleet
                      management platform for the
                      Government of Sri Lanka.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ================================= */}
          {/* LOGIN FORM */}
          {/* ================================= */}

          <div className="flex items-center justify-center bg-white p-8 md:p-12">

            <div className="w-full max-w-md">

              <div className="mb-10 text-center">

                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 shadow-lg">

                  <img
                    src={nationalEmblem}
                    alt="Government Logo"
                    className="h-26 w-26 object-contain"
                  />

                </div>

                <span className="mt-6 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">

                  Secure Login

                </span>

                <h2 className="mt-5 text-4xl font-bold text-slate-800">

                  Sign In

                </h2>

                <p className="mt-3 text-slate-500 leading-7">

                  Enter your official government account
                  credentials to continue.

                </p>

              </div>

              <form
                onSubmit={handleLogin}
                className="space-y-6"
              >

                              {/* ===========================
                    Email Address
              =========================== */}

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
                    placeholder="example@gov.lk"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                </div>

              </div>

              {/* ===========================
                    Password
              =========================== */}

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
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                </div>

              </div>

              {/* ===========================
                    Login Role
              =========================== */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Login As
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition-all duration-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >

                  <option value="employee">
                    Employee
                  </option>

                  <option value="department_officer">
                    Department Officer
                  </option>

                  <option value="subject_officer">
                    Subject Officer
                  </option>

                  <option value="deputy_secretary">
                    Deputy Secretary
                  </option>

                  <option value="secretary">
                    Secretary
                  </option>

                  <option value="driver">
                    Driver
                  </option>

                </select>

              </div>

                            {/* ===========================
                    Sign In Button
              =========================== */}

              <button
                type="submit"
                disabled={isLoading}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  "Signing In..."
                ) : (
                  <>
                    Sign In

                    <FiArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>

              {/* Forgot Password & Register */}

              <div className="flex items-center justify-between pt-2 text-sm">

                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-700 transition hover:text-blue-900"
                >
                  Forgot Password?
                </Link>

                <Link
                  to="/register"
                  className="font-semibold text-blue-700 transition hover:text-blue-900"
                >
                  Create Account
                </Link>

              </div>

            </form>

            {/* Divider */}

            <div className="my-8 flex items-center">

              <div className="h-px flex-1 bg-slate-200"></div>

              <span className="px-4 text-xs font-medium uppercase tracking-[0.25em] text-slate-400">
                Government of Sri Lanka
              </span>

              <div className="h-px flex-1 bg-slate-200"></div>

            </div>

            {/* Footer */}

            <div className="space-y-4 text-center">

              <p className="text-sm leading-6 text-slate-500">

                Secure access to the official Vehicle
                Management System for government officers.

              </p>

              <div className="flex flex-wrap justify-center gap-2">

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  Secure Login
                </span>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  Government Portal
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  Version 1.0
                </span>

              </div>

              <div className="border-t border-slate-200 pt-5">

                <h4 className="font-semibold text-slate-800">
                  Chief Ministry
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Dakshinapaya, Labuduwa, Galle
                </p>

                <p className="mt-4 text-xs text-slate-400">
                  © {new Date().getFullYear()} Government of Sri Lanka.
                  All Rights Reserved.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

  );

}
