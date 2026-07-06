import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaCarSide,
  FaUserShield,
  FaMapMarkerAlt,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";
import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "employee",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      const payload = response?.data ?? response;
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
        email: backendUser?.email ?? formData.email,
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
        token ? { ...nextUser, token } : nextUser,
        token
      );

      toast.success("Login successful");

      switch (nextUser.role) {
        case "employee":
          navigate("/userdashboard");
          break;

        case "department_officer":
          navigate("/departmentofficerdashboard");
          break;

        case "subject_officer":
          navigate("/subjectofficerdashboard");
          break;

        case "deputy_secretary":
          navigate("/deputysecretarydashboard");
          break;

        case "secretary":
          navigate("/secretarydashboard");
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
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-6 py-10 overflow-hidden">

      {/* Background Blur */}
      <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl bottom-10 right-10"></div>

      <div className="relative w-full max-w-7xl grid lg:grid-cols-2 rounded-[35px] overflow-hidden shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20">

        {/* LEFT PANEL */}

        <div className="hidden lg:flex flex-col justify-center p-14 bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 text-white">

          <div className="flex items-center gap-5 mb-8">

            <div className="w-20 h-20 rounded-3xl bg-white text-blue-800 flex items-center justify-center shadow-xl">
              <FaCarSide size={38} />
            </div>

            <div>

              <h2 className="text-4xl font-bold">
                Vehicle Management
              </h2>

              <p className="text-blue-100 mt-1">
                Government Fleet Portal
              </p>

            </div>

          </div>

          <div className="space-y-5">

            <div className="flex items-center gap-3">

              <FaUserShield className="text-yellow-400 text-xl" />

              <span className="text-lg">
                Secure Government Authentication
              </span>

            </div>

            <div className="flex items-center gap-3">

              <FaMapMarkerAlt className="text-yellow-400 text-xl" />

              <span className="text-lg">
                Chief Ministry
                <br />
                Dakshinapaya, Labuduwa
              </span>

            </div>

          </div>

          <div className="mt-16">

            <h1 className="text-5xl font-extrabold leading-tight">
              Smart Vehicle
              <br />
              Management
            </h1>

            <p className="mt-6 text-blue-100 leading-8 text-lg">
              Digital platform for managing government vehicles,
              transport requests, approvals, drivers, and fleet
              operations with enhanced security and efficiency.
            </p>

          </div>

        </div>

        {/* LOGIN CARD */}

        <div className="flex items-center justify-center bg-white/5 backdrop-blur-xl">

          <div className="w-full max-w-md p-10">

            <div className="text-center">

              <div className="mx-auto w-24 h-24 rounded-full bg-linear-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-xl">

                <FaUserShield
                  className="text-white"
                  size={42}
                />

              </div>

              <h2 className="mt-6 text-3xl font-bold text-white">
                Welcome Back
              </h2>

              <p className="text-slate-300 mt-2">
                Sign in to continue
              </p>

            </div>

            <form
              onSubmit={handleLogin}
              className="mt-10 space-y-6"
            >

              {/* EMAIL */}

              <div>

                <label className="text-white text-sm mb-2 block">
                  Email Address
                </label>

                <div className="relative">

                  <FaEnvelope className="absolute left-4 top-4 text-slate-400" />

                  <input
                    type="email"
                    name="email"
                    placeholder="example@gov.lk"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div>

                <label className="text-white text-sm mb-2 block">
                  Password
                </label>

                <div className="relative">

                  <FaLock className="absolute left-4 top-4 text-slate-400" />

                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                </div>

              </div>

              {/* ROLE */}

              <div>

                <label className="text-white text-sm mb-2 block">
                  Login As
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full py-3 px-4 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none"
                >
                  <option className="text-black" value="employee">
                    Employee
                  </option>

                  <option className="text-black" value="department_officer">
                    Department Officer
                  </option>

                  <option className="text-black" value="subject_officer">
                    Subject Officer
                  </option>

                  <option className="text-black" value="deputy_secretary">
                    Deputy Secretary
                  </option>

                  <option className="text-black" value="secretary">
                    Secretary
                  </option>

                  <option className="text-black" value="driver">
                    Driver
                  </option>
                </select>

              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-linear-to-r from-blue-600 via-blue-700 to-cyan-500 text-white font-bold text-lg shadow-xl hover:scale-[1.02] transition duration-300"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>

            </form>

            <div className="flex justify-between mt-8 text-sm">

              <Link
                to="/forgot-password"
                className="text-cyan-300 hover:text-white"
              >
                Forgot Password?
              </Link>

              <Link
                to="/register"
                className="text-cyan-300 hover:text-white"
              >
                Register
              </Link>

            </div>

            <div className="mt-10 border-t border-white/20 pt-6 text-center">

              <p className="text-slate-400 text-sm">
                © 2026 Vehicle Management System
              </p>

              <p className="text-slate-500 text-xs mt-2">
                Chief Ministry • Dakshinapaya • Labuduwa
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}