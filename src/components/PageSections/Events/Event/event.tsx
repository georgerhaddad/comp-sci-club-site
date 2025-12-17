import { IEvent } from "@/lib/types";
import { db, events, locations } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";

interface Props {
  id: string;
}

export default async function EventSection({ id }: Props) {
  const data = await db
  .select({
    id: events.id,
    title: events.title,
    description: events.description,
    image: events.image,
    dateStart: events.dateStart,
    dateEnd: events.dateEnd,
    onlineUrl: events.onlineUrl,
    onlinePlatform: events.onlinePlatform,
    isFeatured: events.isFeatured,
    location: {
      street: locations.street,
      city: locations.city,
      state: locations.state,
      zip: locations.zip,
      country: locations.country,
    },
  })
  .from(events)
  .leftJoin(locations, eq(events.id, locations.eventId))
  .where(eq(events.id, id))
  .limit(1);

const event = data[0]; // safely grab first row

if(!event) return <p>Event Not found</p>

  return (
    <>
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden transition-all duration-300">
        <Image
          src={event.image}
          alt=""
          fill
          className="object-cover"
        />
        <div className="from-background via-background/60 absolute inset-0 bg-gradient-to-t to-transparent" />
      </div>
      <div className="relative z-10 container mx-auto -mt-32 px-4 lg:px-0">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
          {event.title}
        </h1>
        <p>{event.description}</p>
      </div>
    </>
  );
}
