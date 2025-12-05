"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SquarePen } from "lucide-react";

interface NavProps {
  sections: { id: string; label: string }[];
  activeSection?: string; // passed manually for pages like Careers
  companyId?: string;
}

export default function Navbar({ sections, activeSection, companyId }: NavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [current, setCurrent] = useState(activeSection || "");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observedIdsRef = useRef<string[]>([]);

  // Helper: find DOM element for a section id with tolerant fallbacks
  function findElementForId(id: string): HTMLElement | null {
    // try direct id
    let el = document.getElementById(id);
    if (el) return el;

    // try kebab-case, snake_case, lower-case variants
    const variants = [
      id,
      id.replace(/([A-Z])/g, "-$1").toLowerCase(), // camel -> kebab
      id.replace(/([A-Z])/g, "_$1").toLowerCase(), // camel -> snake
      id.toLowerCase(),
      id.replace(/_/g, "-"),
      id.replace(/-/g, "_"),
    ];
    for (const v of variants) {
      el = document.getElementById(v);
      if (el) return el;
    }

    // try data-section attribute (optional)
    return document.querySelector<HTMLElement>(`[data-section="${id}"]`) ?? null;
  }

  // Setup IntersectionObserver
  useEffect(() => {
    // if manual activeSection provided (e.g. Careers page), use that initially
    if (activeSection) {
      setCurrent(activeSection);
    }

    // only run scrollspy on company pages (exclude careers page path)
    const isCompanyMainPage = pathname?.startsWith(`/company/${companyId}`) && !pathname?.includes("/careers");
    if (!isCompanyMainPage) {
      return;
    }

    // Disconnect any previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
      observedIdsRef.current = [];
    }

    // Create observer
    const observer = new IntersectionObserver(
      (entries) => {
        // choose the entry closest to top (largest intersectionRatio or smallest boundingClientRect.top)
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => {
            // prefer larger intersectionRatio, then smaller top
            if (b.intersectionRatio !== a.intersectionRatio) return b.intersectionRatio - a.intersectionRatio;
            return a.boundingClientRect.top - b.boundingClientRect.top;
          });

        if (visible.length > 0) {
          const id = visible[0].target.getAttribute("id") || visible[0].target.getAttribute("data-section") || "";
          if (id && id !== current) {
            setCurrent(id);
          }
        }
      },
      {
        root: null,
        rootMargin: "-25% 0px -60% 0px", // when section reaches ~25% from top it becomes active
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    observerRef.current = observer;

    // helper to (re)observe sections
    function observeSections() {
      const ids: string[] = [];
      for (const sec of sections) {
        const el = findElementForId(sec.id);
        if (el) {
          observer.observe(el);
          ids.push(sec.id);
        }
      }
      observedIdsRef.current = ids;
      // run a tick to pick up current visible
      // small delay to allow layout stabilization
      setTimeout(() => {
        // trigger manual check: get all entries via getBoundingClientRect
        const candidates = observedIdsRef.current
          .map((id) => findElementForId(id))
          .filter(Boolean) as HTMLElement[];

        // pick candidate closest to top third
        let bestId = "";
        let bestScore = Infinity;
        for (const el of candidates) {
          const rect = el.getBoundingClientRect();
          const score = Math.abs(rect.top - window.innerHeight * 0.25);
          if (score < bestScore) {
            bestScore = score;
            bestId = el.id || el.getAttribute("data-section") || "";
          }
        }
        if (bestId && bestId !== current) setCurrent(bestId);
      }, 120);
    }

    // first attempt
    observeSections();

    // fallback: if some elements appear later (images, async content), re-run observe after delay(s)
    const recheckTimers: number[] = [];
    recheckTimers.push(window.setTimeout(observeSections, 600));
    recheckTimers.push(window.setTimeout(observeSections, 2000));

    // Also observe DOM changes (optional) — re-scan when body height changes
    let lastBodyHeight = document.body.scrollHeight;
    const heightCheck = window.setInterval(() => {
      if (document.body.scrollHeight !== lastBodyHeight) {
        lastBodyHeight = document.body.scrollHeight;
        observeSections();
      }
    }, 1000);
    // clean up
    return () => {
      observer.disconnect();
      observerRef.current = null;
      recheckTimers.forEach((t) => clearTimeout(t));
      clearInterval(heightCheck);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, sections, companyId, activeSection]); // re-run when sections/companyId change

  // Listen to hash changes (cross-page anchor navigation)
  useEffect(() => {
    function onHash() {
      const h = window.location.hash.replace("#", "");
      if (h) setCurrent(h);
    }
    window.addEventListener("hashchange", onHash);
    // initial check in case user came with hash
    onHash();
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // If parent explicitly sets activeSection (e.g. Careers page), prefer it
  useEffect(() => {
    if (activeSection) setCurrent(activeSection);
  }, [activeSection]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow z-50 py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* LEFT: Sections */}
        <ul className="flex gap-8 text-lg">
          {sections
            .filter((sec) => sec.id !== "careers")
            .map((sec) => (
              <li key={sec.id}>
                <a
                  href={`/company/${companyId}#${sec.id}`}
                  className={`transition font-medium ${
                    current === sec.id
                      ? "text-blue-600 underline underline-offset-4"
                      : "text-gray-500 hover:text-blue-600"
                  }`}
                >
                  {sec.label}
                </a>
              </li>
            ))}
        </ul>

        {/* RIGHT: Careers + Edit */}
        <div className="flex items-center gap-6">
          <a
            href={`/company/${companyId}/careers`}
            className={`font-medium text-lg transition ${
              current === "careers"
                ? "text-blue-600 underline underline-offset-4"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Careers
          </a>

          <button
            onClick={() => router.push(`/company/${companyId}/edit`)}
            className="text-gray-600 hover:text-blue-600 transition"
          >
            <SquarePen size={22} />
          </button>
        </div>
      </div>
    </nav>
  );
}
