import { NavbarBackgroundControllerObserver } from "@/components/layout/navbar-background-controller-observer";
import Events from "@/components/PageSections/Home/events/events";
import Hero from "@/components/PageSections/Home/hero/hero";
import Projects from "@/components/PageSections/Home/projects/projects";

export default function Home() {
  return (
    <main>
      <Hero />
      <Events />
      <Projects />
      <NavbarBackgroundControllerObserver initialColor="bg-secondary" />
    </main>
  );
}
