import EventCard from "@/components/shared/event-card";
import { db, events, locations } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";

interface Props {
  limit?: number;
}
export default async function EventList({ limit }: Props) {
  const rows = await db
    .select({
      id: events.id,
      title: events.title,
      description: events.description,
      dateStart: events.dateStart,
      dateEnd: events.dateEnd,
      image: events.image,
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
    .orderBy(desc(events.dateStart))
    .limit(limit ?? 10);

  return (
    <>
      {rows.map((event) => (
        <EventCard
          key={event.id}
          id={event.id}
          title={event.title}
          description={event.description}
          dateStart={new Date(event.dateStart)}
          dateEnd={event.dateEnd ? new Date(event.dateEnd) : undefined}
          src={event.image}
          isFeatured={event.isFeatured ?? false}
          location={event.location ?? null}
        />
      ))}
    </>
  );
}
