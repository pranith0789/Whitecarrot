// "use client";

// import { useEffect, useRef, useState } from "react";
// import Navbar from "@/app/components/Navbar";
// import InfiniteScrollLoader from "@/app/components/InfiniteScrollLoader";
// import { defaultSections } from "@/app/lib/SectionsConfig";
// import * as SectionComponents from "@/app/sections";

// export default function CompanyPage() {
//   const [activeSection, setActiveSection] = useState<string>("");
//   const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
//   const observerRef = useRef<IntersectionObserver | null>(null);

//   // Create observer ONCE
//   useEffect(() => {
//     observerRef.current = new IntersectionObserver(
//       (entries) => {
//         const visible = entries
//           .filter((e) => e.isIntersecting)
//           .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

//         if (visible) setActiveSection(visible.target.id);
//       },
//       { threshold: [0.3, 0.6, 0.9] }
//     );
//   }, []);

//   // Observe refs EVERY TIME sections mount
//   useEffect(() => {
//     const observer = observerRef.current;
//     if (!observer) return;

//     Object.values(sectionRefs.current).forEach((el) => {
//       if (el) observer.observe(el);
//     });

//     return () => observer.disconnect();
//   });

//   return (
//     <>
//       <Navbar sections={defaultSections} activeSection={activeSection} />

//       <div className="mt-24">
//         <InfiniteScrollLoader
//           sections={defaultSections}
//           components={SectionComponents}
//           sectionRefs={sectionRefs}
//         />
//       </div>
//     </>
//   );
// }


// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useParams } from "next/navigation";
// import Navbar from "@/app/components/Navbar";
// import InfiniteScrollLoader from "@/app/components/InfiniteScrollLoader";
// import * as SectionComponents from "@/app/sections";

// export default function CompanyPage() {
//   const params = useParams();
//   const companyId = params.companyId as string;

//   console.log("PAGE companyId =", companyId);

//   const [sections, setSections] = useState([]);
//   const [activeSection, setActiveSection] = useState("");
//   const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
//   const observerRef = useRef<IntersectionObserver | null>(null);

//   useEffect(() => {
//     if (!companyId) return;

//     fetch(`/api/company/${companyId}/sections`)
//       .then((res) => res.json())
//       .then((data) => setSections(data));
//   }, [companyId]);

//   useEffect(() => {
//     observerRef.current = new IntersectionObserver(
//       (entries) => {
//         const visible = entries
//           .filter((e) => e.isIntersecting)
//           .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

//         if (visible) {
//           setActiveSection(visible.target.id);
//         }
//       },
//       { threshold: [0.3, 0.6, 0.9] }
//     );
//   }, []);

//   // Observe all mounted sections (infinite scroll)
//   useEffect(() => {
//     const observer = observerRef.current;
//     if (!observer) return;

//     Object.values(sectionRefs.current).forEach((el) => {
//       if (el) observer.observe(el);
//     });

//     return () => observer.disconnect();
//   }, [sections]); // runs again when new sections load


//   return (
//     <>
//       <Navbar
//         sections={sections.map((s: any) => ({
//           id: s.section_id.toLowerCase(),
//           label: s.section_id.charAt(0).toUpperCase() + s.section_id.slice(1),
//         }))}
//         activeSection={activeSection}
//       />

//       <div className="">
//         <InfiniteScrollLoader
//           sections={sections.map((s: any) => ({
//             id: s.section_id.toLowerCase(),
//             component: s.section_id,
//           }))}
//           components={SectionComponents}
//           sectionRefs={sectionRefs}
//         />
//       </div>
//     </>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import InfiniteScrollLoader from "@/app/components/InfiniteScrollLoader";
import * as SectionComponents from "@/app/sections";

export default function CompanyPage() {
  const params = useParams();
  const companyId = params.companyId as string;

  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState("");
  const sectionRefs = useRef({});

  useEffect(() => {
    if (!companyId) return;

    fetch(`/api/company/${companyId}/sections`)
      .then((res) => res.json())
      .then((data) => setSections(data));
  }, [companyId]);

  // Separate careers
  const scrollSections = sections.filter(
    (s: any) => s.section_id.toLowerCase() !== "careers"
  );

  return (
    <>
      <Navbar
        sections={sections.map((s: any) => ({
          id: s.section_id.toLowerCase(),
          label: s.section_id.charAt(0).toUpperCase() + s.section_id.slice(1),
        }))}
        activeSection={activeSection}
        companyId={companyId}
      />

      <div className="mt-12">
        <InfiniteScrollLoader
          sections={scrollSections.map((s: any) => ({
            id: s.section_id.toLowerCase(),
            component: s.section_id,
          }))}
          components={SectionComponents}
          sectionRefs={sectionRefs}
        />
      </div>
    </>
  );
}
