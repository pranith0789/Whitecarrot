"use client";

import React from "react";

export default function SuggestedCard({ template, onAdd }: { template: any; onAdd: () => void }) {
  return (
    <div className="border rounded-lg p-4 bg-white flex flex-col justify-between">
      <div>
        <div className="text-sm text-gray-500 mb-1">{template.id}</div>
        <h4 className="font-semibold">{template.name}</h4>
        <div className="text-xs text-gray-500 mt-2 line-clamp-3">{template.content ? JSON.stringify(template.content).slice(0, 120) : ""}</div>
      </div>

      <div className="mt-4 flex justify-end">
        <button onClick={onAdd} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Add</button>
      </div>
    </div>
  );
}
