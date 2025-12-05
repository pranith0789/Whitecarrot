import SectionWrapper from "@/app/components/SectionWrapper";

export default function Culture({sectionId}:{sectionId:string}) {
  const items = [
    {
      title: "Core Values",
      description: "Our culture is built on integrity, innovation and ownership.",
      image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe",
    },
    {
      title: "Work Environment",
      description: "A collaborative space where creativity and teamwork thrive.",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    },
    {
      title: "Team Activities",
      description: "We grow together through events, hackathons and celebrations.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
    },
    {
      title: "Diversity & Inclusion",
      description: "We value diverse perspectives and empower every voice.",
      image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70",
    },
    {
      title: "Culture Overview",
      description: "We champion ownership, creativity, and continuous learning.",
      image: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51",
    },
  ];

  return (
    <SectionWrapper id="culture"  entrance="slide-up">
    <h2 className="text-4xl font-bold mb-10 text-center">Culture</h2>

      {/* Slider Container */}
      <div className="relative overflow-hidden h-[280px] w-full flex items-center mt-45">

        <div className="flex gap-6 animate-escalator-left whitespace-nowrap">
          {[...items, ...items].map((item, index) => (
            <div
              key={index}
              className="min-w-[280px] h-[300px] rounded-3xl shadow-3xl bg-cover bg-center relative flex items-end p-4 text-white"
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className="bg-black/50 backdrop-blur-sm p-3 rounded-lg">
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-sm mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </SectionWrapper>
  );
}
