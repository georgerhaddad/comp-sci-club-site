import EventCard from "@/components/shared/event-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";

const Events = () => {
  return (
    <section className="container mx-auto h-screen">
      <h1>Upcoming Events</h1>
      {/* <Card className="w-sm">
        <CardHeader>
          <div className="relative aspect-[3/2]">
            <Image
              className="object-cover rounded-lg"
              src={"/placeholder.jpg"}
              alt={"placeholder image"}
              fill
            />
          </div>
          <CardTitle>Event</CardTitle>
          <CardDescription>bungus</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="group bg-transparent w-full" variant={"outline"}>
            Learn More
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card> */}

      <EventCard
        title={"Event Title"}
        description={"bungus"}
        date={new Date()}
        location={"somewhere"}
        href={"swag"}
      />
    </section>
  );
};

export default Events;
