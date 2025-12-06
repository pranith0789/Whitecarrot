"use client";

import { motion } from "framer-motion";

export default function IntroVideoRenderer({ content, sectionId }: any) {
  if (!content) return null;

  return (
    <section
      id={sectionId}
      className="relative w-full min-h-screen overflow-hidden"
    >
      {/* Background Video */}
      <video
        src={content.video || "/intro.mp4"}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Text Content */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 text-center px-6">
        <h1
          className="typing-loop bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400
          text-transparent bg-clip-text text-5xl md:text-6xl font-bold"
        >
          Welcome!
        </h1>

        <p className="text-xl md:text-2xl mt-4 text-gray-200 fade-in-delay">
          A modern place to showcase your culture and attract the best talent.
        </p>
      </div>
    </section>
  );
}
