"use client";

import SectionWrapper from "@/app/components/SectionWrapper";

export default function EmployeeVoiceRenderer({ content, sectionId }: any) {
  if (!content?.quotes) return null;

  const quotes = content.quotes;

  return (
    <SectionWrapper id={sectionId}>
      <h2 className="text-4xl font-bold mb-8 text-center">Employee Stories</h2>

      <div className="relative w-full overflow-hidden py-6">
        {/* Auto-scrolling marquee row */}
        <div className="flex gap-6 animate-marquee-ltr whitespace-nowrap">
          {[...quotes, ...quotes].map((q: any, index: number) => (
            <div
              key={index}
              className="min-w-[350px] h-[250px] bg-gray-100 shadow-lg rounded-xl px-6 py-4 
                         text-gray-700 border border-gray-200 flex flex-col justify-center"
            >
              <p className="text-md italic">“{q.body}”</p>
              <p className="mt-2 text-right font-semibold">— {q.author}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
