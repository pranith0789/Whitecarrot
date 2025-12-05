// "use client";

// import { useEffect, useRef, useState } from "react";

// interface InfiniteScrollLoaderProps {
//   sections: { id: string; component: string }[];
//   components: Record<string, React.ComponentType<any>>;
//   sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
// }

// export default function InfiniteScrollLoader({
//   sections,
//   components,
//   sectionRefs,
// }: InfiniteScrollLoaderProps) {
//   const [loadedCount, setLoadedCount] = useState(1);
//   const loaderRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         const entry = entries[0];
//         if (entry.isIntersecting && loadedCount < sections.length) {
//           setLoadedCount((prev) => prev + 1);
//         }
//       },
//       { threshold: 0.5 }
//     );

//     if (loaderRef.current) observer.observe(loaderRef.current);

//     return () => observer.disconnect();
//   }, [loadedCount, sections.length]);

//   return (
//     <div>
//       {sections.slice(0, loadedCount).map((sec) => {
//         const Component = components[sec.component];

//         return (
//           <div
//             key={sec.id}
//             id={sec.id}
//             ref={(el) => { sectionRefs.current[sec.id] = el; }}
//             // className="w-full opacity-0 translate-y-4 transition-all duration-700 ease-out will-change-transform animate-fadein"
//             // className="w-full transition-all duration-700"
//             className="w-full py-10"
//           >
//             <Component sectionId={sec.id}/>
//           </div>
//         );
//       })}

//       {/* Loader Trigger */}
//       <div ref={loaderRef} className="h-40" />
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";

interface InfiniteScrollLoaderProps {
  sections: { id: string; component: string }[];
  components: Record<string, React.ComponentType<any>>;
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
}

export default function InfiniteScrollLoader({
  sections,
  components,
  sectionRefs,
}: InfiniteScrollLoaderProps) {
  const [loadedCount, setLoadedCount] = useState(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log("🔄 InfiniteScroll mounted. Sections:", sections);
  }, [sections]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          console.log(
            "👀 Loader visible → loading more. loadedCount:",
            loadedCount,
            "sections.length:",
            sections.length
          );
        }

        if (entry.isIntersecting && loadedCount < sections.length) {
          setLoadedCount((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [loadedCount, sections.length]);

//   return (
//     <div>
//       {sections.slice(0, loadedCount).map((sec) => {
//         const Component = components[sec.component];

//         console.log(
//           "📌 Rendering Section:",
//           sec.id,
//           "| Component Key:",
//           sec.component,
//           "| Exists:",
//           Boolean(Component)
//         );

//         return (
//           <div
//             key={sec.id}
//             id={sec.id}
//             ref={(el) => {
//               sectionRefs.current[sec.id] = el;
//               console.log("📍 Mounted DOM for:", sec.id, "→", el);
//             }}
//             className="w-full py-10"
//           >
//             {Component ? (
//               <Component sectionId={sec.id} />
//             ) : (
//               <p className="text-red-500 text-center">
//                 ❌ Component not found for "{sec.component}"
//               </p>
//             )}
//           </div>
//         );
//       })}

//       {/* Loader Trigger */}
//       <div ref={loaderRef} className="h-40" />
//     </div>
//   );
return (
  <div>
    {sections.slice(0, loadedCount).map((sec, index) => {
      const Component = components[sec.component];

      return (
        <div key={sec.id}>
          <div
            id={sec.id}
            ref={(el) => {
              sectionRefs.current[sec.id] = el;
            }}
            className="w-full"
          >
            <Component sectionId={sec.id} />
          </div>

          {/* Loader AFTER each section */}
          {index === loadedCount - 1 && loadedCount < sections.length && (
            <div ref={loaderRef} className="h-32 bg-transparent" />
          )}
        </div>
      );
    })}
  </div>
);

}
