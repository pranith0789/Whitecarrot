"use client";

import { useState } from "react";

export default function ColorPicker() {
  const [color, setColor] = useState("#ffffff");

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md w-48">
      <input
        type="color"
        className="w-full h-10"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <p className="mt-2 text-sm">Selected: {color}</p>
    </div>
  );
}
