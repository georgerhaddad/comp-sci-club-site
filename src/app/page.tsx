import { NavbarBackgroundControllerObserver } from "@/components/layout/navbar-background-controller-observer";
import Events from "@/components/PageSections/Home/events/events";
import Hero from "@/components/PageSections/Home/hero/hero";
import Projects from "@/components/PageSections/Home/projects/projects";
import { getFormattedDate } from "@/lib/utils";

export default function Home() {
  return (
    <main>
      <p className="text-xl text-white">{getFormattedDate(new Date)}</p>

      <Hero />
      <Events />
      <Projects />
      <NavbarBackgroundControllerObserver initialColor="bg-secondary" />
    </main>
  );
}
