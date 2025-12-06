export default function WhyJoinRenderer({ content, sectionId }: any) {
  const points = content?.points || [];

  return (
    <section id={sectionId} className="py-20 bg-blue-50">
      <h2 className="text-4xl font-bold text-center mb-10">
        Why Join Us?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {points.map((p: any, i: number) => (
          <div
            key={i}
            className="bg-white p-8 rounded-xl shadow-md border border-gray-200"
          >
            <h3 className="text-xl font-bold text-blue-700">{p.title}</h3>
            <p className="mt-3 text-gray-600">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
