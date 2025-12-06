// app/components/MediaUploader.tsx
"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/app/lib/supabaseClient";

type Props = {
  accept?: string; // e.g. "image/*" or "video/*"
  value?: string | null;
  onUploaded: (url: string) => void;
  label?: string;
};

export default function MediaUploader({ accept = "image/*", value, onUploaded, label }: Props) {
  const [uploading, setUploading] = useState(false);

async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;

  const supabase = supabaseBrowser(); // ✅ FIXED

  setUploading(true);
  try {
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;

    const { error: uploadErr } = await supabase
      .storage
      .from("media")
      .upload(fileName, file);

    if (uploadErr) throw uploadErr;

    const { data } = supabase
      .storage
      .from("media")
      .getPublicUrl(fileName);

    if (data?.publicUrl) {
      onUploaded(data.publicUrl);
    } else {
      throw new Error("No public URL returned");
    }

  } catch (err) {
    console.error("upload error", err);
    alert("Upload failed");
  } finally {
    setUploading(false);
  }
}


  return (
    <div className="space-y-2">
      {label && <div className="text-sm font-medium text-gray-700">{label}</div>}

      {value ? (
        <div className="p-2 border rounded bg-gray-50">
          {accept.startsWith("image") ? (
            // image preview
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="preview" className="max-h-36 object-contain mx-auto" />
          ) : (
            <video src={value} controls className="max-h-36 mx-auto" />
          )}
        </div>
      ) : null}

      <input type="file" accept={accept} onChange={handleFile} className="text-sm" />
      {uploading && <div className="text-xs text-blue-600">Uploading…</div>}
    </div>
  );
}
