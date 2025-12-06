import SectionWrapper from "@/app/components/SectionWrapper";

export default function AboutLeftRenderer({ content, sectionId }: any) {
  if (!content) return null;

  return (
    <SectionWrapper id={sectionId} entrance="fade">
      <div className="w-full min-h-screen flex flex-col md:flex-row">

        {/* LEFT: Image */}
        <div className="w-full md:w-1/2 h-64 md:h-auto">
          <img
            src={content.image || "/AboutUS.png"}
            alt="About us"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT: Text */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-10">
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold text-gray-900">
              {content.title || "About Us"}
            </h2>

            {/* First Paragraph */}
            <p className="text-lg text-gray-600 mt-4 leading-relaxed">
              {content.description ||
                "We are a mission-driven company focused on building modern, scalable, and innovative digital solutions."}
            </p>

            {/* Second Paragraph (optional) */}
            {content.description2 && (
              <p className="text-lg text-gray-600 mt-4 leading-relaxed">
                {content.description2}
              </p>
            )}
          </div>
        </div>

      </div>
    </SectionWrapper>
  );
}
