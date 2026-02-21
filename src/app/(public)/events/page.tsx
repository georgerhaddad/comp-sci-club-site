import { NavbarBackgroundControllerObserver } from "@/components/layout/navbar-background-controller-observer";
import EventList from "./_components/events-list";
import { EventCardSkeleton } from "@/components/shared/event-card-skeleton";
import { Suspense } from "react";

export default function EventsPage() {
  return (
    <main className="min-h-svh px-4">
      <section className="container mx-auto h-screen lg:px-0">
        <h2
          id="events"
          className="pt-4 pb-2 text-3xl font-semibold tracking-tight"
        >
          Upcoming Events
        </h2>
        <section className="grid grid-cols-1 flex-wrap justify-center gap-4 sm:flex">
          <Suspense
            fallback={
              <>
                {Array.from({ length: 9 }).map((_, i) => (
                  <EventCardSkeleton key={i} />
                ))}
              </>
            }
          >
            <EventList />
          </Suspense>
        </section>
      </section>
      <NavbarBackgroundControllerObserver initialColor="bg-background" />
    </main>
  );
}
