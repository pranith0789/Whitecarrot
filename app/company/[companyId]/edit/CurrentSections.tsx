"use client";

import DragDropWrapper from "./DragDropWrapper";
import SectionCard from "./SectionCard";

export default function CurrentSections({ sections, setSections }: any) {
  return (
    <DragDropWrapper items={sections} setItems={setSections}>
      {(item: any) => (
        <SectionCard key={item.id} title={item.section_id} content={item.content} />
      )}
    </DragDropWrapper>
  );
}
