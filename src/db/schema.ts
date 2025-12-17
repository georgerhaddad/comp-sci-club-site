import { env } from '@/env';
import { drizzle } from 'drizzle-orm/neon-http';
import { boolean, date, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

const db = drizzle(env.DATABASE_URL);

export const events = pgTable("event", {
  id: uuid("id").primaryKey().notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(), // markdown
  dateStart: date("date_start").notNull(),
  dateEnd: date("date_end").notNull(),
  image: text("image").notNull(),
  onlineUrl: text("online_url"),
  onlinePlatform: text("online_platform"),
  isFeatured: boolean("is_featured"),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow()
})

export const locations = pgTable("location", {
  eventId: uuid("event_id")
    .primaryKey()
    .references(() => events.id, { onDelete: "cascade" }),

  street: text("street"),
  city: text("city"),
  state: varchar("state", { length: 3 }),
  zip: varchar("zip", { length: 10 }),
  country: text("country"),
});

export const timelines = pgTable("timeline", {
  id: uuid("id")
    .primaryKey()
    .defaultRandom(),

  eventId: uuid("event_id")
    .references(() => events.id, { onDelete: "cascade" }),

  title: text("title"),
  description: text("description"),
});

export const timelineMarkers = pgTable("timeline_marker", {
  id: uuid("id")
    .primaryKey()
    .defaultRandom(),

  timelineId: uuid("timeline_id")
    .references(() => timelines.id, { onDelete: "cascade" }),

  title: text("title"),
  description: text("description"),
  timestamp: timestamp("timestamp", { withTimezone: false }),
});