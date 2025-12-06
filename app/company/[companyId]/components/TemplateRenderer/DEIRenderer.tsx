export default function DEIRenderer({ content, sectionId }: any) {
  const title = content?.title || "Diversity, Equity & Inclusion";
  const description = content?.description || "";
  const pillars = content?.pillars || [];

  return (
    <section id={sectionId} className="py-20 bg-white">
      <h2 className="text-4xl font-bold text-center">{title}</h2>
      <p className="max-w-3xl mx-auto text-center text-gray-600 mt-4 mb-10">
        {description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {pillars.map((p: any, i: number) => (
          <div
            key={i}
            className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-md"
          >
            <h3 className="text-xl font-bold text-blue-700">{p.title}</h3>
            <p className="mt-2 text-gray-600">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
