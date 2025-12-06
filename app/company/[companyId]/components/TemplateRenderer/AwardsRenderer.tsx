export default function AwardsRenderer({ content, sectionId }: any) {
  const awards = content?.awards || [];

  return (
    <section id={sectionId} className="py-20 bg-white">
      <h2 className="text-4xl font-bold text-center mb-10">Awards & Recognition</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {awards.map((award: any, i: number) => (
          <div
            key={i}
            className="bg-gray-50 border border-gray-200 rounded-xl shadow-md p-6 flex flex-col items-center"
          >
            {award.image && (
              <img
                src={award.image}
                alt={award.title}
                className="w-32 h-32 object-contain mb-4"
              />
            )}
            <h3 className="text-xl font-semibold text-gray-800 text-center">
              {award.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
