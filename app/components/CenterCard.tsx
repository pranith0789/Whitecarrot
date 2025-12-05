import CarouselContainer from "./CarouselContainer";

export default function CenterCard() {
  return (
    <div className="relative">
      <div
        className="
          absolute inset-0
          rounded-3xl
        "
      ></div>

      <div
        className="
          relative
          w-full
          h-[500px]
          rounded-3xl
          shadow-2xl
          overflow-hidden
        "
      >
        <CarouselContainer />
      </div>
    </div>
  );
}


