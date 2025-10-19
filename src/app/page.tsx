import { NavbarBackgroundControllerObserver } from "@/components/layout/navbar-background-controller-observer";
import Events from "@/components/sections/events/events";
import Hero from "@/components/sections/hero/hero";
import Projects from "@/components/sections/projects/projects";

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
