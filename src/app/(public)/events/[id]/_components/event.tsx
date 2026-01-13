import { events, images, locations } from "@/server/db/schema/events";
import { eq } from "drizzle-orm";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { getHeadings } from "@/lib/markdown/getHeadings";
import { markdownComponents } from "@/lib/markdown/markdownComponents";
import { db } from "@/server/db/schema";

interface Props {
  id: string;
}

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

  const headings = getHeadings(event.description);

  return (
    <>
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden transition-all duration-300">
        {event.image && (
          <Image src={event.image} alt="" fill className="object-cover" />
        )}
        <div className="from-background via-background/60 absolute inset-0 bg-gradient-to-t to-transparent" />
      </div>
      <div className="relative z-10 container mx-auto -mt-32 px-4 lg:px-0">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
          {event.title}
        </h1>
        <section className="container mx-auto grid grid-cols-1 gap-8 pt-6 lg:grid-cols-[250px_1fr]">
          {/* Sidebar */}
          <aside className="sticky top-24 hidden self-start lg:block">
            <nav className="space-y-2 text-sm">
              {headings.map((h) => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  className={`block hover:underline ml-${(h.depth - 1) * 4}`}
                >
                  {h.text}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <ReactMarkdown components={markdownComponents()}>
              {event.description}
            </ReactMarkdown>
          </article>
        </section>
      </div>
    </>
  );
}
