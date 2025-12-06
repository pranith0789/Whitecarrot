"use client";
import { useState } from "react";

export default function FAQRenderer({ content, sectionId }: any) {
  const faqs = content?.faqs || [];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id={sectionId}
      className="py-20 bg-white border-t border-gray-200"
    >
      <h2 className="text-4xl font-bold text-center mb-10">Frequently Asked Questions</h2>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq: any, i: number) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl p-6 cursor-pointer hover:shadow-md transition"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              <span className="text-xl">{openIndex === i ? "−" : "+"}</span>
            </div>

            {openIndex === i && (
              <p className="mt-3 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
