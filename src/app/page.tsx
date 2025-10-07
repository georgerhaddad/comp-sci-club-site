import Navbar from "@/components/navbar";
import Events from "@/components/sections/events/events";
import Hero from "@/components/sections/hero/hero";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="">
        <Hero />
        {/* <Events /> */}
      </main>
    </div>
  );
}
