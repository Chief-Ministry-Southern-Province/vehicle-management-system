import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "employee",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const user = {
      name: "John Doe",
      email: formData.email,
      employee_id: "VMS-2025-001",
      role: formData.role,
    };

    localStorage.setItem("user", JSON.stringify(user));

    switch (formData.role) {
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
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

        <div className="text-center mb-8">

          <div className="w-20 h-20 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            VMS
          </div>

          <h1 className="text-3xl font-bold mt-4">
            Vehicle Management System
          </h1>

          <p className="text-slate-500 mt-2">
            Government Fleet Management Portal
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>
            <label className="block mb-2 text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="example@gov.lk"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Login As
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
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

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
          >
            Sign In
          </button>

        </form>

        <div className="flex justify-between mt-6 text-sm">

          <Link
            to="/forgot-password"
            className="text-blue-600"
          >
            Forgot Password?
          </Link>

          <Link
            to="/register"
            className="text-blue-600"
          >
            Register
          </Link>

        </div>

      </div>

    </div>
  );
}