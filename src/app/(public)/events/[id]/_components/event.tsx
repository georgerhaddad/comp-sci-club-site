import { events, images, locations, timelines, timelineMarkers } from "@/server/db/schema/events";
import { eq } from "drizzle-orm";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { getHeadings } from "@/lib/markdown/getHeadings";
import { markdownComponents } from "@/lib/markdown/markdownComponents";
import { db } from "@/server/db/schema";
import { getFormattedDate, getTime, getGoogleMapsLink } from "@/lib/utils";
import Link from "next/link";
import { Calendar, Clock, MapPin, Video, Star, ExternalLink } from "lucide-react";

interface Props {
  id: string;
}

const depthIndentClass: Record<number, string> = {
  1: "ml-0",
  2: "ml-4",
  3: "ml-8",
  4: "ml-12",
  5: "ml-16",
  6: "ml-20",
};

export default async function EventSection({ id }: Props) {
  "use cache";
  const data = await db
    .select({
      id: events.id,
      title: events.title,
      description: events.description,
      image: images.url,
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
    .leftJoin(images, eq(events.imageId, images.id))
    .leftJoin(locations, eq(events.id, locations.eventId))
    .where(eq(events.id, id))
    .limit(1);

  const event = data[0];

  if (!event) return <p>Event Not found</p>;

  // Fetch timeline data for this event (one timeline per event)
  const [timelineRow] = await db
    .select({
      eventId: timelines.eventId,
      title: timelines.title,
      description: timelines.description,
    })
    .from(timelines)
    .where(eq(timelines.eventId, id))
    .limit(1);

  // Fetch markers if timeline exists
  let timeline: {
    title: string | null;
    description: string | null;
    markers: Array<{
      id: string;
      title: string;
      description: string | null;
      timestamp: Date | null;
    }>;
  } | null = null;

  if (timelineRow) {
    const markers = await db
      .select({
        id: timelineMarkers.id,
        title: timelineMarkers.title,
        description: timelineMarkers.description,
        timestamp: timelineMarkers.timestamp,
      })
      .from(timelineMarkers)
      .where(eq(timelineMarkers.eventId, id));

    timeline = {
      title: timelineRow.title,
      description: timelineRow.description,
      markers,
    };
  }

  const headings = getHeadings(event.description);
  const hasLocation = event.location && (event.location.city || event.location.street);
  const hasOnline = event.onlineUrl && event.onlinePlatform;

  return (
    <>
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden transition-all duration-300">
        {event.image && (
          <Image src={event.image} alt={event.title} fill className="object-cover" />
        )}
        <div className="from-background via-background/60 absolute inset-0 bg-gradient-to-t to-transparent" />
      </div>
      <div className="relative z-10 container mx-auto -mt-32 px-4 lg:px-0">
        {/* Header with title and featured badge */}
        <div className="flex flex-wrap items-start gap-3">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
            {event.title}
          </h1>
          {event.isFeatured && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-accent px-2.5 py-1 text-sm font-semibold text-accent-foreground my-auto">
              <Star className="h-4 w-4" fill="currentColor" />
              Featured Event
            </span>
          )}
        </div>

        {/* Event Details Card */}
        <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Date & Time */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Date & Time
              </h3>
              <div className="space-y-1">
                <p className="font-medium">{getFormattedDate(new Date(event.dateStart))}</p>
                <p className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {getTime(new Date(event.dateStart))}
                  {event.dateEnd && ` - ${getTime(new Date(event.dateEnd))}`}
                </p>
              </div>
            </div>

            {/* Location */}
            {hasLocation && (
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Location
                </h3>
                <div className="space-y-1">
                  {event.location?.street && (
                    <p className="font-medium">{event.location.street}</p>
                  )}
                  <p className="text-muted-foreground">
                    {[event.location?.city, event.location?.state].filter(Boolean).join(", ")}
                    {event.location?.zip && ` ${event.location.zip}`}
                  </p>
                  {event.location?.country && (
                    <p className="text-sm text-muted-foreground">{event.location.country}</p>
                  )}
                  <Link
                    href={getGoogleMapsLink(event.location!)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    View on Google Maps
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )}

            {/* Online Platform */}
            {hasOnline && (
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  <Video className="h-4 w-4" />
                  Online
                </h3>
                <div className="space-y-1">
                  <p className="font-medium">{event.onlinePlatform}</p>
                  <Link
                    href={event.onlineUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Join Online
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Signup placeholder area - for future functionality */}
          <div className="mt-6 border-t pt-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold">Interested in attending?</h3>
                <p className="text-sm text-muted-foreground">
                  Registration will be available soon.
                </p>
              </div>
              {/* Future signup button will go here */}
              <button
                disabled
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground opacity-50 cursor-not-allowed"
              >
                Sign Up Coming Soon
              </button>
            </div>
          </div>
        </div>

        <section className="container mx-auto grid grid-cols-1 gap-8 pt-8 lg:grid-cols-[250px_1fr]">
          {/* Sidebar */}
          <aside className="sticky top-24 hidden self-start lg:block">
            <nav className="space-y-2 text-sm">
              {headings.map((h) => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  className={`block hover:underline ${depthIndentClass[h.depth] ?? "ml-0"}`}
                >
                  {h.text}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="space-y-8">
            <article className="prose prose-neutral dark:prose-invert max-w-none">
              <ReactMarkdown components={markdownComponents()}>
                {event.description}
              </ReactMarkdown>
            </article>

            {/* Timeline Section */}
            {timeline && timeline.markers.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Event Schedule</h2>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  {timeline.title && (
                    <h3 className="text-lg font-semibold">{timeline.title}</h3>
                  )}
                  {timeline.description && (
                    <p className="mt-1 text-muted-foreground">{timeline.description}</p>
                  )}
                  <div className="mt-4 space-y-4">
                    {timeline.markers
                      .sort((a, b) => {
                        if (!a.timestamp || !b.timestamp) return 0;
                        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
                      })
                      .map((marker) => (
                        <div
                          key={marker.id}
                          className="relative flex gap-4 pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary"
                        >
                          {marker.timestamp && (
                            <div className="w-20 shrink-0 text-sm font-medium text-muted-foreground">
                              {getTime(new Date(marker.timestamp))}
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{marker.title}</p>
                            {marker.description && (
                              <p className="text-sm text-muted-foreground">{marker.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
