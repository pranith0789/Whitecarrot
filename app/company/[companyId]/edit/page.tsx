"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { ArrowLeft } from "lucide-react";

/**
 * Types
 */
type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
interface JSONObject { [k: string]: JSONValue }
interface JSONArray extends Array<JSONValue> {}

interface CompanySection {
  id: string;
  company_id?: string;
  section_id?: string; // canonical template id
  type?: string; // for legacy
  title?: string | null;
  content: JSONObject;
  position: number;
  bg_color?: string;
  created_at?: string;
}

interface Template {
  id: string; // template id (section_templates.id)
  name: string;
  type: string; // e.g. "intro_video", "about_left"
  content: JSONObject; // default content structure
  bg_color?: string;
}

/**
 * ------- Custom Editors for specific templates (B: custom UI per template)
 *
 * Each editor receives:
 *   section: CompanySection
 *   onChange: (patch) => void  // merges into section.content
 *
 * For complex nested editors (FAQ, CultureCards etc.) we provide
 * a reasonable production-style UI with add/remove/reorder inside.
 */

/* ---------- Editor: IntroVideo ---------- */
function IntroVideoEditor({ section, onChange }: { section: CompanySection; onChange: (c: JSONObject) => void }) {
  const content = section.content || {};
  const headline = String(content["headline"] ?? "");
  const subtext = String(content["subtext"] ?? "");
  const video = String(content["video"] ?? "");

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Headline</label>
      <input value={headline} onChange={(e) => onChange({ ...content, headline: e.target.value })} className="w-full p-2 border rounded" />

      <label className="block text-sm font-medium">Subtext</label>
      <textarea value={subtext} onChange={(e) => onChange({ ...content, subtext: e.target.value })} className="w-full p-2 border rounded" />

      <label className="block text-sm font-medium">Background video URL</label>
      <input value={video} onChange={(e) => onChange({ ...content, video: e.target.value })} className="w-full p-2 border rounded" />
    </div>
  );
}

/* ---------- Editor: AboutLeft ---------- */
function AboutLeftEditor({ section, onChange }: { section: CompanySection; onChange: (c: JSONObject) => void }) {
  const content = section.content || {};
  const title = String(content["title"] ?? "");
  const description = String(content["description"] ?? "");
  const image = String(content["image"] ?? "");

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Title</label>
      <input value={title} onChange={(e) => onChange({ ...content, title: e.target.value })} className="w-full p-2 border rounded" />

      <label className="block text-sm font-medium">Description</label>
      <textarea value={description} onChange={(e) => onChange({ ...content, description: e.target.value })} className="w-full p-2 border rounded" />

      <label className="block text-sm font-medium">Image URL</label>
      <input value={image} onChange={(e) => onChange({ ...content, image: e.target.value })} className="w-full p-2 border rounded" />
    </div>
  );
}

/* ---------- Editor: CultureCards ---------- */
function CultureCardsEditor({ section, onChange }: { section: CompanySection; onChange: (c: JSONObject) => void }) {
  const content = section.content || {};
  const items = Array.isArray(content["items"]) ? (content["items"] as any[]) : [];

  function updateItem(i: number, patch: any) {
    const next = items.map((it, idx) => (idx === i ? { ...it, ...patch } : it));
    onChange({ ...content, items: next });
  }
  function addItem() {
    onChange({ ...content, items: [...items, { title: "New", body: "" }] });
  }
  function removeItem(i: number) {
    const next = items.filter((_, idx) => idx !== i);
    onChange({ ...content, items: next });
  }

  return (
    <div className="space-y-3">
      {items.map((it: any, i: number) => (
        <div key={i} className="p-3 border rounded flex gap-2 items-start">
          <div className="flex-1">
            <input value={it.title} onChange={(e) => updateItem(i, { title: e.target.value })} className="w-full p-2 border rounded mb-2" />
            <textarea value={it.body} onChange={(e) => updateItem(i, { body: e.target.value })} className="w-full p-2 border rounded" />
          </div>
          <div>
            <button onClick={() => removeItem(i)} className="px-2 py-1 text-sm text-red-600">Remove</button>
          </div>
        </div>
      ))}

      <div>
        <button onClick={addItem} className="px-3 py-2 bg-green-600 text-white rounded">Add Card</button>
      </div>
    </div>
  );
}

/* ---------- Editor: EmployeeVoice ---------- */
function EmployeeVoiceEditor({ section, onChange }: { section: CompanySection; onChange: (c: JSONObject) => void }) {
  const content = section.content || {};
  const quotes = Array.isArray(content["quotes"]) ? (content["quotes"] as any[]) : [];

  function updateQuote(i: number, patch: any) {
    const next = quotes.map((q, idx) => (idx === i ? { ...q, ...patch } : q));
    onChange({ ...content, quotes: next });
  }
  function addQuote() {
    onChange({ ...content, quotes: [...quotes, { author: "Author", body: "Quote" }] });
  }
  function removeQuote(i: number) {
    onChange({ ...content, quotes: quotes.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="space-y-3">
      {quotes.map((q: any, i: number) => (
        <div key={i} className="p-3 border rounded flex gap-2">
          <div className="flex-1">
            <input value={q.author} onChange={(e) => updateQuote(i, { author: e.target.value })} className="w-full p-2 border rounded mb-2" />
            <textarea value={q.body} onChange={(e) => updateQuote(i, { body: e.target.value })} className="w-full p-2 border rounded" />
          </div>
          <div>
            <button onClick={() => removeQuote(i)} className="px-2 py-1 text-red-600">Remove</button>
          </div>
        </div>
      ))}
      <div>
        <button onClick={addQuote} className="px-3 py-2 bg-green-600 text-white rounded">Add Quote</button>
      </div>
    </div>
  );
}

/* ---------- Editor: FAQ (repeater of Q/A) ---------- */
function FAQEditor({ section, onChange }: { section: CompanySection; onChange: (c: JSONObject) => void }) {
  const content = section.content || {};
  const faqs = Array.isArray(content["faqs"]) ? (content["faqs"] as any[]) : [];

  function updateFAQ(i: number, patch: any) {
    const next = faqs.map((f, idx) => (idx === i ? { ...f, ...patch } : f));
    onChange({ ...content, faqs: next });
  }
  function addFAQ() {
    onChange({ ...content, faqs: [...faqs, { q: "Question", a: "Answer" }] });
  }
  function removeFAQ(i: number) {
    onChange({ ...content, faqs: faqs.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="space-y-3">
      {faqs.map((f: any, i: number) => (
        <div key={i} className="p-3 border rounded">
          <input value={f.q} onChange={(e) => updateFAQ(i, { q: e.target.value })} className="w-full p-2 border rounded mb-2" />
          <textarea value={f.a} onChange={(e) => updateFAQ(i, { a: e.target.value })} className="w-full p-2 border rounded" />
          <div className="mt-2"><button onClick={() => removeFAQ(i)} className="text-red-600">Remove</button></div>
        </div>
      ))}
      <button onClick={addFAQ} className="px-3 py-2 bg-green-600 text-white rounded">Add FAQ</button>
    </div>
  );
}

/* ---------- Editor: Stats (number cards) ---------- */
function StatsEditor({ section, onChange }: { section: CompanySection; onChange: (c: JSONObject) => void }) {
  const content = section.content || {};
  const stats = Array.isArray(content["stats"]) ? (content["stats"] as any[]) : [];

  function updateStat(i: number, patch: any) {
    const next = stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    onChange({ ...content, stats: next });
  }
  function addStat() {
    onChange({ ...content, stats: [...stats, { label: "Metric", number: "0" }] });
  }
  function removeStat(i: number) {
    onChange({ ...content, stats: stats.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="space-y-3">
      {stats.map((s: any, i: number) => (
        <div key={i} className="p-3 border rounded flex gap-2 items-center">
          <input value={s.label} onChange={(e) => updateStat(i, { label: e.target.value })} className="p-2 border rounded w-1/3" />
          <input value={s.number} onChange={(e) => updateStat(i, { number: e.target.value })} className="p-2 border rounded w-1/3" />
          <button onClick={() => removeStat(i)} className="text-red-600">Remove</button>
        </div>
      ))}
      <button onClick={addStat} className="px-3 py-2 bg-green-600 text-white rounded">Add Stat</button>
    </div>
  );
}

/* ---------- Editor: Awards ---------- */
function AwardsEditor({ section, onChange }: { section: CompanySection; onChange: (c: JSONObject) => void }) {
  const content = section.content || {};
  const items = Array.isArray(content["items"]) ? (content["items"] as any[]) : [];

  function updateItem(i: number, patch: any) {
    const next = items.map((it, idx) => (idx === i ? { ...it, ...patch } : it));
    onChange({ ...content, items: next });
  }
  function addItem() {
    onChange({ ...content, items: [...items, { title: "Award", year: "2025", image: "" }] });
  }
  function removeItem(i: number) {
    onChange({ ...content, items: items.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="space-y-3">
      {items.map((it: any, i: number) => (
        <div key={i} className="p-3 border rounded flex gap-2">
          <input value={it.title} onChange={(e) => updateItem(i, { title: e.target.value })} className="p-2 border rounded w-1/3" />
          <input value={it.year} onChange={(e) => updateItem(i, { year: e.target.value })} className="p-2 border rounded w-1/6" />
          <input value={it.image} onChange={(e) => updateItem(i, { image: e.target.value })} className="p-2 border rounded flex-1" />
          <button onClick={() => removeItem(i)} className="text-red-600">Remove</button>
        </div>
      ))}
      <button onClick={addItem} className="px-3 py-2 bg-green-600 text-white rounded">Add Award</button>
    </div>
  );
}

/* ---------- Editor: WhyJoinUs ---------- */
function WhyJoinUsEditor({ section, onChange }: { section: CompanySection; onChange: (c: JSONObject) => void }) {
  const content = section.content || {};
  const points = Array.isArray(content["points"]) ? (content["points"] as any[]) : [];

  function updatePoint(i: number, patch: any) {
    const next = points.map((p, idx) => (idx === i ? { ...p, ...patch } : p));
    onChange({ ...content, points: next });
  }
  function addPoint() {
    onChange({ ...content, points: [...points, { title: "Reason", body: "" }] });
  }
  function removePoint(i: number) {
    onChange({ ...content, points: points.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="space-y-3">
      {points.map((p: any, i: number) => (
        <div key={i} className="p-3 border rounded">
          <input value={p.title} onChange={(e) => updatePoint(i, { title: e.target.value })} className="w-full p-2 border rounded mb-2" />
          <textarea value={p.body} onChange={(e) => updatePoint(i, { body: e.target.value })} className="w-full p-2 border rounded" />
          <div className="mt-2"><button onClick={() => removePoint(i)} className="text-red-600">Remove</button></div>
        </div>
      ))}
      <button onClick={addPoint} className="px-3 py-2 bg-green-600 text-white rounded">Add Reason</button>
    </div>
  );
}

/* ---------- Editor: DEI (Diversity, Equity & Inclusion) ---------- */
function DEIEditor({ section, onChange }: { section: CompanySection; onChange: (c: JSONObject) => void }) {
  const content = section.content || {};
  const pillars = Array.isArray(content["pillars"]) ? (content["pillars"] as any[]) : [];
  const description = String(content["description"] ?? "");
  const title = String(content["title"] ?? "");

  function updatePillar(i: number, patch: any) {
    const next = pillars.map((p, idx) => (idx === i ? { ...p, ...patch } : p));
    onChange({ ...content, pillars: next });
  }
  function addPillar() {
    onChange({ ...content, pillars: [...pillars, { title: "Pillar", body: "" }] });
  }
  function removePillar(i: number) {
    onChange({ ...content, pillars: pillars.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Title</label>
      <input value={title} onChange={(e) => onChange({ ...content, title: e.target.value })} className="w-full p-2 border rounded" />

      <label className="block text-sm font-medium">Description</label>
      <textarea value={description} onChange={(e) => onChange({ ...content, description: e.target.value })} className="w-full p-2 border rounded" />

      <div className="pt-2">
        <h4 className="font-semibold mb-2">Pillars</h4>
        {pillars.map((p: any, i: number) => (
          <div key={i} className="p-2 border rounded mb-2">
            <input value={p.title} onChange={(e) => updatePillar(i, { title: e.target.value })} className="w-full p-2 border rounded mb-1" />
            <textarea value={p.body} onChange={(e) => updatePillar(i, { body: e.target.value })} className="w-full p-2 border rounded" />
            <div className="mt-2"><button onClick={() => removePillar(i)} className="text-red-600">Remove</button></div>
          </div>
        ))}
        <button onClick={addPillar} className="px-3 py-2 bg-green-600 text-white rounded">Add Pillar</button>
      </div>
    </div>
  );
}

/* ---------- Editor Switcher: chooses proper editor by section.type / section.section_id ---------- */
function EditorSwitcher({ section, onContentChange }: { section: CompanySection; onContentChange: (c: JSONObject) => void }) {
  const key = (section.section_id || section.type || "").toLowerCase();

  switch (key) {
    case "intro":
    case "intro_video":
      return <IntroVideoEditor section={section} onChange={onContentChange} />;
    case "about":
    case "about_left":
      return <AboutLeftEditor section={section} onChange={onContentChange} />;
    case "culture":
    case "culture_cards":
      return <CultureCardsEditor section={section} onChange={onContentChange} />;
    case "employeevoice":
    case "employee_voice":
      return <EmployeeVoiceEditor section={section} onChange={onContentChange} />;
    case "faq":
    case "faq_section":
      return <FAQEditor section={section} onChange={onContentChange} />;
    case "stats":
    case "numbers":
      return <StatsEditor section={section} onChange={onContentChange} />;
    case "awards":
    case "awards_section":
      return <AwardsEditor section={section} onChange={onContentChange} />;
    case "whyjoin":
    case "why_join_us":
      return <WhyJoinUsEditor section={section} onChange={onContentChange} />;
    case "dei":
    case "dei_section":
      return <DEIEditor section={section} onChange={onContentChange} />;
    default:
      // Generic fallback: simple object editor (key/value)
      const content = section.content || {};
      return (
        <div className="space-y-2">
          {Object.entries(content).map(([k, v]) => (
            <div key={k}>
              <label className="block text-sm">{k}</label>
              <input value={String(v ?? "")} onChange={(e) => onContentChange({ ...content, [k]: e.target.value })} className="w-full p-2 border rounded" />
            </div>
          ))}
          <div className="text-sm text-gray-500 mt-2">No specific editor available for this template — generic fields above.</div>
        </div>
      );
  }
}

/* ---------- Small Preview Renderers (simplified) ---------- */
function PreviewRenderer({ section }: { section: CompanySection }) {
  const key = (section.section_id || section.type || "").toLowerCase();
  const c = section.content || {};

  // Very lightweight previews that match the production look roughly
  switch (key) {
    case "intro":
    case "intro_video":
      return (
        <div className="rounded-lg overflow-hidden relative min-h-[220px] bg-black text-white p-6">
          <div className="text-2xl font-bold">{String(c.headline ?? section.title ?? "Welcome")}</div>
          <div className="mt-2 text-sm">{String(c.subtext ?? "")}</div>
        </div>
      );
    case "about":
    case "about_left":
      return (
        <div className="rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 bg-white border">
          <div className="bg-cover bg-center" style={{ backgroundImage: `url(${String(c.image ?? "/AboutUS.png")})`, minHeight: 160 }} />
          <div className="p-6">
            <h3 className="text-xl font-bold">{String(c.title ?? section.title ?? "About Us")}</h3>
            <p className="mt-2 text-gray-600">{String(c.description ?? "")}</p>
          </div>
        </div>
      );
    case "culture":
    case "culture_cards":
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Array.isArray(c.items) ? c.items : []).slice(0, 3).map((it: any, i: number) => (
            <div key={i} className="p-4 border rounded bg-white">
              <div className="font-semibold">{String(it.title ?? "")}</div>
              <div className="text-sm text-gray-600 mt-1">{String(it.body ?? "")}</div>
            </div>
          ))}
        </div>
      );
    case "employeevoice":
    case "employee_voice":
      return (
        <div className="space-y-3">
          {(Array.isArray(c.quotes) ? c.quotes : []).slice(0, 2).map((q: any, i: number) => (
            <blockquote key={i} className="p-3 border rounded bg-gray-50">
              <div className="italic">"{String(q.body ?? "")}"</div>
              <div className="mt-1 font-semibold">— {String(q.author ?? "")}</div>
            </blockquote>
          ))}
        </div>
      );
    default:
      return <pre className="p-3 bg-gray-50 border rounded text-sm">{JSON.stringify(section.content, null, 2)}</pre>;
  }
}

/* ---------- Main Edit Page Client Component ---------- */
export default function CompanyEditPageClient() {
  //  const cookieStore = cookies();
  // const supabaseAuth = createClient(cookieStore);

  // const {
  //   data: { user },
  // } = await supabaseAuth.auth.getUser();

  // if (!user) redirect("/auth/login");
  // if (!user) redirect("/auth/login");
  const params = useParams() as { companyId?: string };
  const router = useRouter();
  const companyId = params?.companyId ?? "";

  const [sections, setSections] = useState<CompanySection[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedSection, setSelectedSection] = useState<CompanySection | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Load company sections & templates
  useEffect(() => {
    if (!companyId) return;
    setLoading(true);
    (async () => {
      try {
        const sres = await fetch(`/api/company/${companyId}/sections`);
        const sjson = await sres.json();
        const filtered = Array.isArray(sjson)
        ? sjson.filter((s: any) => s.section_id !== "careers_default")
        : [];
        const tres = await fetch(`/api/template`); // per your request: /api/templates
        let tjson = [];
        if (tres.ok) {
          tjson = await tres.json();
        } else {
          // templates endpoint missing -> fallback to empty array
          tjson = [];
        }

        // Normalize: ensure arrays
        setSections(Array.isArray(sjson) ? sjson : []);
        setTemplates(Array.isArray(tjson) ? tjson : []);
      } catch (err) {
        console.error("Load error", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId]);

  // Select first when nothing selected
  useEffect(() => {
    if (!selectedSection && sections.length > 0) {
      setSelectedSection(sections[0]);
    }
  }, [sections, selectedSection]);

  // ---------- CRUD helpers (POST / PUT / DELETE via existing endpoints) ----------
  async function addCustomSection() {
    if (!companyId) return;
    const payload = {
      type: "custom",
      title: "New section",
      content: { body: "Edit me" },
      position: (sections.length || 0) + 1,
      bg_color: "#ffffff",
    };
    const res = await fetch(`/api/company/${companyId}/sections`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      alert("Failed to create section");
      return;
    }
    const created = await res.json();
    setSections((p) => [...p, created]);
    setSelectedSection(created);
  }

  async function addTemplateToCompany(tpl: Template) {
    if (!companyId) return;
    const payload = {
      section_id: tpl.id, // DB column referring to template id
      type: tpl.type,
      title: tpl.content?.title ?? tpl.name,
      content: tpl.content,
      position: (sections.length || 0) + 1,
      bg_color: tpl.bg_color ?? "#ffffff",
    };
    const res = await fetch(`/api/company/${companyId}/sections`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      alert("Failed to add template to company");
      return;
    }

    const created = await res.json();
    setSections((p) => [...p, created]);
    setSelectedSection(created);
  }

  async function removeSection(id: string) {
    if (!companyId) return;
    if (!confirm("Remove section?")) return;
    // Optimistic UI
    const prev = sections;
    setSections((s) => s.filter((x) => x.id !== id));
    if (selectedSection?.id === id) setSelectedSection(null);

    const res = await fetch(`/api/company/${companyId}/sections`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      alert("Failed to delete");
      setSections(prev);
    }
  }

  async function saveSection(section: CompanySection) {
    if (!companyId) return;
    setSaving(true);

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
      method: "PUT", // keep compatibility with your existing PUT handler
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      alert("Failed to save section");
      setSaving(false);
      return;
    }

    const updated = await res.json();
    setSections((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setSelectedSection(updated);
    setSaving(false);
  }

  // Save order: iterate and PUT positions (keeps compatible)
  async function saveOrder(newList: CompanySection[]) {
    if (!companyId) return;
    setSaving(true);
    try {
      for (let i = 0; i < newList.length; i++) {
        const s = newList[i];
        await fetch(`/api/company/${companyId}/sections`, {
          method: "PUT",
          body: JSON.stringify({
            id: s.id,
            position: i + 1,
          }),
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (err) {
      console.error("saveOrder error", err);
      alert("Failed to persist order");
    } finally {
      setSaving(false);
    }
  }

  // ---------- Drag & Drop ----------
  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const start = result.source.index;
    const end = result.destination.index;
    const next = Array.from(sections);
    const [moved] = next.splice(start, 1);
    next.splice(end, 0, moved);

    // reindex positions in-memory
    const reindexed = next.map((s, idx) => ({ ...s, position: idx + 1 }));
    setSections(reindexed);
    // persist
    saveOrder(reindexed);
  }

  // ---------- Editor content patch helper ----------
  function patchSelectedContent(patch: JSONObject) {
    if (!selectedSection) return;
    const next: CompanySection = { ...selectedSection, content: { ...(selectedSection.content || {}), ...patch } };
    setSelectedSection(next);
    // reflect in list (optimistic)
    setSections((prev) => prev.map((s) => (s.id === next.id ? next : s)));
  }

  // ---------- Save selected section (saveSection uses PUT) ----------
  async function handleSaveSelected() {
    if (!selectedSection) return;
    await saveSection(selectedSection);
  }

  if (loading) return <div className="p-10 text-center">Loading edit page...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <button
        onClick={() => router.push(`/company/${companyId}`)}
        title="Exit Editor"
        className="
          absolute top-1 right-4 
          p-2 rounded-full 
          bg-white/90 
          border border-gray-300 
          shadow-md 
          hover:bg-gray-100 
          transition 
          backdrop-blur-sm
          z-50
        "
      >
        <ArrowLeft className="h-6 w-6 text-gray-700" />
      </button>

      <div className="max-w-8xl mx-auto px-4 md:px-6 py-4 
                grid grid-cols-12 gap-6">

  {/* LEFT PANEL — Company Sections */}
  <div className="
      col-span-12 
      md:col-span-5 
      lg:col-span-3 
      bg-white rounded-xl shadow border p-4 
      h-[70vh] md:h-[75vh] lg:h-[80vh] 
      overflow-y-auto
  ">

    {/* Sticky Header */}
    <div className="sticky top-0 bg-white pb-3 mb-3 z-10 border-b">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Company Sections</h2>

        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/company/${companyId}/careers/edit`)}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition text-sm"
          >
            Careers
          </button>

          <button
            onClick={async () => {
              setLoading(true);
              const res = await fetch(`/api/company/${companyId}/sections`);
              const j = await res.json();
              const filtered = Array.isArray(j)
                ? j.filter((s) => s.section_id !== "careers_default")
                : [];
              setSections(filtered);
              setLoading(false);
            }}
            className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 transition text-sm"
          >
            Reload
          </button>

          <button
            onClick={addCustomSection}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
          >
            + Custom
          </button>
        </div>
      </div>
    </div>

    {/* Draggable List */}
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="company-sections">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
            {sections.map((s, idx) => (
              <Draggable key={s.id} draggableId={s.id} index={idx}>
                {(prov) => (
                  <div
                    ref={prov.innerRef}
                    {...prov.draggableProps}
                    {...prov.dragHandleProps}
                    onClick={() => setSelectedSection(s)}
                    className={`p-3 rounded-lg border cursor-pointer transition flex justify-between items-center ${
                      selectedSection?.id === s.id
                        ? "bg-blue-50 border-blue-300 shadow-sm"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-medium">{s.title ?? s.section_id}</div>
                      <div className="text-xs text-gray-500">
                        pos {s.position} • {s.section_id}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={s.bg_color ?? "#ffffff"}
                        onChange={async (e) => {
                          const color = e.target.value;
                          setSections(prev =>
                            prev.map((p) =>
                              p.id === s.id ? { ...p, bg_color: color } : p
                            )
                          );
                          await fetch(`/api/company/${companyId}/sections`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: s.id, bg_color: color }),
                          });
                        }}
                        className="h-7 w-7 p-0 border rounded cursor-pointer"
                      />

                      <button
                        onClick={(ev) => {
                          ev.stopPropagation();
                          removeSection(s.id);
                        }}
                        className="text-red-600 text-xs hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  </div>

  {/* CENTER PANEL — Editor */}
  <div className="
      col-span-12 
      md:col-span-7 
      lg:col-span-6 
      bg-white rounded-xl shadow border p-4 
      h-fit
  ">

    {/* Sticky Header */}
    <div className="sticky top-0 bg-white pb-3 mb-3 z-10 border-b">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-lg font-semibold">Editor</h2>

        <div className="flex gap-2">
          <button
            onClick={() => selectedSection && saveSection(selectedSection)}
            disabled={!selectedSection || saving}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={() => {
              if (selectedSection) {
                setSelectedSection({
                  ...selectedSection,
                  content: selectedSection.content ?? {},
                });
              }
            }}
            className="px-3 py-1 border rounded text-sm"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

    {!selectedSection ? (
      <p className="text-gray-500 mt-6">Select a section from the left to edit its fields.</p>
    ) : (
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title (optional)</label>
          <input
            value={selectedSection.title ?? ""}
            onChange={(e) => {
              const next = { ...selectedSection, title: e.target.value };
              setSelectedSection(next);
              setSections(prev => prev.map((s) => (s.id === next.id ? next : s)));
            }}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Template Editor */}
        <div>
          <label className="block text-sm font-medium mb-1">Template Editor</label>
          <div className="p-4 border rounded-lg bg-gray-50">
            <EditorSwitcher
              section={selectedSection}
              onContentChange={(c) => patchSelectedContent(c)}
            />
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium mb-1">Preview</label>
          <div className="p-4 border rounded-lg bg-white shadow-sm">
            <PreviewRenderer section={selectedSection} />
          </div>
        </div>
      </div>
    )}
  </div>

  {/* RIGHT PANEL — Templates */}
  <div className="
      col-span-12 
      lg:col-span-3 
      bg-white rounded-xl shadow border p-4 
      h-[70vh] md:h-[75vh] lg:h-[80vh] 
      overflow-y-auto
  ">

    {/* Sticky Header */}
    <div className="sticky top-0 bg-white pb-3 mb-3 z-10 border-b">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Templates</h2>
        <button onClick={() => router.refresh()} className="px-2 py-1 border rounded text-sm">
          Reload
        </button>
      </div>
    </div>

    <div className="space-y-3">
      {templates.length === 0 && (
        <p className="text-sm text-gray-500">No templates available.</p>
      )}

      {templates.map((tpl) => (
        <div
          key={tpl.id}
          className="p-3 border rounded-lg hover:bg-gray-50 transition flex justify-between items-center"
        >
          <div>
            <div className="font-medium">{tpl.name}</div>
            <div className="text-xs text-gray-500">{tpl.type}</div>
          </div>

          <button
            onClick={() => addTemplateToCompany(tpl)}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      ))}
    </div>
  </div>

</div>

  </div>  );
}
