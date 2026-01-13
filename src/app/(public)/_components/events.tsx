import { EventCardSkeleton } from "@/components/shared/event-card-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import EventList from "../events/_components/events-list";

const Events = () => {
  return (
    <section className="container mx-auto h-screen px-4 lg:px-0">
      <h2
        id="events"
        className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight"
      >
        Upcoming Events
      </h2>
      <section className="grid grid-cols-1 flex-wrap justify-center gap-4 sm:flex md:grid-cols-2 lg:grid-cols-3">
        <Suspense
          fallback={
            <>
              {Array.from({ length: 2 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </>
          }
        >
          <EventList limit={2} />
        </Suspense>
        <Card className="border-muted-foreground/30 bg-muted/30 hover:border-primary/50 hover:bg-muted/50 flex w-full flex-col overflow-hidden border-2 border-dashed py-0 transition-colors sm:w-2xs md:aspect-[1] md:w-xs xl:w-sm">
          <CardContent className="flex aspect-[1] flex-1 flex-col items-center justify-center gap-6 text-center">
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
      </section>
    </section>
  );
};

export default Events;
