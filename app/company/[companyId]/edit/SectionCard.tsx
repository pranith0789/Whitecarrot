export default function SectionCard({
  title,
  content,
}: {
  title: string;
  content: any;
}) {
  return (
    <div className="border p-3 rounded-lg bg-white shadow-sm mb-3 cursor-grab">
      <h3 className="text-lg font-semibold capitalize">{title}</h3>
      <p className="text-sm text-gray-500">
        {content?.text?.substring(0, 50) || "No content yet..."}
      </p>
    </div>
  );
}
