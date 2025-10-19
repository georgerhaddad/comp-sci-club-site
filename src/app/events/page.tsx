import { NavbarBackgroundControllerObserver } from "@/components/layout/navbar-background-controller-observer";

export default function Events() {
  return (
    <main className="min-h-svh">
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Upcoming Events
      </h1>

      <NavbarBackgroundControllerObserver initialColor="bg-background" />
    </main>
  );
}
