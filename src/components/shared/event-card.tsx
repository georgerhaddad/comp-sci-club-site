import { Button } from "@/components/ui/button";
import {
  Card,
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
interface Props {
  id: string;
  title: string;
  dateStart: Date;
  dateEnd?: Date;
  src: string;
  isFeatured?: boolean;
  onlineUrl: string | null;
  onlinePlatform: string | null;
  location?: ILocation | null;
}

const EventCard = ({ ...Props }) => {
  return (
    <Card className="flex w-full flex-col pt-0 sm:w-2xs md:aspect-[1] md:w-xs xl:aspect-auto xl:w-sm 2xl:w-md">
      <div className="relative aspect-[21/9] max-h-48">
        <Image
          className="z-0 rounded-t-lg object-cover"
          src={Props.src}
          alt={"placeholder image"}
          fill
        />
        <div className="relative z-20 h-full w-full p-4">
          {Props.isFeatured ? (
            <div className="bg-card text-card-foreground absolute flex h-fit items-center gap-1 rounded-sm p-1 px-2 text-xs font-bold">
              <Star color="gold" fill="gold" size={14} />
              Featured Event
            </div>
          ) : (
            ""
          )}
          <div className="bg-card text-card-foreground absolute right-4 inline-grid aspect-square h-12 grid-rows-2 place-items-center rounded-sm py-2">
            <p className="text-center leading-none font-bold">
              {getDay(Props.dateStart)}
            </p>
            <p className="text-center text-sm leading-none">
              {getMonthShort(Props.dateStart)}
            </p>
          </div>
        </div>
      </div>
      <div className="flex-grow">
        <CardHeader>
          <CardTitle className="line-clamp-2 text-ellipsis">
            {Props.title}
          </CardTitle>
          <CardDescription className="flex flex-col gap-1">
            <div className="flex h-3.5 items-center gap-0.5">
              <Clock className="text-muted-foreground h-3.5 w-3.5" />
              {getTime(Props.dateStart)}
              {Props.dateEnd && ` – ${getTime(Props.dateEnd)}`}
            </div>
            <div className="text-muted-foreground flex h-3.5 items-center gap-0.5">
              {(Props.location || Props.onlinePlatform) && (
                <MapPin className="h-3.5 w-3.5" />
              )}
              {Props.location && (
                <Link
                  className="hover:text-accent focus-within:text-accent active:text-accent flex items-center gap-0.5 hover:underline"
                  href={getGoogleMapsLink(Props.location)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`${Props.location?.city}, ${Props.location?.state}`}
                </Link>
              )}
              {Props.location && Props.onlinePlatform && " & "}
              {Props.onlinePlatform && (
                <Link
                  className="hover:text-accent focus-within:text-accent active:text-accent flex items-center gap-0.5 hover:underline"
                  href={Props.onlineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {Props.onlinePlatform}
                </Link>
              )}
            </div>
          </CardDescription>
        </CardHeader>
      </div>

      <CardFooter>
        <Button
          className="group w-full bg-transparent"
          variant={"outline"}
          asChild
        >
          <Link href={`/events/${Props.id}`}>
            Learn More
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
