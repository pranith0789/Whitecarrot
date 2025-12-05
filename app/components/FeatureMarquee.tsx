"use client";

export default function FeatureMarquee() {
  const features = [
    "Drag & Drop Section Builder",
    "Customizable Templates",
    "Live Preview Editor",
    "Edit / Add / Remove Sections",
    "Supabase Section Storage",
    "ATS-Friendly Layout",
    "Infinite Scrolling Pages",
    "Responsive Design",
    "Fast Company Page Setup",
    "Reusable Section Components",
  ];

  return (
    <div className="overflow-hidden whitespace-nowrap py-4 w-full">
      <div className="animate-marquee inline-flex gap-8">
        {features.map((item, i) => (
          <div
            key={i}
            className="
              min-w-[50px]
              min-h-[150px]
              px-8 py-6
              rounded-2xl
              text-white font-bold text-lg
              shadow-xl
              border border-white/40
              flex items-center justify-center
            "
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
