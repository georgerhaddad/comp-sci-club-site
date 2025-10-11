import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  title: string;
  description: string;
  date: Date;
  location: string;
  href: string;
}

const EventCard = ({ title, description, date, location, href }: Props) => {
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="flex h-72 w-sm flex-col pt-0">
      <div className="relative h-40">
        <Image
          className="rounded-t-lg object-cover"
          src={"/placeholder.jpg"}
          alt={"placeholder image"}
          fill
        />
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            <Clock className="text-muted-foreground h-3.5 w-3.5" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-0.5">
            <MapPin className="text-muted-foreground h-3.5 w-3.5" />
            {location}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p>{description}</p>
      </CardContent>
      <CardFooter>
        <Button
          className="group w-full bg-transparent"
          variant={"outline"}
          asChild
        >
          <Link href={`/${href}`}>
            Learn More
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
