import FeatureMarquee from "../FeatureMarquee";

export default function FeatureSection() {
  return (
    <div className="w-full flex items-center justify-center p-10">
      <div
        className="
          w-full max-w-6xl
          rounded-3xl
          p-12
          backdrop-blur-sm
          shadow-[0_8px_32px_rgba(0,0,0,0.45)]
          text-center
        "
      >
        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
          Our Features
        </h1>

        <p className="text-lg text-white/80 mt-3 mb-10 max-w-3xl mx-auto italic">
          Explore the powerful features that make building ATS-ready career pages effortless.
        </p>

        <FeatureMarquee />
      </div>
    </div>
  );
}
