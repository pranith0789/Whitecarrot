import SectionCarousel from "./SectionCarousel";

export default function WelcomeCard() {
  return (
    <div className="bg-[#FAF7EF] p-10 rounded-xl max-w-4xl w-full shadow-2xl flex gap-8">
      <div className="w-1/2 rounded-lg overflow-hidden">
        {/* <img
          src="Backgroundimage.png"
          className="w-full h-full object-cover"
          alt="section"
        /> */}
      </div>

      <div className="w-1/2">
        <SectionCarousel />
      </div>
    </div>
  );
}
