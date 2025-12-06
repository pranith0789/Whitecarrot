"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";

type WrapperProps = {
  children: ReactNode;
  id: string;
  animatedGradient?: boolean;
  parallaxImage?: string;
  entrance?: "fade" | "slide-up" | "slide-left" | "zoom";
  className?:string
};

export default function SectionWrapper({
  children,
  id,
  animatedGradient = false,
  parallaxImage,
  entrance = "fade",
  className
}: WrapperProps) {
  return (
    <section
      id={id}
      className="w-full py-8 overflow-hidden"
      style={{
        background: animatedGradient
          ? "linear-gradient(120deg, #ff9a9e, #fad0c4, #a1c4fd, #c2e9fb)"
          : undefined,
        backgroundSize: animatedGradient ? "300% 300%" : undefined,
        animation: animatedGradient ? "gradientFlow 12s ease infinite" : undefined,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: entrance === "slide-up" ? 40 : 0 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: "easeOut" },
        }}
        viewport={{ once: false, amount: 0.2 }}
        className="
          max-w-[1200px]
          mx-auto
          w-full
          px-0      /* 🔥 No side padding */
        "
      >
        {children}
      </motion.div>
    </section>
  );
}
