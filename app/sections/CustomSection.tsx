export default function CustomSection({ sectionId, content }: any) {
  return (
    <section id={sectionId} className="py-20 px-6 bg-gray-50">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">
          {content?.title || "Custom Section"}
        </h2>

        <p className="text-gray-600 text-lg whitespace-pre-line">
          {content?.body || "You can edit this section in the editor."}
        </p>
      </div>
    </section>
  );
}
