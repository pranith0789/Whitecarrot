"use client";

import { useEffect, useState } from "react";
import WelcomeSlide from "./Sections/WelcomeSection";
import MissionSlide from "./Sections/MissionSection";
import FeatureSlide from "./Sections/FeatureSection";

export default function CarouselContainer() {
  const slides = [
    <WelcomeSlide key="1" />,
    <MissionSlide key="2" />,
    <FeatureSlide key="3" />,
  ];

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % slides.length);
        setFade(true);
      }, 300);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full">
      <div className={`w-full h-full transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}>
        {slides[index]}
      </div>
    </div>
  );
}
