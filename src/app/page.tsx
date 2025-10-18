import { NavbarBackgroundController } from "@/components/layout/navbar-background-controller";
import Events from "@/components/sections/events/events";
import Hero from "@/components/sections/hero/hero";

export default function Home() {
  return (
    <main>
      <NavbarBackgroundController />
      <Hero />
      <Events />
    </main>
  );
}
