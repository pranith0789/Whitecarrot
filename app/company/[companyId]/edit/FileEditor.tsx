"use client";

import React, { useRef, useState } from "react";

type Field = {
  field_key: string;
  field_type: "text" | "textarea" | "image" | "video" | "array";
  label: string;
  required?: boolean;
  metadata?: any;
};

export default function FieldEditor({
  field,
  value,
  onChange,
  onUpload,
}: {
  field: Field;
  value: any;
  onChange: (v: any) => void;
  onUpload?: (file: File) => Promise<string | null>;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  // handle file input and call onUpload to store on server and get URL
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!onUpload) {
      // fallback: create data URL
      const url = await toDataUrl(f);
      onChange(url);
      return;
    }

    setUploading(true);
    try {
      const url = await onUpload(f);
      if (url) onChange(url);
    } catch (err) {
      console.error("upload error", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  // small helper to convert file to data URL (fallback)
  function toDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Array field editing (simple)
  function renderArrayEditor() {
    const items: any[] = Array.isArray(value) ? value : [];
    function addItem() {
      const next = [...items, {}];
      onChange(next);
    }
    function updateItem(i: number, key: string, val: any) {
      const next = items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it));
      onChange(next);
    }
    function removeItem(i: number) {
      const next = items.filter((_, idx) => idx !== i);
      onChange(next);
    }

    // We don't know item shape here; provide JSON editor + basic controls
    return (
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="p-2 border rounded bg-white">
            <div className="flex gap-2 items-start">
              <textarea className="flex-1 border rounded p-2" value={JSON.stringify(it, null, 2)} onChange={(e) => {
                try {
                  updateItem(i, "__raw__", JSON.parse(e.target.value));
                } catch {
                  // ignore parse errors while typing
                  updateItem(i, "__raw__", e.target.value);
                }
              }} />
              <div className="flex flex-col gap-2">
                <button onClick={() => removeItem(i)} className="px-2 py-1 text-sm text-red-600">Remove</button>
              </div>
            </div>
          </div>
        ))}
        <div>
          <button onClick={addItem} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Add item</button>
        </div>
      </div>
    );
  }

  if (field.field_type === "text") {
    return (
      <div>
        <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
        <input className="w-full border rounded px-2 py-1" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }

  if (field.field_type === "textarea") {
    return (
      <div>
        <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
        <textarea className="w-full border rounded px-2 py-2 min-h-[100px]" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }

  if (field.field_type === "image" || field.field_type === "video") {
    return (
      <div>
        <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
        <div className="flex items-center gap-3">
          <input ref={fileRef} type="file" accept={field.field_type === "image" ? "image/*" : "video/*"} onChange={handleFileChange} />
          {uploading && <div className="text-sm text-gray-500">Uploading...</div>}
        </div>

        {value && typeof value === "string" && (
          <div className="mt-3">
            {field.field_type === "image" ? (
              <img src={value} alt={field.label} className="max-h-40 rounded" />
            ) : (
              <video src={value} controls className="max-h-40 rounded" />
            )}
          </div>
        )}
      </div>
    );
  }

  if (field.field_type === "array") {
    return (
      <div>
        <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
        {renderArrayEditor()}
      </div>
    );
  }

  return null;
}
