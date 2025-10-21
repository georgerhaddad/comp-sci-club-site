import EventCard from '@/components/shared/event-card';
import { parseEvents, sortEvents } from '@/lib/utils';

interface Props {
  limit?: number
}
export default async function EventList({limit}: Props) {
  const res = await fetch(`http://localhost:3000/api/events?limit=${limit}`, { cache: "no-store" });
  const events = await res.json();

  const parsedEvents = parseEvents(events);

  return (
    <>
      {parsedEvents.map((event) => (
        <EventCard key={event.id} {...event} />
      ))}
    </>
  );
}