import { NavbarBackgroundControllerObserver } from "@/components/layout/navbar-background-controller-observer";
import Events from "@/app/_components/events";
import Hero from "@/app/_components/hero";
import Projects from "@/app/_components/projects";

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
