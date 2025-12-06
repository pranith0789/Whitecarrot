"use client";

import React from "react";

/**
 * Lightweight preview renderer used in the edit page.
 * It supports common templates by reading template.preview_component or template.id.
 *
 * This is intentionally simple — just enough to preview content.
 */

export default function TemplatePreviewRenderer({ template, content, title }: { template?: any; content?: any; title?: string }) {
  const key = template?.preview_component ?? template?.id ?? title;

  // small, sane defaults for preview fallback
  if (!template) {
    return (
      <div className="p-6 bg-white border rounded">
        <div className="text-sm text-gray-600">No template metadata</div>
        <pre className="text-xs text-gray-700 mt-2">{JSON.stringify(content, null, 2)}</pre>
      </div>
    );
  }

  switch (key) {
    case "IntroVideo":
    case "intro_video":
      return (
        <div className="relative h-64 overflow-hidden bg-black/5 rounded">
          {content?.video && <video src={content.video} autoPlay loop muted className="absolute inset-0 w-full h-full object-cover" />}
          <div className="relative z-10 p-6 text-center">
            <h3 className="text-2xl font-bold text-white drop-shadow">{content?.headline ?? template.name}</h3>
            <p className="text-sm text-white/90">{content?.subtext}</p>
          </div>
        </div>
      );

    case "AboutLeft":
    case "about_left":
      return (
        <div className="flex gap-4 items-center p-6 bg-white rounded border">
          {content?.image && <img src={content.image} className="w-1/3 h-40 object-cover rounded" />}
          <div>
            <h3 className="text-xl font-semibold">{content?.title ?? template.name}</h3>
            <p className="text-sm text-gray-700">{content?.description}</p>
          </div>
        </div>
      );

    case "CultureCards":
    case "culture_cards":
      return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white rounded border">
          {(content?.items || []).map((it: any, i: number) => (
            <div key={i} className="p-4 rounded bg-gray-50 border">
              <h4 className="font-semibold">{it.title}</h4>
              <p className="text-sm text-gray-700">{it.body}</p>
            </div>
          ))}
        </div>
      );

    case "EmployeeVoice":
    case "employee_voice":
      return (
        <div className="p-6 bg-white rounded border">
          {(content?.quotes || []).map((q: any, i: number) => (
            <blockquote key={i} className="mb-4">
              <p className="italic">“{q.body}”</p>
              <footer className="text-sm mt-2 font-semibold">— {q.author}</footer>
            </blockquote>
          ))}
        </div>
      );

    case "ContactSection":
    case "contact_default":
      return (
        <div className="p-6 bg-white rounded border">
          <div className="text-sm">Email: {content?.email}</div>
          <div className="text-sm">Phone: {content?.phone}</div>
          <div className="text-sm">Address: {content?.address}</div>
        </div>
      );

    case "CareersSection":
    case "careers_default":
      return (
        <div className="p-6 bg-white rounded border text-center">
          <h4 className="text-lg font-semibold">{content?.intro ?? "Careers"}</h4>
          <div className="mt-3">
            <button className="px-4 py-2 rounded bg-blue-600 text-white">View roles</button>
          </div>
        </div>
      );

    default:
      return (
        <div className="p-4 bg-white border rounded">
          <div className="text-sm font-semibold">{template.name}</div>
          <pre className="text-xs text-gray-700 mt-2">{JSON.stringify(content, null, 2)}</pre>
        </div>
      );
  }
}
