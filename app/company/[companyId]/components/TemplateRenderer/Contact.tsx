// export default function ContactSectionRenderer({ content, sectionId }: any) {
//   if (!content) return null;

//   return (
//     <section id={sectionId} className="w-full py-20 bg-white">
//       {/* Title */}
//       <h2 className="text-4xl font-bold text-gray-900 text-center">
//         {content.heading}
//       </h2>

//       <p className="text-lg text-gray-600 text-center mt-3 max-w-2xl mx-auto">
//         {content.subtext}
//       </p>

//       {/* Contact Grid */}
//       <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">

//         {/* Email Card */}
//         <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-md p-6 text-center">
//           <div className="text-blue-600 text-4xl mb-4">📧</div>
//           <h3 className="text-xl font-semibold text-gray-800">Email Us</h3>
//           <p className="text-gray-600 mt-2">{content.email}</p>
//           <p className="text-sm text-gray-500 mt-1">{content.email_note}</p>
//         </div>

//         {/* Phone Card */}
//         <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-md p-6 text-center">
//           <div className="text-green-600 text-4xl mb-4">📞</div>
//           <h3 className="text-xl font-semibold text-gray-800">Call Us</h3>
//           <p className="text-gray-600 mt-2">{content.phone}</p>
//           <p className="text-sm text-gray-500 mt-1">{content.phone_note}</p>
//         </div>

//         {/* Location Card */}
//         <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-md p-6 text-center">
//           <div className="text-red-600 text-4xl mb-4">📍</div>
//           <h3 className="text-xl font-semibold text-gray-800">Visit Us</h3>
//           <p className="text-gray-600 mt-2">{content.address}</p>
//           <p className="text-sm text-gray-500 mt-1">{content.address_note}</p>
//         </div>
//       </div>

//       {/* CTA Section */}
//       <div className="mt-8 bg-blue-600 text-white px-10 py-8 rounded-2xl shadow-lg text-center max-w-3xl mx-auto">
//         <h3 className="text-2xl font-bold">{content.cta_title}</h3>
//         <p className="mt-2 text-blue-100">{content.cta_subtext}</p>
//         <button className="mt-5 px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-blue-50 transition">
//           {content.cta_button_text}
//         </button>
//       </div>

//       {/* Footer Note */}
//       <p className="text-sm text-gray-500 mt-6 text-center">
//         {content.footer_note}
//       </p>
//     </section>
//   );
// }

"use client";

import SectionWrapper from "@/app/components/SectionWrapper";

export default function ContactSectionRenderer({ content, sectionId }: any) {
  if (!content) return null;

  return (
    <SectionWrapper id={sectionId}>
      {/* Title */}
      <h2 className="text-4xl font-bold text-gray-900 text-center">
        {content.heading}
      </h2>

      <p className="text-lg text-gray-600 text-center mt-3 max-w-2xl mx-auto">
        {content.subtext}
      </p>

      {/* Contact Grid */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">

        {/* Email Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-md p-6 text-center">
          <div className="text-blue-600 text-4xl mb-4">📧</div>
          <h3 className="text-xl font-semibold text-gray-800">Email Us</h3>
          <p className="text-gray-600 mt-2">{content.email}</p>
          <p className="text-sm text-gray-500 mt-1">{content.email_note}</p>
        </div>

        {/* Phone Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-md p-6 text-center">
          <div className="text-green-600 text-4xl mb-4">📞</div>
          <h3 className="text-xl font-semibold text-gray-800">Call Us</h3>
          <p className="text-gray-600 mt-2">{content.phone}</p>
          <p className="text-sm text-gray-500 mt-1">{content.phone_note}</p>
        </div>

        {/* Location Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-md p-6 text-center">
          <div className="text-red-600 text-4xl mb-4">📍</div>
          <h3 className="text-xl font-semibold text-gray-800">Visit Us</h3>
          <p className="text-gray-600 mt-2">{content.address}</p>
          <p className="text-sm text-gray-500 mt-1">{content.address_note}</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-8 bg-blue-600 text-white px-10 py-8 rounded-2xl shadow-lg text-center max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold">{content.cta_title}</h3>
        <p className="mt-2 text-blue-100">{content.cta_subtext}</p>
        <button className="mt-5 px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-blue-50 transition">
          {content.cta_button_text}
        </button>
      </div>

      {/* Footer Note */}
      <p className="text-sm text-gray-500 mt-6 text-center">
        {content.footer_note}
      </p>
    </SectionWrapper>
  );
}
