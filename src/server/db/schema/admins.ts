import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const allowedAdmins = pgTable('allowed_admins', {
  id: serial('id').primaryKey(),
  githubId: text('github_id').notNull().unique(),
  githubUsername: text('github_username').notNull(),
  email: text('email'),
  isSuperAdmin: boolean('is_super_admin').default(false),
  addedAt: timestamp('added_at').defaultNow(),
  addedBy: text('added_by'),
});
