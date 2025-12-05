"use client";

import { useRouter } from "next/navigation";

export default function WelcomeSection() {
  const router = useRouter();

  return (
    <div
      className="
        w-full 
        h-full 
        bg-[url('/BackgroundImage.png')] 
        bg-cover 
        bg-center 
        rounded-xl
        flex 
        items-center 
        justify-start
        px-10
        py-20
      "
    >
      <div className="w-1/2">
        <h1 className="text-7xl font-extrabold mb-6 text-white drop-shadow-2xl">
          Welcome!
        </h1>

        <p className="text-xl text-white/90 drop-shadow-lg max-w-xl mb-10 leading-relaxed">
          We're excited to have you here. Build beautiful, customizable
          company pages with ease — no coding required.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => router.push("/auth/signup")}
          className="
            px-10 py-4
            text-white/90 text-lg text-bold font-serif
            rounded-2xl
            shadow-[0_10px_30px_rgba(0,0,0,0.4)]
            hover:bg-white/30
            hover:scale-105
            transition-all duration-300
          "

        >
          Get Started →
        </button>
      </div>
    </div>
  );
}
