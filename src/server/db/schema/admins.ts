import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const allowedAdmins = pgTable('allowed_admins', {
  id: serial('id').primaryKey(),
  githubId: varchar('github_id', { length: 255 }).notNull().unique(),
  githubUsername: varchar('github_username', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  addedAt: timestamp('added_at').defaultNow(),
  addedBy: varchar('added_by', { length: 255 }),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  githubId: varchar('github_id', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});