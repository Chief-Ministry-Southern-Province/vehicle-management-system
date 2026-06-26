export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">

        <h1 className="text-3xl font-bold mb-6">
          Register Account
        </h1>

        <div className="grid gap-4">

          <input
            placeholder="Full Name"
            className="border p-3 rounded-xl"
          />

          <input
            placeholder="Employee ID"
            className="border p-3 rounded-xl"
          />

          <input
            placeholder="Email"
            className="border p-3 rounded-xl"
          />

          <select className="border p-3 rounded-xl">

            <option>
              Employee
            </option>

            <option>
              Department Officer
            </option>

            <option>
              Subject Officer
            </option>

            <option>
              Deputy Secretary
            </option>

            <option>
              Secretary
            </option>

            <option>
              Driver
            </option>

          </select>

          <input
            type="password"
            placeholder="Password"
            className="border p-3 rounded-xl"
          />

          <button className="bg-blue-600 text-white py-3 rounded-xl">
            Create Account
          </button>

        </div>

      </div>

    </div>
  );
}