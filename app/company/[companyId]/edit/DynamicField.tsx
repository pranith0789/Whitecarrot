// app/components/DynamicField.tsx
"use client";

import React from "react";
import MediaUploader from "./MediaUploader";

/**
 * field:
 *  { field_key, field_type, label, required, metadata (string JSON) }
 *
 * value: the current value (could be string, array, object)
 * onChange: (newVal) => void
 */

type FieldDef = {
  field_key: string;
  field_type: string; // "text" | "textarea" | "image" | "video" | "array" | "number" | ...
  label?: string;
  required?: boolean;
  metadata?: any;
};

export default function DynamicField({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: any;
  onChange: (v: any) => void;
}) {
  const meta = field.metadata || {};

  // Helper to render array items - supports itemTemplate in metadata
  if (field.field_type === "array") {
    const items: any[] = Array.isArray(value) ? value : [];
    const itemTemplate = meta.itemTemplate || {};

    function addItem() {
      // create item object matching template keys
      const newItem: any = {};
      for (const k of Object.keys(itemTemplate)) {
        newItem[k] = itemTemplate[k] === "text" || itemTemplate[k] === "textarea" ? "" : null;
      }
      onChange([...items, newItem]);
    }
    function updateItem(idx: number, next: any) {
      const copy = [...items];
      copy[idx] = next;
      onChange(copy);
    }
    function removeItem(idx: number) {
      const copy = [...items];
      copy.splice(idx, 1);
      onChange(copy);
    }

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">{field.label}</div>
          <button onClick={addItem} type="button" className="text-sm px-2 py-1 bg-green-600 text-white rounded">
            + Add
          </button>
        </div>

        <div className="space-y-3">
          {items.map((it, idx) => (
            <div key={idx} className="p-3 border rounded bg-white">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 space-y-2">
                  {Object.entries(itemTemplate).map(([k, t]) => {
                    const label = k.replace(/_/g, " ");
                    if (t === "image" || t === "video") {
                      return (
                        <div key={k}>
                          <MediaUploader
                            label={label}
                            accept={t === "image" ? "image/*" : "video/*"}
                            value={it[k]}
                            onUploaded={(url) => updateItem(idx, { ...it, [k]: url })}
                          />
                        </div>
                      );
                    }

                    if (t === "textarea") {
                      return (
                        <div key={k}>
                          <div className="text-xs text-gray-600">{label}</div>
                          <textarea
                            value={it[k] ?? ""}
                            onChange={(e) => updateItem(idx, { ...it, [k]: e.target.value })}
                            className="w-full border rounded px-2 py-1"
                          />
                        </div>
                      );
                    }

                    // default text
                    return (
                      <div key={k}>
                        <div className="text-xs text-gray-600">{label}</div>
                        <input
                          value={it[k] ?? ""}
                          onChange={(e) => updateItem(idx, { ...it, [k]: e.target.value })}
                          className="w-full border rounded px-2 py-1"
                        />
                      </div>
                    );
                  })}
                </div>

                <div>
                  <button onClick={() => removeItem(idx)} className="px-2 py-1 text-sm text-red-600">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Non-array types
  switch (field.field_type) {
    case "text":
    case "number":
      return (
        <div>
          <div className="text-sm font-medium">{field.label}</div>
          <input
            value={value ?? ""}
            onChange={(e) => onChange(field.field_type === "number" ? Number(e.target.value) : e.target.value)}
            className="w-full border rounded px-2 py-1"
            type={field.field_type === "number" ? "number" : "text"}
          />
        </div>
      );
    case "textarea":
      return (
        <div>
          <div className="text-sm font-medium">{field.label}</div>
          <textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full border rounded px-2 py-2" />
        </div>
      );
    case "image":
    case "video":
      return (
        <div>
          <div className="text-sm font-medium">{field.label}</div>
          <MediaUploader
            accept={field.field_type === "image" ? "image/*" : "video/*"}
            value={value ?? ""}
            onUploaded={(url) => onChange(url)}
          />
        </div>
      );
    default:
      return (
        <div>
          <div className="text-sm font-medium">{field.label ?? field.field_key}</div>
          <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full border rounded px-2 py-1" />
        </div>
      );
  }
}
