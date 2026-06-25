export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold mb-3">
          Forgot Password
        </h1>

        <p className="text-gray-500 mb-6">
          Enter your email to receive a reset link.
        </p>

        <input
          type="email"
          placeholder="Email Address"
          className="w-full border rounded-xl p-3 mb-4"
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-xl">
          Send Reset Link
        </button>

      </div>

    </div>
  );
}