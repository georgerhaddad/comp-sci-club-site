"use server";

import { db } from "@/server/db/schema";
import { events, images, locations, timelines, timelineMarkers } from "@/server/db/schema/events";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/auth/helpers";
import { z } from "zod";

export type Event = typeof events.$inferSelect;
export type Location = typeof locations.$inferSelect;
export type Timeline = typeof timelines.$inferSelect;
export type TimelineMarker = typeof timelineMarkers.$inferSelect;

export interface EventWithRelations extends Event {
  image: typeof images.$inferSelect | null;
  location: Location | null;
  timelines: (Timeline & { markers: TimelineMarker[] })[];
}

export interface EventFormData {
  title: string;
  description: string;
  dateStart: Date;
  dateEnd: Date | null;
  imageId: string | null;
  onlineUrl: string | null;
  onlinePlatform: string | null;
  isFeatured: boolean;
  location: {
    street: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    country: string | null;
  } | null;
}

/**
 * Zod schema for validating event form data.
 * Used by createEvent and updateEvent to prevent malformed input.
 */
const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string(),
  dateStart: z.coerce.date(),
  dateEnd: z.coerce.date().nullable(),
  imageId: z.string().uuid().nullable(),
  onlineUrl: z.string().url().nullable().or(z.literal("")).or(z.literal(null)),
  onlinePlatform: z.string().nullable(),
  isFeatured: z.boolean(),
  location: z.object({
    street: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().max(3).nullable(),
    zip: z.string().max(10).nullable(),
    country: z.string().nullable(),
  }).nullable(),
});

/**
 * Fetches all events, ordered by date (newest first).
 *
 * NOTE: This action is intentionally unauthenticated - events are public
 * content displayed on the public-facing website.
 */
export async function getEvents(): Promise<EventWithRelations[]> {
  const eventsData = await db
    .select()
    .from(events)
    .leftJoin(images, eq(events.imageId, images.id))
    .leftJoin(locations, eq(events.id, locations.eventId))
    .orderBy(desc(events.dateStart));

  // Group by event and fetch timelines
  const eventMap = new Map<string, EventWithRelations>();

  for (const row of eventsData) {
    if (!eventMap.has(row.event.id)) {
      eventMap.set(row.event.id, {
        ...row.event,
        image: row.image,
        location: row.location,
        timelines: [],
      });
    }
  }

  // Fetch timelines and markers for all events
  const allTimelines = await db
    .select()
    .from(timelines)
    .leftJoin(timelineMarkers, eq(timelines.id, timelineMarkers.timelineId));

  const timelineMap = new Map<string, Timeline & { markers: TimelineMarker[] }>();

  for (const row of allTimelines) {
    if (!row.timeline.eventId) continue;

    if (!timelineMap.has(row.timeline.id)) {
      timelineMap.set(row.timeline.id, {
        ...row.timeline,
        markers: [],
      });
    }

    if (row.timeline_marker) {
      timelineMap.get(row.timeline.id)!.markers.push(row.timeline_marker);
    }
  }

  // Attach timelines to events
  for (const timeline of timelineMap.values()) {
    if (timeline.eventId && eventMap.has(timeline.eventId)) {
      eventMap.get(timeline.eventId)!.timelines.push(timeline);
    }
  }

  return Array.from(eventMap.values());
}

/**
 * Fetches a single event by ID with all relations.
 *
 * NOTE: This action is intentionally unauthenticated - events are public
 * content displayed on the public-facing website.
 */
export async function getEventById(id: string): Promise<EventWithRelations | null> {
  const [eventData] = await db
    .select()
    .from(events)
    .leftJoin(images, eq(events.imageId, images.id))
    .leftJoin(locations, eq(events.id, locations.eventId))
    .where(eq(events.id, id))
    .limit(1);

  if (!eventData) return null;

  // Fetch timelines and markers
  const timelinesData = await db
    .select()
    .from(timelines)
    .leftJoin(timelineMarkers, eq(timelines.id, timelineMarkers.timelineId))
    .where(eq(timelines.eventId, id));

  const timelineMap = new Map<string, Timeline & { markers: TimelineMarker[] }>();

  for (const row of timelinesData) {
    if (!timelineMap.has(row.timeline.id)) {
      timelineMap.set(row.timeline.id, {
        ...row.timeline,
        markers: [],
      });
    }

    if (row.timeline_marker) {
      timelineMap.get(row.timeline.id)!.markers.push(row.timeline_marker);
    }
  }

  return {
    ...eventData.event,
    image: eventData.image,
    location: eventData.location,
    timelines: Array.from(timelineMap.values()),
  };
}

/**
 * Creates a new event.
 * Requires admin authentication.
 */
export async function createEvent(data: EventFormData): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    await requireAdmin();

    // Validate input
    const parsed = eventFormSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }
    const validData = parsed.data;

    const id = crypto.randomUUID();

    // Use transaction to ensure event and location are created atomically
    await db.transaction(async (tx) => {
      await tx.insert(events).values({
        id,
        title: validData.title,
        description: validData.description,
        dateStart: validData.dateStart,
        dateEnd: validData.dateEnd,
        imageId: validData.imageId,
        onlineUrl: validData.onlineUrl || null,
        onlinePlatform: validData.onlinePlatform,
        isFeatured: validData.isFeatured,
      });

      // Create location if provided
      if (validData.location && (validData.location.street || validData.location.city)) {
        await tx.insert(locations).values({
          eventId: id,
          ...validData.location,
        });
      }
    });

    revalidatePath("/admin/events");
    revalidatePath("/events");

    return { success: true, id };
  } catch (error) {
    console.error("Failed to create event:", error);
    return { success: false, error: "Failed to create event" };
  }
}

/**
 * Updates an existing event.
 * Requires admin authentication.
 */
export async function updateEvent(id: string, data: EventFormData): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();

    // Validate input
    const parsed = eventFormSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }
    const validData = parsed.data;

    await db
      .update(events)
      .set({
        title: validData.title,
        description: validData.description,
        dateStart: validData.dateStart,
        dateEnd: validData.dateEnd,
        imageId: validData.imageId,
        onlineUrl: validData.onlineUrl || null,
        onlinePlatform: validData.onlinePlatform,
        isFeatured: validData.isFeatured,
      })
      .where(eq(events.id, id));

    // Update or create location
    if (validData.location && (validData.location.street || validData.location.city)) {
      const existingLocation = await db
        .select()
        .from(locations)
        .where(eq(locations.eventId, id))
        .limit(1);

      if (existingLocation.length > 0) {
        await db
          .update(locations)
          .set(validData.location)
          .where(eq(locations.eventId, id));
      } else {
        await db.insert(locations).values({
          eventId: id,
          ...validData.location,
        });
      }
    } else {
      // Remove location if cleared
      await db.delete(locations).where(eq(locations.eventId, id));
    }

    revalidatePath("/admin/events");
    revalidatePath("/events");
    revalidatePath(`/events/${id}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to update event:", error);
    return { success: false, error: "Failed to update event" };
  }
}

/**
 * Deletes an event.
 * Requires admin authentication.
 */
export async function deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    await db.delete(events).where(eq(events.id, id));

    revalidatePath("/admin/events");
    revalidatePath("/events");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete event:", error);
    return { success: false, error: "Failed to delete event" };
  }
}

