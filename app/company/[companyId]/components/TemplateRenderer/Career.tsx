export default function CareersSectionRenderer({ content, sectionId }: any) {
  if (!content) return null;

  return (
    <section id={sectionId} className="py-20 bg-gray-50 text-center">
      <h2 className="text-4xl font-bold">{content.intro}</h2>
    </section>
  );
}
