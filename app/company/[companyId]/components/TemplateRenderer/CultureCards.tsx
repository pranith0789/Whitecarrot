// export default function CultureCardsRenderer({ content, sectionId }: any) {
//   if (!content?.items) return null;

//   const items = content.items;

//   return (
//     <section id={sectionId} className="w-full py-20">
//       <h2 className="text-4xl font-bold mb-10 text-center">Culture</h2>

//       {/* Slider Container */}
//       <div className="relative overflow-hidden h-[300px] w-full flex items-center">
        
//         {/* Auto-scrolling row */}
//         <div className="flex gap-6 animate-escalator-left whitespace-nowrap">
//           {[...items, ...items].map((item, index) => (
//             <div
//               key={index}
//               className="min-w-[280px] h-[300px] rounded-3xl shadow-3xl bg-cover bg-center relative flex items-end p-4 text-white"
//               style={{ backgroundImage: `url(${item.image})` }}
//             >
//               <div className="bg-black/50 backdrop-blur-sm p-3 rounded-lg">
//                 <h3 className="text-xl font-bold">{item.title}</h3>
//                 <p className="text-sm mt-1">{item.description}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// }

"use client";

import SectionWrapper from "@/app/components/SectionWrapper";

export default function CultureCardsRenderer({ content, sectionId }: any) {
  if (!content?.items) return null;

  const items = content.items;

  return (
    <SectionWrapper id={sectionId}>
      {/* Title */}
      <h2 className="text-4xl font-bold mb-10 text-center">Culture</h2>

      {/* Slider Container */}
      <div className="relative overflow-hidden h-[300px] w-full flex items-center">

        {/* Auto-scrolling row */}
        <div className="flex gap-6 animate-escalator-left whitespace-nowrap">
          {[...items, ...items].map((item: any, index: number) => (
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
