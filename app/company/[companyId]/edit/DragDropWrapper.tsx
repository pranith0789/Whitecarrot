"use client";

import { useState } from "react";

export default function DragDropWrapper({ items, setItems, children }: any) {
  const [dragging, setDragging] = useState<number | null>(null);

  function handleDragStart(index: number) {
    setDragging(index);
  }

  function handleDragEnter(index: number) {
    if (dragging === null) return;

    const newList = [...items];
    const item = newList.splice(dragging, 1)[0];
    newList.splice(index, 0, item);
    setDragging(index);
    setItems(newList);
  }

  return (
    <div>
      {items.map((item: any, index: number) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragEnter={() => handleDragEnter(index)}
          className="select-none"
        >
          {children(item)}
        </div>
      ))}
    </div>
  );
}
