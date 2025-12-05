"use client";

const suggestions = [
  { id: "mission", label: "Mission" },
  { id: "vision", label: "Vision" },
  { id: "leadership", label: "Leadership" },
  { id: "faq", label: "FAQ" },
];

export default function SuggestedSections({ setSections }: any) {
  function addSection(sec: any) {
    setSections((prev: any) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        section_id: sec.id,
        position: prev.length + 1,
        bg_color: "#ffffff",
        content: {},
      },
    ]);
  }

  return (
    <div className="space-y-3">
      {suggestions.map((sec) => (
        <button
          key={sec.id}
          onClick={() => addSection(sec)}
          className="w-full text-left border p-3 rounded-lg bg-white hover:bg-gray-200"
        >
          {sec.label}
        </button>
      ))}
    </div>
  );
}
