"use client";
import React, { useEffect, useState } from "react";
import { fetchTemplateFields } from "@/app/lib/SectionTemplatesService";
import FieldEditor from "./FieldEditor";

/**
 * props:
 * - section: { id, section_id(type), content }
 * - onUpdateContent: (newContent) => void
 * - onSave: () => Promise<void>
 */
export default function DynamicEditorSidebar({ section, onUpdateContent, onSave }: any) {
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!section) return;
    setLoading(true);
    fetchTemplateFields(section.type)
      .then((f) => setFields(f || []))
      .catch((err) => {
        console.error("Failed to load fields", err);
        setFields([]);
      })
      .finally(() => setLoading(false));
  }, [section?.type]);

  if (!section) return <div className="p-4 text-sm text-gray-500">No section selected</div>;

  return (
    <div className="p-4 border-l h-full overflow-auto">
      <h3 className="font-semibold mb-2">Edit: {section.title || section.type}</h3>
      {loading && <div className="text-sm text-gray-500">Loading fields...</div>}
      {!loading && (
        <div>
          {fields.map((f) => (
            <FieldEditor
              key={f.id}
              field={f}
              value={(section.content || {})[f.field_key]}
              onChange={(v: any) => {
                const next = { ...(section.content || {}) };
                next[f.field_key] = v;
                onUpdateContent(next);
              }}
            />
          ))}
          <div className="flex gap-2 mt-4">
            <button onClick={() => onSave()} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
