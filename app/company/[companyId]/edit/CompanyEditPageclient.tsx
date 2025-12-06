"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

/**
 * CompanyEditPageClient (Drag & Drop — Option 1)
 *
 * - Left column: current sections (compact draggable list) — reorder only inside this list
 * - Middle column: inline editor for selected section
 * - Right column: template library (click Add to insert a template as a new section) + Live Preview
 * - Uses your API endpoints: GET / POST / PUT / DELETE to /api/company/:companyId/sections
 * - Native HTML5 drag & drop is used (simple + robust)
 */

type SectionRow = {
  id: string;
  company_id?: string;
  type?: string;
  section_id?: string;
  title?: string | null;
  content?: any;
  position: number;
  bg_color?: string;
  created_at?: string;
};

// Predefined templates (the "library" shown on the right). These can also come from DB — this list is a fallback.
const TEMPLATE_LIBRARY = [
  { id: "intro_video", label: "Intro (Video)", component: "IntroVideo" },
  { id: "about_left", label: "About (Image Left)", component: "AboutLeft" },
  { id: "culture_cards", label: "Culture (Cards)", component: "CultureCards" },
  { id: "employee_voice", label: "Employee Voice", component: "EmployeeVoice" },
  { id: "contact_default", label: "Contact", component: "Contact" },
  { id: "careers_default", label: "Careers", component: "Careers" },
];

// Basic default content per template (used when adding)
const TEMPLATE_CONTENT: Record<string, any> = {
  intro_video: {
    headline: "Welcome!",
    subtext: "A modern place to showcase your culture and attract the best talent.",
    video: "/intro.mp4",
  },
  about_left: {
    title: "About Us",
    description:
      "We are a mission-driven company focused on building modern, scalable, and innovative digital solutions.",
    image: "/AboutUS.png",
  },
  culture_cards: {
    items: [
      { title: "Ownership", body: "We take ownership of outcomes." },
      { title: "Learn fast", body: "We iterate and learn quickly." },
      { title: "Be kind", body: "We build trust and respect." },
    ],
  },
  employee_voice: {
    quotes: [
      { author: "Employee A", body: "This company empowered my growth." },
      { author: "Employee B", body: "Great culture and mentorship." },
    ],
  },
  contact_default: {
    email: "careers@example.com",
    phone: "",
    address: "",
  },
  careers_default: {
    intro: "Open roles at our company",
  },
};

export default function CompanyEditPageClient() {
  const params = useParams() as { companyId?: string };
  const router = useRouter();
  const companyId = params?.companyId || "";

  const [sections, setSections] = useState<SectionRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Editor buffers
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  // Fetch sections from API
  async function loadSections() {
    if (!companyId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/company/${companyId}/sections`);
      const data = await res.json();
      const mapped = (Array.isArray(data) ? data : []).map((r: any) => ({
        id: r.id ?? uuidv4(),
        company_id: r.company_id,
        type: r.type ?? r.section_id ?? "unknown",
        section_id: r.section_id ?? r.type ?? r.section_id ?? r.type ?? "unknown",
        title: r.title ?? null,
        content: r.content ?? {},
        position: Number(r.position ?? 0),
        bg_color: r.bg_color ?? "#ffffff",
        created_at: r.created_at,
      }));
      mapped.sort((a: any, b: any) => a.position - b.position);
      setSections(mapped);
    } catch (err) {
      console.error("Failed to load sections", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  function normalize(row: any): SectionRow {
    return {
      id: row.id ?? uuidv4(),
      company_id: row.company_id,
      type: row.type ?? row.section_id ?? "unknown",
      section_id: row.section_id ?? row.type ?? "unknown",
      title: row.title ?? null,
      content: row.content ?? {},
      position: Number(row.position ?? 0),
      bg_color: row.bg_color ?? "#ffffff",
      created_at: row.created_at,
    };
  }

  // Add a template to company (POST)
  async function addTemplateToCompany(templateId: string) {
    if (!companyId) return;
    const pos = (sections?.length ?? 0) + 1;
    const payload = {
      section_id: templateId,
      type: templateId,
      title: TEMPLATE_CONTENT[templateId]?.title ?? TEMPLATE_LIBRARY.find((t) => t.id === templateId)?.label ?? null,
      content: TEMPLATE_CONTENT[templateId] ?? {},
      bg_color: "#ffffff",
      position: pos,
    };

    try {
      const res = await fetch(`/api/company/${companyId}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Create failed");
      const created = await res.json();
      setSections((prev) => (prev ? [...prev, normalize(created)] : [normalize(created)]));
      router.refresh();
    } catch (err) {
      console.error("addTemplateToCompany failed", err);
      alert("Failed to add template section");
    }
  }

  // Add custom empty section
  async function addCustomSection() {
    if (!companyId) return;
    const pos = (sections?.length ?? 0) + 1;
    const payload = {
      type: "custom",
      section_id: "custom",
      title: "New section",
      content: { body: "" },
      bg_color: "#ffffff",
      position: pos,
    };
    try {
      const res = await fetch(`/api/company/${companyId}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Create failed");
      const created = await res.json();
      setSections((prev) => (prev ? [...prev, normalize(created)] : [normalize(created)]));
      router.refresh();
    } catch (err) {
      console.error("addCustomSection failed", err);
      alert("Failed to add section");
    }
  }

  // Remove section
  async function removeSection(id: string) {
    if (!companyId) return;
    if (!confirm("Are you sure you want to remove this section?")) return;
    const prev = sections;
    setSections((s) => s?.filter((x) => x.id !== id) ?? null);

    try {
      const res = await fetch(`/api/company/${companyId}/sections`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      router.refresh();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete section");
      setSections(prev ?? null);
    }
  }

  // Save single section
  async function saveSection(section: SectionRow) {
    if (!companyId) return;
    try {
      const payload = {
        id: section.id,
        section_id: section.section_id ?? section.type,
        type: section.type,
        title: section.title,
        content: section.content,
        position: section.position,
        bg_color: section.bg_color,
      };
      const res = await fetch(`/api/company/${companyId}/sections`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      const updated = await res.json();
      setSections((prev) => prev?.map((s) => (s.id === updated.id ? normalize(updated) : s)) ?? null);
      router.refresh();
    } catch (err) {
      console.error("saveSection error", err);
      alert("Failed to save section");
    }
  }

  // Save full order (sequential PUTs)
  async function saveOrder() {
    if (!companyId || !sections) return;
    setSaving(true);
    try {
      for (let i = 0; i < sections.length; i++) {
        const s = sections[i];
        await fetch(`/api/company/${companyId}/sections`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: s.id, position: i + 1, type: s.type, title: s.title, content: s.content, bg_color: s.bg_color }),
        });
      }
      router.refresh();
      await loadSections();
    } catch (err) {
      console.error("saveOrder error", err);
      alert("Failed to save order");
    } finally {
      setSaving(false);
    }
  }

  // Update color
  async function updateColor(id: string, color: string) {
    setSections((prev) => prev?.map((s) => (s.id === id ? { ...s, bg_color: color } : s)) ?? null);
    try {
      await fetch(`/api/company/${companyId}/sections`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, bg_color: color }),
      });
      router.refresh();
    } catch (err) {
      console.error("updateColor failed", err);
      alert("Failed to update color");
      await loadSections();
    }
  }

  // Inline editor open
  function openEditor(section: SectionRow) {
    setActiveSectionId(section.id);
    setEditTitle(section.title ?? "");
    setEditBody(section.content?.body ?? "");
    const el = document.getElementById(`section-${section.id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function commitEdits() {
    if (!activeSectionId || !sections) return;
    const next = sections.map((s) =>
      s.id === activeSectionId ? { ...s, title: editTitle, content: { ...(s.content ?? {}), body: editBody } } : s
    );
    setSections(next);
    const s = next.find((x) => x.id === activeSectionId)!;
    await saveSection(s);
    setActiveSectionId(null);
  }

  // Drag handlers (native HTML5) — Option 1: reorder inside current sections only
  function onDragStart(e: React.DragEvent, id: string) {
    setDraggingId(id);
    try {
      e.dataTransfer.setData("text/plain", id);
    } catch (_) {}
    e.dataTransfer.effectAllowed = "move";
  }

  function onDragOver(e: React.DragEvent, overId: string) {
    e.preventDefault();
    if (!draggingId || draggingId === overId || !sections) return;

    const from = sections.findIndex((s) => s.id === draggingId);
    const to = sections.findIndex((s) => s.id === overId);
    if (from === -1 || to === -1) return;

    const next = [...sections];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);

    // update in-memory positions for instant UI
    setSections(next.map((s, i) => ({ ...s, position: i + 1 })));
  }

  async function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDraggingId(null);
    // Persist order
    await saveOrder();
  }

  // Compact section card for left column
  function CompactSectionCard({ s, idx }: { s: SectionRow; idx: number }) {
    return (
      <div
        id={`section-${s.id}`}
        key={s.id}
        draggable
        onDragStart={(e) => onDragStart(e, s.id)}
        onDragOver={(e) => onDragOver(e, s.id)}
        onDrop={onDrop}
        className={`flex items-start gap-3 p-3 border rounded-md hover:shadow transition cursor-move bg-white`}
        style={{ backgroundColor: s.bg_color }}
        aria-roledescription="draggable section"
      >
        <div className="flex flex-col items-center gap-2 w-8">
          <div className="h-8 w-8 flex items-center justify-center rounded bg-white text-gray-600 border">{idx + 1}</div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="truncate">
              <div className="font-medium text-sm truncate max-w-[180px]">{s.title ?? prettifyType(s.type)}</div>
              <div className="text-xs text-gray-600">{s.type} • Position {idx + 1}</div>
            </div>

            <div className="flex items-center gap-2">
              <input aria-label="background color" type="color" value={s.bg_color ?? "#ffffff"} onChange={(e) => updateColor(s.id, e.target.value)} title="Change section background" className="h-8 w-8 p-0 border rounded" />
              <button onClick={() => openEditor(s)} className="px-2 py-1 text-xs border rounded bg-white" title="Edit content">Edit</button>
              <button onClick={() => removeSection(s.id)} className="px-2 py-1 text-xs text-red-600">Remove</button>
            </div>
          </div>

          <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700 line-clamp-3">
            {s.content?.body ? s.content.body : <span className="text-gray-400">No content — click Edit</span>}
          </div>
        </div>
      </div>
    );
  }

  function SuggestedCard({ id, label }: { id: string; label: string }) {
    const content = TEMPLATE_CONTENT[id];
    return (
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold">{label}</h4>
            <div className="text-xs text-gray-500 mt-1 line-clamp-4">{(content && (content.title || content.headline || content.intro || JSON.stringify(content).slice(0, 80))) ?? "Template preview"}</div>
          </div>
          <div>
            <button onClick={() => addTemplateToCompany(id)} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Add</button>
          </div>
        </div>
      </div>
    );
  }

  function LivePreview() {
    return (
      <div className="rounded-lg border overflow-hidden bg-white">
        <div className="p-4 bg-white border-b sticky top-0 z-10">
          <h3 className="font-semibold">Live Company Preview</h3>
          <div className="text-xs text-gray-500">This reflects the company page (live)</div>
        </div>

        <div className="p-4 space-y-4 bg-gray-50">
          {!sections || sections.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No sections to preview</div>
          ) : (
            sections.map((s) => (
              <section key={s.id} id={`preview-${s.id}`} className="rounded-md overflow-hidden shadow-sm" style={{ backgroundColor: s.bg_color }}>
                <div className="max-w-4xl mx-auto p-6">
                  <h4 className="text-xl font-bold">{s.title ?? prettifyType(s.type)}</h4>
                  <div className="mt-2 text-gray-700">
                    {s.content?.body ? <div className="prose max-w-none">{s.content.body}</div> : <div className="text-sm text-gray-500 italic">No content yet</div>}
                  </div>
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    );
  }

  function prettifyType(t: string | undefined) {
    if (!t) return "Section";
    return String(t).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-8xl mx-auto grid grid-cols-12 gap-6">

        {/* Left column - current sections */}
        <div className="col-span-5 bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Current Sections</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => loadSections()} className="px-3 py-1 border rounded bg-white" title="Reload from server">Refresh</button>
              <button onClick={() => saveOrder()} disabled={saving} className="px-3 py-1 bg-blue-600 text-white rounded">{saving ? "Saving..." : "Save Order"}</button>
            </div>
          </div>

          <div className="mb-3 flex gap-2">
            <button onClick={() => addCustomSection()} className="px-3 py-1 border rounded bg-white text-sm">+ Add custom</button>
            <div className="flex gap-2">
              {TEMPLATE_LIBRARY.slice(0, 3).map((s) => (
                <button key={s.id} onClick={() => addTemplateToCompany(s.id)} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Add {s.label}</button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {loading && <div className="py-6 text-center text-gray-500">Loading...</div>}
            {!loading && (!sections || sections.length === 0) && <div className="p-6 text-center text-gray-500">No sections yet</div>}

            {sections?.map((sec, idx) => (
              <CompactSectionCard key={sec.id} s={sec} idx={idx} />
            ))}
          </div>
        </div>

        {/* Middle column - inline editor */}
        <div className="col-span-3 bg-white rounded-lg shadow p-4">
          <div>
            <h3 className="font-semibold mb-3">Editor</h3>
            {!activeSectionId && <div className="text-sm text-gray-500">Select a section to edit.</div>}

            {activeSectionId && (
              <>
                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-1">Title</label>
                  <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full border rounded px-2 py-1" />
                </div>

                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-1">Body</label>
                  <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} className="w-full border rounded px-2 py-2 min-h-[160px]" placeholder="Markdown or plain text (rendered in preview)" />
                </div>

                <div className="flex gap-2">
                  <button onClick={() => commitEdits()} className="px-3 py-1 bg-blue-600 text-white rounded">Save section</button>
                  <button onClick={() => setActiveSectionId(null)} className="px-3 py-1 border rounded">Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right column - templates + preview */}
        <div className="col-span-4 bg-white rounded-lg shadow p-4">
          <div className="flex items-start justify-between mb-4 gap-4">
            <div>
              <h2 className="text-xl font-bold">Template Library</h2>
              <div className="text-sm text-gray-500">Click Add to insert the suggested section into this company's page</div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => loadSections()} className="px-3 py-1 border rounded bg-white" title="Reload from server">Refresh</button>
              <button onClick={() => saveOrder()} disabled={saving} className="px-3 py-1 bg-blue-600 text-white rounded">{saving ? "Saving..." : "Save Order"}</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {TEMPLATE_LIBRARY.map((t) => (
              <SuggestedCard key={t.id} id={t.id} label={t.label} />
            ))}
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Live Preview</h3>
            <LivePreview />
          </div>
        </div>
      </div>
    </div>
  );
}
