export default function MissionSection() {
  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div
        className="
          w-full 
          h-full
          p-12 
          rounded-3xl 
          backdrop-blur-sm 
          shadow-[0_8px_32px_rgba(0,0,0,0.45)]
          flex flex-row items-center justify-center gap-10
        "
      >
        {/* Left Title */}
        <h2
          className="
            text-5xl 
            font-extrabold 
            italic
            text-white 
            drop-shadow-2xl
            min-w-[160px]
          "
        >
          Mission
        </h2>

        {/* Right Content */}
        <p
          className="
            text-lg 
            italic 
            leading-relaxed 
            text-white/90 
            max-w-[70%]
            drop-shadow
          "
        >
          Our mission is to help companies create ATS-ready career pages within minutes.
          With our application, employers can design professional, branded hiring pages 
          that display culture, mission, values, and job openings — all without needing 
          a developer. We streamline the entire process so teams can publish optimized 
          ATS pages faster and attract better candidates effortlessly.
        </p>
      </div>
    </div>
  );
}
