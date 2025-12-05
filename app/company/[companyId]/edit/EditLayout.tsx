"use client";

import { useEffect, useState } from "react";
import CurrentSections from "./CurrentSections";
import SuggestedSections from "./SuggestedSections";
import ColorPicker from "./ColorPicker";

export default function EditLayout({ companyId }: { companyId: string }) {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetch(`/api/company/${companyId}/sections`)
      .then((res) => res.json())
      .then((data) => setSections(data));
  }, [companyId]);

  return (
    <div className="grid grid-cols-2 h-full gap-4 p-4">
      {/* LEFT SIDE */}
      <div className="border rounded-lg p-4 bg-gray-50 overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Current Sections</h2>
        <CurrentSections sections={sections} setSections={setSections} />
      </div>

      {/* RIGHT SIDE */}
      <div className="border rounded-lg p-4 bg-gray-50 overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Add New Sections</h2>
        <SuggestedSections setSections={setSections} />

        <div className="mt-8">
          <h2 className="text-xl font-semibold">Color Picker</h2>
          <ColorPicker />
        </div>
      </div>
    </div>
  );
}
