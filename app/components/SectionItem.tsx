interface SectionItemProps{
    title:string,
    text:string,
    button:string,
    color:string
}

export default function SectionItem({ title, text, button, color }:SectionItemProps) {
  return (
    <div className={`${color} p-8 text-white rounded-lg`}>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-lg leading-relaxed mb-4">{text}</p>
      {/* <button className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-gray-100">
        {button}
      </button> */}
    </div>
  );
}
