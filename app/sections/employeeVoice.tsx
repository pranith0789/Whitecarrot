import SectionWrapper from '@/app/components/SectionWrapper'
export default function EmployeeVoice({sectionId}:{sectionId:string}) {
const stories = [
  {
    text: "This company gives me the freedom to innovate and grow every day. I’m encouraged to experiment with new ideas and take ownership of my work. It truly feels like a place where my contributions matter.",
    name: "— Employee A",
  },
  {
    text: "The leadership here genuinely values creativity and ownership. Every voice is heard, and decisions are made with transparency. I feel empowered to make an impact from day one.",
    name: "— Employee B",
  },
  {
    text: "I feel supported, challenged, and inspired to do my best work. The team pushes me to grow while always being there to help. It’s the perfect blend of structure and freedom.",
    name: "— Employee C",
  },
  {
    text: "A fantastic culture where every voice matters, regardless of role or experience. Collaboration is natural, and feedback is always constructive. It’s an environment that motivates you daily.",
    name: "— Employee D",
  },
  {
    text: "The team environment is collaborative, fun, and motivating. We celebrate wins together and learn from challenges as one unit. It feels like being part of a family with a shared vision.",
    name: "— Employee E",
  },
];


  return (
   <SectionWrapper id="employeevoice" entrance="slide-left">
      <h2 className="text-4xl font-bold mb-8 text-center">Employee Stories</h2>

      <div className="relative w-full overflow-hidden py-6 mt-45">
        <div className="flex gap-6 animate-marquee-ltr">
          {[...stories, ...stories].map((story, index) => (
            <div
              key={index}
              className="min-w-[350px] h-[250px] bg-gray-100 shadow-lg rounded-xl px-6 py-4 text-gray-700 border border-gray-200 flex items-center justify-center flex-col"
            >
              <p className="text-md italic">“{story.text}”</p>
              <p className="mt-2 text-right font-semibold">{story.name}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
