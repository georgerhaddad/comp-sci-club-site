import { NavbarBackgroundControllerObserver } from "@/components/layout/navbar-background-controller-observer";
import Events from "./_components/events";
import Hero from "./_components/hero";
import Projects from "./_components/projects";

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
