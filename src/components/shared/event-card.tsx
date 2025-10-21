import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ILocation } from "@/lib/types";
import { getDay, getGoogleMapsLink, getMonthShort, getTime } from "@/lib/utils";
import { ArrowRight, Clock, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";

interface Props {
  title: string;
  description: string;
  dateStart: Date;
  dateEnd?: Date;
  location: ILocation;
  id: string;
  src: string;
  isFeatured?: boolean;
}

const EventCard = ({
  title,
  description,
  dateStart,
  dateEnd,
  location,
  id,
  src,
  isFeatured,
}: Props) => {
  return (
    <Card className="flex w-full flex-col pt-0 sm:w-2xs md:aspect-[8/9] md:w-xs xl:w-sm">
      <div className="relative aspect-[21/9] max-h-48">
        <Image
          className="z-0 rounded-t-lg object-cover"
          src={src}
          alt={"placeholder image"}
          fill
        />
        <div className="relative z-20 h-full w-full p-4">
          {isFeatured ? (
            <div className="bg-card text-card-foreground absolute flex h-fit items-center gap-1 rounded-sm p-1 px-2 text-xs font-bold">
              <Star fill="gold" size={14} />
              Featured Event
            </div>
          ) : (
            ""
          )}
          <div className="bg-card text-card-foreground absolute right-4 inline-grid aspect-square h-12 grid-rows-2 place-items-center rounded-sm py-2">
            <p className="text-center leading-none font-bold">
              {getDay(dateStart)}
            </p>
            <p className="text-center text-sm leading-none">
              {getMonthShort(dateStart)}
            </p>
          </div>
        </div>
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="flex flex-col gap-1">
          <div className="flex items-center gap-0.5">
            <Clock className="text-muted-foreground h-3.5 w-3.5" />
            {getTime(dateStart)}
            {dateEnd && ` – ${getTime(dateEnd)}`}
          </div>
          <div className="text-muted-foreground flex items-center gap-0.5">
            <Link
              className="hover:text-accent focus-within:text-accent active:text-accent flex items-center gap-0.5 hover:underline"
              href={getGoogleMapsLink(location)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin className="h-3.5 w-3.5" />
              {`${location.city}, ${location.state}`}
            </Link>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-3 text-ellipsis xl:line-clamp-4">
          {description}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          className="group w-full bg-transparent"
          variant={"outline"}
          asChild
        >
          <Link href={`/events/${id}`}>
            Learn More
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
