"use client";
import React from "react";

export default function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: any; // from section_template_fields
  value: any;
  onChange: (v: any) => void;
}) {
  const { field_key, field_type, label, metadata } = field;

  if (field_type === "text") {
    return (
      <div className="mb-3">
        <label className="block text-sm text-gray-700 mb-1">{label}</label>
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder={metadata?.placeholder || ""}
        />
      </div>
    );
  }

  if (field_type === "textarea") {
    return (
      <div className="mb-3">
        <label className="block text-sm text-gray-700 mb-1">{label}</label>
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border rounded px-3 py-2 min-h-[120px]"
          placeholder={metadata?.placeholder || ""}
        />
      </div>
    );
  }

  if (field_type === "image" || field_type === "video" || field_type === "file") {
    return (
      <div className="mb-3">
        <label className="block text-sm text-gray-700 mb-1">{label}</label>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste file URL or upload via Upload button"
          className="w-full border rounded px-3 py-2"
        />
        <div className="mt-2 text-xs text-gray-500">Tip: Use the Upload button to store media in Supabase and paste URL here.</div>
      </div>
    );
  }

  if (field_type === "array") {
    // simple array editor for items represented as JSON array
    return (
      <div className="mb-3">
        <label className="block text-sm text-gray-700 mb-1">{label}</label>
        <textarea
          value={JSON.stringify(value || [], null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              onChange(parsed);
            } catch {
              // ignore parse error; user is editing JSON
              onChange(e.target.value);
            }
          }}
          className="w-full border rounded px-3 py-2 min-h-[140px] font-mono text-sm"
        />
        <div className="mt-1 text-xs text-gray-400">Edit JSON array for complex items.</div>
      </div>
    );
  }

  // fallback
  return (
    <div className="mb-3">
      <label className="block text-sm text-gray-700 mb-1">{label}</label>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
    </div>
  );
}
