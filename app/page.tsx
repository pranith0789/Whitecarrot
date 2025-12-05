import CenterCard from './components/CenterCard'

export default function Home() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: "url('BackgroundImage(2).png')" }}
    >
      <div className="rounded-2xl shadow-xl w-full max-w-4xl h-full p-10">
        <CenterCard/>
      </div>
    </div>
  );
}
