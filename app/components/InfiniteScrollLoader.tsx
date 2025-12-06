"use client";

import { useEffect, useRef, useState } from "react";
import { TEMPLATE_RENDERERS } from "@/app/company/[companyId]/components/TemplateRenderer/TemplateRenderer";

export default function InfiniteScrollLoader({ sections }: any) {
  const [loadedCount, setLoadedCount] = useState(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && loadedCount < sections.length) {
        setLoadedCount((prev) => prev + 1);
      }
    });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadedCount, sections.length]);

  return (
    <div>
      {sections.slice(0, loadedCount).map((sec: any, index: number) => {
        const Renderer =
          TEMPLATE_RENDERERS[sec.template] || TEMPLATE_RENDERERS["fallback"];

        return (
          <div key={sec.id} id={sec.id} className="w-full">
            <Renderer content={sec.content} sectionId={sec.id} />

            {index === loadedCount - 1 &&
              loadedCount < sections.length && (
                <div ref={loaderRef} className="h-32" />
              )}
          </div>
        );
      })}
    </div>
  );
}
