"use client";
import { useEffect, useState } from "react";

export default function StatsRenderer({ content, sectionId }: any) {
  const stats = content?.stats || [];

  const [shown, setShown] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShown(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section id={sectionId} className="py-20 bg-gray-50 text-center">
      <h2 className="text-4xl font-bold mb-10">Our Impact in Numbers</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {stats.map((item: any, i: number) => (
          <div
            key={i}
            className="bg-white p-10 rounded-xl shadow-md border border-gray-100"
          >
            <h3 className="text-5xl font-bold text-blue-600">
              {shown ? item.value : "0"}
            </h3>
            <p className="mt-3 text-gray-600 text-lg">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
