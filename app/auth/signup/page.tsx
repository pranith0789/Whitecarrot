// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { EyeClosed, View } from "lucide-react";

// export default function SignupPage() {
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPass, setShowPass] = useState(false);

//   async function handleSignup(e: any) {
//     e.preventDefault();

//     setError("");

//     if (!email.trim()) return setError("Email cannot be empty");
//     if (!/\S+@\S+\.\S+/.test(email)) return setError("Please enter a valid email");
//     if (!password.trim()) return setError("Password cannot be empty");
//     if (password.length < 6)
//       return setError("Password must be at least 6 characters");

//     setLoading(true);

//     const res = await fetch("/api/auth/signup", {
//       method: "POST",
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();
//     setLoading(false);

//     if (data.success) {
//       router.push(`/company/${data.companyId}`);
//     } else {
//       setError(data.error || "Signup failed");
//     }
//   }

//   return (
//     <div
//       className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
//       style={{
//         backgroundImage: "url('/Gemini.png')",
//       }}
//     >
//       {/* GLASS CARD */}
//       <div
//         className="
//           w-[420px] p-10 rounded-3xl
//           bg-white/20 backdrop-blur-xl
//           shadow-[0_8px_32px_rgba(0,0,0,0.25)]
//           border border-white/30
//           animate-fadeIn
//         "
//       >
//         <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-500 drop-shadow-lg">
//           Recruiter Signup
//         </h2>

//         {error && (
//           <div className="mb-4 p-3  text-red-500 text-md rounded-lg text-center animate-shake">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSignup} className="flex flex-col gap-6">
//           {/* EMAIL */}
//           <div className="relative w-full">
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="
//                 w-full px-4 py-3 rounded-lg bg-white/60 text-gray-900
//                 border border-gray-300 shadow-inner
//                 focus:outline-none focus:ring-2 focus:ring-blue-500 peer
//                 placeholder-transparent
//               "
//             />
//             <label
//               className={`
//                 absolute left-4 transition-all text-gray-700
//                 ${email ? "top-[-10px] text-sm text-blue-600" : "top-3 text-base"}
//               `}
//             >
//               Email
//             </label>
//           </div>

//           {/* PASSWORD */}
//           <div className="relative w-full">
//             <input
//               type={showPass ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="
//                 w-full px-4 py-3 rounded-lg bg-white/60 text-gray-900
//                 border border-gray-300 shadow-inner
//                 focus:outline-none focus:ring-2 focus:ring-blue-500 peer
//                 placeholder-transparent
//               "
//             />
//             <label
//               className={`
//                 absolute left-4 transition-all text-gray-700
//                 ${password ? "top-[-10px] text-sm text-blue-600" : "top-3 text-base"}
//               `}
//             >
//               Password
//             </label>

//             <button
//               type="button"
//               onClick={() => setShowPass(!showPass)}
//               className="absolute right-4 top-3 text-gray-700 hover:text-gray-900"
//             >
//               {showPass ? <EyeClosed size={18} /> : <View size={18} />}
//             </button>
//           </div>

//           {/* BUTTON */}
//           <button
//             className="
//               w-full py-3 mt-2 rounded-xl font-bold text-lg
//               bg-gradient-to-r from-blue-600 to-blue-400
//               hover:from-blue-700 hover:to-blue-500
//               text-white shadow-xl hover:shadow-2xl transition
//               flex items-center justify-center
//             "
//             disabled={loading}
//           >
//             {loading ? (
//               <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
//             ) : (
//               "Sign Up"
//             )}
//           </button>
//         </form>

//         <p className="text-center text-black/80 mt-6 text-sm">
//           Already a user?{" "}
//           <button
//             onClick={() => router.push("/login")}
//             className="text-blue-300 font-semibold hover:underline"
//           >
//             Login here
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }

// File: app/(auth)/signup/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeClosed, View } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleSignup(e: any) {
    e.preventDefault();

    setError("");

    // Validations
    if (!companyName.trim()) return setError("Company name cannot be empty");
    if (!email.trim()) return setError("Email cannot be empty");
    if (!/\S+@\S+\.\S+/.test(email)) return setError("Please enter a valid email");
    if (!password.trim()) return setError("Password cannot be empty");
    if (password.length < 6)
      return setError("Password must be at least 6 characters");

    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, companyName }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      router.push(`/company/${data.companyId}`);
    } else {
      setError(data.error || "Signup failed");
    }
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: "url('/Gemini.png')" }}
    >
      <div
        className="
          w-[420px] p-10 rounded-3xl
          bg-white/20 backdrop-blur-xl
          shadow-[0_8px_32px_rgba(0,0,0,0.25)]
          border border-white/30
          animate-fadeIn
        "
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-600">
          Recruiter Signup
        </h2>

        {error && (
          <div className="mb-4 p-3 text-red-600 text-md rounded-lg text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-6">
          
          {/* COMPANY NAME */}
          <div className="relative w-full">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="
                w-full px-4 py-3 rounded-lg bg-white/60 text-gray-900
                border border-gray-300 shadow-inner
                focus:outline-none focus:ring-2 focus:ring-blue-500 peer
              "
            />
            <label
              className={`
                absolute left-4 transition-all text-gray-700 pointer-events-none
                ${companyName ? "top-[-10px] text-sm text-blue-600" : "top-3 text-base"}
              `}
            >
              Company Name
            </label>
          </div>

          {/* EMAIL */}
          <div className="relative w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full px-4 py-3 rounded-lg bg-white/60 text-gray-900
                border border-gray-300 shadow-inner
                focus:outline-none focus:ring-2 focus:ring-blue-500 peer
              "
            />
            <label
              className={`
                absolute left-4 transition-all text-gray-700
                ${email ? "top-[-10px] text-sm text-blue-600" : "top-3 text-base"}
              `}
            >
              Email
            </label>
          </div>

          {/* PASSWORD */}
          <div className="relative w-full">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full px-4 py-3 rounded-lg bg-white/60 text-gray-900
                border border-gray-300 shadow-inner
                focus:outline-none focus:ring-2 focus:ring-blue-500 peer
              "
            />
            <label
              className={`
                absolute left-4 transition-all text-gray-700
                ${password ? "top-[-10px] text-sm text-blue-600" : "top-3 text-base"}
              `}
            >
              Password
            </label>

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-3 text-gray-700 hover:text-gray-900"
            >
              {showPass ? <EyeClosed size={18} /> : <View size={18} />}
            </button>
          </div>

          {/* SIGNUP BUTTON */}
          <button
            className="
              w-full py-3 mt-2 rounded-xl font-bold text-lg
              bg-gradient-to-r from-blue-600 to-blue-400
              hover:from-blue-700 hover:to-blue-500
              text-white shadow-xl hover:shadow-2xl transition
              flex items-center justify-center
            "
            disabled={loading}
          >
            {loading ? (
              <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center text-black/80 mt-6 text-sm">
          Already a user?{" "}
          <button
            onClick={() => router.push("/auth/login")}
            className="text-blue-400 font-semibold hover:underline"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}
