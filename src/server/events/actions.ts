"use server";

import { db } from "@/server/db/schema";
import { events, images, locations, timelines, timelineMarkers } from "@/server/db/schema/events";
import { eq, desc, inArray } from "drizzle-orm";
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
  timeline: (Timeline & { markers: TimelineMarker[] }) | null;
}

export interface TimelineMarkerFormData {
  id?: string;
  title: string;
  description: string;
  timestamp: Date | null;
}

export interface TimelineFormData {
  title: string;
  description: string;
  markers: TimelineMarkerFormData[];
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
  timeline: TimelineFormData | null;
}

const timelineMarkerSchema = z.object({
  id: z.uuid().optional(),
  title: z.string().min(1, "Marker title is required"),
  description: z.string(),
  timestamp: z.coerce.date().nullable(),
});

const timelineSchema = z.object({
  title: z.string(),
  description: z.string(),
  markers: z.array(timelineMarkerSchema).min(1, "Timeline must have at least one marker"),
});

/**
 * Zod schema for validating event form data.
 * Used by createEvent and updateEvent to prevent malformed input.
 */
const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string(),
  dateStart: z.coerce.date(),
  dateEnd: z.coerce.date().nullable(),
  imageId: z.uuid().nullable(),
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
  timeline: timelineSchema.nullable(),
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
    .leftJoin(timelines, eq(events.id, timelines.eventId))
    .orderBy(desc(events.dateStart));

  // Build event map
  const eventMap = new Map<string, EventWithRelations>();

  for (const row of eventsData) {
    if (!eventMap.has(row.event.id)) {
      eventMap.set(row.event.id, {
        ...row.event,
        image: row.image,
        location: row.location,
        timeline: row.timeline ? { ...row.timeline, markers: [] } : null,
      });
    }
  }

  // Fetch markers for all events that have timelines
  const eventIds = Array.from(eventMap.keys());
  if (eventIds.length > 0) {
    const markers = await db
      .select()
      .from(timelineMarkers)
      .where(inArray(timelineMarkers.eventId, eventIds));

    for (const marker of markers) {
      if (marker.eventId) {
        const event = eventMap.get(marker.eventId);
        if (event?.timeline) {
          event.timeline.markers.push(marker);
        }
      }
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
  const idParse = z.uuid().safeParse(id);
  if (!idParse.success) return null;
  const [eventData] = await db
    .select()
    .from(events)
    .leftJoin(images, eq(events.imageId, images.id))
    .leftJoin(locations, eq(events.id, locations.eventId))
    .leftJoin(timelines, eq(events.id, timelines.eventId))
    .where(eq(events.id, id))
    .limit(1);

  if (!eventData) return null;

  // Fetch markers if timeline exists
  let markers: TimelineMarker[] = [];
  if (eventData.timeline) {
    markers = await db
      .select()
      .from(timelineMarkers)
      .where(eq(timelineMarkers.eventId, id));
  }

  return {
    ...eventData.event,
    image: eventData.image,
    location: eventData.location,
    timeline: eventData.timeline ? { ...eventData.timeline, markers } : null,
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

    await db.insert(events).values({
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
      await db.insert(locations).values({
        eventId: id,
        ...validData.location,
      });
    }

    // Create timeline and markers if provided
    if (validData.timeline) {
      await db.insert(timelines).values({
        eventId: id,
        title: validData.timeline.title,
        description: validData.timeline.description,
      });

      for (const marker of validData.timeline.markers) {
        await db.insert(timelineMarkers).values({
          id: crypto.randomUUID(),
          eventId: id,
          title: marker.title,
          description: marker.description,
          timestamp: marker.timestamp,
        });
      }
    }

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

    // Update timeline and markers
    const [existingTimeline] = await db
      .select()
      .from(timelines)
      .where(eq(timelines.eventId, id))
      .limit(1);

    if (!validData.timeline) {
      // Remove timeline if cleared (cascade deletes markers)
      if (existingTimeline) {
        await db.delete(timelineMarkers).where(eq(timelineMarkers.eventId, id));
        await db.delete(timelines).where(eq(timelines.eventId, id));
      }
    } else {
      // Create or update timeline
      if (existingTimeline) {
        await db
          .update(timelines)
          .set({
            title: validData.timeline.title,
            description: validData.timeline.description,
          })
          .where(eq(timelines.eventId, id));
      } else {
        await db.insert(timelines).values({
          eventId: id,
          title: validData.timeline.title,
          description: validData.timeline.description,
        });
      }

      // Handle markers
      const existingMarkers = await db
        .select({ id: timelineMarkers.id })
        .from(timelineMarkers)
        .where(eq(timelineMarkers.eventId, id));

      const existingMarkerIds = existingMarkers.map((m) => m.id);
      const submittedMarkerIds = validData.timeline.markers
        .filter((m) => m.id)
        .map((m) => m.id as string);

      // Delete removed markers
      const markersToDelete = existingMarkerIds.filter(
        (mid) => !submittedMarkerIds.includes(mid)
      );
      if (markersToDelete.length > 0) {
        await db
          .delete(timelineMarkers)
          .where(inArray(timelineMarkers.id, markersToDelete));
      }

      // Update or create markers
      for (const marker of validData.timeline.markers) {
        if (marker.id && existingMarkerIds.includes(marker.id)) {
          await db
            .update(timelineMarkers)
            .set({
              title: marker.title,
              description: marker.description,
              timestamp: marker.timestamp,
            })
            .where(eq(timelineMarkers.id, marker.id));
        } else {
          await db.insert(timelineMarkers).values({
            id: crypto.randomUUID(),
            eventId: id,
            title: marker.title,
            description: marker.description,
            timestamp: marker.timestamp,
          });
        }
      }
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

    const idParse = z.uuid().safeParse(id);
    if (!idParse.success) {
      return { success: false, error: "Invalid event id" };
    }

    const deleted = await db
      .delete(events)
      .where(eq(events.id, id))
      .returning({ id: events.id });

    if (deleted.length === 0) {
      return { success: false, error: "Event not found" };
    }

    revalidatePath("/admin/events");
    revalidatePath("/events");
    revalidatePath(`/events/${id}`)

    return { success: true };
  } catch (error) {
    console.error("Failed to delete event:", error);
    return { success: false, error: "Failed to delete event" };
  }
}

