import { boolean, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';



export const events = pgTable("event", {
  id: uuid("id").primaryKey().notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(), // markdown
  dateStart: timestamp("date_start", { withTimezone: true }).notNull(),
  dateEnd: timestamp("date_end", { withTimezone: true }),
  imageId: uuid("image_id").references(() => images.id),
  onlineUrl: text("online_url"),
  onlinePlatform: text("online_platform"),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow()
})

export const images = pgTable("image", {
  id: uuid("id").primaryKey().defaultRandom(),
  uploadthingKey: text("uploadthing_key").notNull().unique(),
  url: text("url").notNull(),
  hash: text("hash").notNull().unique(),
  isDraft: boolean("is_draft").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

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
  eventId: uuid("event_id")
    .primaryKey()
    .references(() => events.id, { onDelete: "cascade" }),

  title: text("title"),
  description: text("description"),
});

export const timelineMarkers = pgTable("timeline_marker", {
  id: uuid("id")
    .primaryKey()
    .defaultRandom(),

  eventId: uuid("event_id")
    .references(() => events.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  description: text("description"),
  timestamp: timestamp("timestamp", { withTimezone: false }),
});