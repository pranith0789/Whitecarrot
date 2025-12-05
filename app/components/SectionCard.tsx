"use client";

import { useState } from "react";

export default function SectionCard({
  sections,
  onDelete,
  onUpdate,
  onReorder,
}: any) {
  const [dragId, setDragId] = useState<string | null>(null);

  // DRAG START
  function handleDragStart(id: string) {
    setDragId(id);
  }

  // DRAG OVER - reorder array locally
  function handleDragOver(e: any, overId: string) {
    e.preventDefault();
    if (dragId === overId) return;

    const draggedIndex = sections.findIndex((s: any) => s.id === dragId);
    const overIndex = sections.findIndex((s: any) => s.id === overId);

    const newOrder = [...sections];
    const [dragged] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(overIndex, 0, dragged);

    onReorder(newOrder);
  }

  return (
    <div className="space-y-4">
      {sections.map((sec: any) => (
        <div
          key={sec.id}
          draggable
          onDragStart={() => handleDragStart(sec.id)}
          onDragOver={(e) => handleDragOver(e, sec.id)}
          className="border p-4 rounded shadow-sm bg-white"
          style={{ backgroundColor: sec.bg_color }}
        >
          <div className="flex justify-between">
            <h4 className="font-semibold">{sec.section_id}</h4>

            <button
              className="text-red-600"
              onClick={() => onDelete(sec.id)}
            >
              Delete
            </button>
          </div>

          <input
            type="color"
            value={sec.bg_color}
            onChange={(e) =>
              onUpdate({ ...sec, bg_color: e.target.value })
            }
          />

          <div className="mt-2 p-2 text-xs text-gray-600 bg-gray-50 rounded">
            Preview: {sec.content?.title || "No content yet"}
          </div>
        </div>
      ))}
    </div>
  );
}
