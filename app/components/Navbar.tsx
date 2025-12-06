"use client";

import { useRouter, usePathname } from "next/navigation";
import { SquarePen, LogOut } from "lucide-react";

export default function Navbar({ sections, companyId, activeSection }: any) {
  const router = useRouter();
  const pathname = usePathname();

  const orderedSections = [...sections].sort(
    (a: any, b: any) => (a.position ?? 0) - (b.position ?? 0)
  );

  // Scroll or redirect
  const scrollToSection = (id: string) => {
    const isCareersPage = pathname.includes("/careers");

    if (isCareersPage) {
      router.push(`/company/${companyId}#${id}`);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 90,
        behavior: "smooth",
      });
    }
  };

  const handleLogout = async () => {
  await fetch("/api/logout", { method: "POST" });
  router.push("/auth/login");
  };


  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-white/90 backdrop-blur-md shadow-sm z-[999]">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-6">

        {/* LEFT SIDE — NAV LINKS */}
        <ul className="flex items-center gap-8">
          {orderedSections
            .filter((s: any) => s.id !== "careers")
            .map((sec: any) => (
              <li key={sec.id}>
                <button
                  onClick={() => scrollToSection(sec.id)}
                  className={`
                    relative font-medium tracking-wide transition text-sm
                    ${activeSection === sec.id
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"}
                  `}
                >
                  {sec.label.toUpperCase()}

                  {/* Underline Animation */}
                  <span
                    className={`
                      absolute left-0 bottom-[-4px] h-[2px] w-full rounded-full bg-blue-600 transition-all 
                      ${activeSection === sec.id ? "opacity-100" : "opacity-0"}
                    `}
                  />
                </button>
              </li>
            ))}
        </ul>

        {/* RIGHT SIDE — Careers + Edit + Logout */}
        <div className="flex items-center gap-6 ml-auto">

          {/* Careers (Right-Aligned Special Tab) */}
          <a
            href={`/company/${companyId}/careers`}
            className={`
              relative font-medium text-sm tracking-wide transition
              ${pathname.includes("/careers")
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-600"}
            `}
          >
            CAREERS

            {/* Underline Animation */}
            <span
              className={`
                absolute left-0 bottom-[-4px] h-[2px] w-full rounded-full bg-blue-600 transition-all
                ${pathname.includes("/careers") ? "opacity-100" : "opacity-0"}
              `}
            />
          </a>

          {/* Edit Button */}
          <button
            onClick={() => router.push(`/company/${companyId}/edit`)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
            title="Edit Company Page"
          >
            <SquarePen size={20} className="text-gray-600 hover:text-blue-600" />
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-md hover:bg-red-50 transition"
            title="Logout"
          >
            <LogOut size={22} className="text-gray-600 hover:text-red-600" />
          </button>

        </div>
      </div>
    </nav>
  );
}
