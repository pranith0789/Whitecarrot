"use client";

import { useState, useEffect } from "react";

import WelcomeSection from "./Sections/WelcomeSection";
import MissionSection from "./Sections/MissionSection";
import FeatureSection from "./Sections/FeatureSection";

export default function SectionCarousel() {
  const sections = [
    <WelcomeSection key="1" />,
    <MissionSection key="2" />,
    <FeatureSection key="3" />,
  ];

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % sections.length);
        setFade(true);
      }, 300);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="transition-all duration-300">
      <div className={`transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}>
        {sections[index]}
      </div>

      {/* NAVIGATION DOTS */}
      <div className="flex justify-center mt-4 gap-2">
        {sections.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === i ? "bg-black" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
