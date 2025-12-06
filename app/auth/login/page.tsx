"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeClosed, View } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleLogin(e: any) {
    e.preventDefault();
    setError("");

    // Validations
    if (!email.trim()) return setError("Email cannot be empty");
    if (!/\S+@\S+\.\S+/.test(email))
      return setError("Please enter a valid email");
    if (!password.trim()) return setError("Password cannot be empty");
    if (password.length < 6)
      return setError("Password must be at least 6 characters");

    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, remember }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      router.push(`/company/${data.companyId}`);
    } else {
      setError(data.error || "Invalid login");
    }
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: "url('/loginpage.png')" }}
    >
      <div
        className="
          w-[420px] p-10 rounded-3xl
          bg-white/10 backdrop-blur-xl
          border border-white/20
          shadow-[0_15px_40px_rgba(0,0,0,0.5)]
          animate-fadeIn
        "
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-white/80 drop-shadow-lg">
          Recruiter Login
        </h2>

        {/* ERROR */}
        {error && (
          <div className="mb-4 p-3 text-red-500 text-md rounded-lg text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">

          {/* EMAIL FIELD (same as signup) */}
          <div className="relative w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full px-4 py-3 rounded-lg bg-white/60 text-gray-900
                border border-gray-300 shadow-inner
                focus:outline-none focus:ring-2 focus:ring-blue-500 peer
                placeholder-transparent
              "
            />
            <label
              className={`
                absolute left-4 text-gray-700 transition-all pointer-events-none
                ${email ? "top-[-10px] text-sm text-blue-600" : "top-3 text-base"}
              `}
            >
              Email
            </label>
          </div>

          {/* PASSWORD FIELD (same animation as signup) */}
          <div className="relative w-full">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full px-4 py-3 rounded-lg bg-white/60 text-gray-900
                border border-gray-300 shadow-inner
                focus:outline-none focus:ring-2 focus:ring-blue-500 peer
                placeholder-transparent
              "
            />
            <label
              className={`
                absolute left-4 text-gray-700 transition-all pointer-events-none
                ${password ? "top-[-10px] text-sm text-blue-600" : "top-3 text-base"}
              `}
            >
              Password
            </label>

            {/* Lucide Icon */}
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-3 text-gray-700 hover:text-gray-900"
            >
              {showPass ? (
                <EyeClosed size={18} strokeWidth={2} />
              ) : (
                <View size={18} strokeWidth={2} />
              )}
            </button>
          </div>

          {/* REMEMBER ME + FORGOT PASSWORD */}
          <div className="flex justify-between items-center text-white/90 text-sm">
            <label className="flex gap-2 items-center cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4"
              />
              Remember Me
            </label>

            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="hover:underline hover:text-blue-300"
            >
              Forgot Password?
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            className="
              w-full py-3 mt-2 rounded-xl text-lg font-bold 
              text-white shadow-xl hover:shadow-2xl transition
              bg-gradient-to-r from-blue-600 to-blue-400
              hover:from-blue-700 hover:to-blue-500
              flex items-center justify-center
            "
            disabled={loading}
          >
            {loading ? (
              <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* NEW USER SIGNUP */}
        <p className="text-center text-white/90 mt-6 text-sm">
          New user?{" "}
          <button
            onClick={() => router.push("/auth/signup")}
            className="text-blue-400 font-semibold hover:underline"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}
