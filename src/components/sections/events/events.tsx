import EventCard from "@/components/shared/event-card";
import { EventCardSkeleton } from "@/components/shared/event-card-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";

const fakeEvents = [
  {
    title: "Tech Conference 2025",
    description:
      "Join us for an exciting tech conference featuring talks, workshops, and networking with industry leaders.",
    dateStart: new Date("2025-11-20T09:00:00"),
    dateEnd: new Date("2025-11-20T17:00:00"),
    location: {
      street: "500 Innovation Drive",
      city: "San Francisco",
      state: "CA",
      zip: 94107,
      country: "USA",
    },
    href: "evt_1a2b3c4d",
    src: "/placeholder.jpg",
  },
  {
    title: "Art & Design Expo",
    description:
      "Explore the latest trends in art and design, meet artists, and participate in hands-on workshops.",
    dateStart: new Date("2025-12-05T10:00:00"),
    location: {
      street: "1200 Creativity Blvd",
      city: "Los Angeles",
      state: "CA",
      zip: 90015,
      country: "USA",
    },
    href: "evt_5e6f7g8h",
    src: "/placeholder.jpg",
  },
  // {
  //   title: "Community Coding Meetup",
  //   description:
  //     "A casual meetup for developers to share knowledge, collaborate on projects, and have fun coding together.",
  //   dateStart: new Date("2025-11-25T18:30:00"),
  //   dateEnd: new Date("2025-11-25T21:00:00"),
  //   location: {
  //     street: "42 Code Street",
  //     city: "Mountain View",
  //     state: "CA",
  //     zip: 94043,
  //     country: "USA",
  //   },
  //   href: "evt_9i0j1k2l",
  //   src: "/placeholder.jpg",
  // },
];

const Events = () => {
  const sortedEvents = [...fakeEvents].sort(
    (a, b) => a.dateStart.getTime() - b.dateStart.getTime(),
  );
  return (
    <section className="container mx-auto h-screen px-4 lg:px-0">
      <h2 id="events" className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight">
        Upcoming Events
      </h2>
      <section className="grid grid-cols-1 flex-wrap justify-center gap-4 sm:flex md:grid-cols-2 lg:grid-cols-3">
        <Suspense
          fallback={
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </>
          }
        >
          {sortedEvents.map((event) => (
            <EventCard
              key={event.href}
              title={event.title}
              description={event.description}
              dateStart={event.dateStart}
              dateEnd={event.dateEnd}
              location={event.location}
              href={event.href}
              src={event.src}
            />
          ))}
          <Card className="border-muted-foreground/30 bg-muted/30 hover:border-primary/50 hover:bg-muted/50 flex w-full flex-col overflow-hidden border-2 border-dashed transition-colors sm:w-2xs md:aspect-[8/9] md:w-xs xl:w-sm">
            <CardContent className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
              <div className="bg-primary/10 rounded-full p-6">
                <Calendar className="text-primary h-12 w-12" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-balance">
                  More Events Available
                </h3>
                <p className="text-muted-foreground text-sm text-pretty">
                  Discover all upcoming events and find the perfect one for you
                </p>
              </div>
              <Button asChild size="lg" className="gap-2">
                <Link href="/events">
                  View All Events
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </Suspense>
      </section>
    </section>
  );
};

export default Events;
