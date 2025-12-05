import SectionWrapper from '@/app/components/SectionWrapper'

export default function AboutUs({ sectionId }: { sectionId: string }) {
  return (
    <SectionWrapper id={sectionId} entrance="fade">
      
      <div className="w-full min-h-screen flex flex-col md:flex-row">

        {/* Left Side - Image */}
        <div className="w-full md:w-1/2 h-64 md:h-auto">
          <img
            src="/AboutUS.png"
            alt="About us"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side - Content */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-10">
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold text-gray-900">About Us</h2>

            <p className="text-lg text-gray-600 mt-4 leading-relaxed">
              We are a mission-driven company focused on building modern, scalable,
              and innovative digital solutions. Our team thrives on creativity,
              collaboration, and delivering world-class user experiences.
            </p>

            <p className="text-lg text-gray-600 mt-4 leading-relaxed">
              With a strong vision for the future, we continuously push boundaries
              to create technology that empowers businesses and transforms industries.
            </p>
          </div>
        </div>

      </div>

    </SectionWrapper>
  );
}
