import {
  pgTable,
  text,
  integer,
  serial,
  timestamp,
  jsonb,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkUserId: text('clerk_user_id').notNull().unique(),
  displayName: text('display_name').notNull(),
  emoji: text('emoji').notNull().default('♛'),
  chips: integer('chips').notNull().default(1500),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tables = pgTable('tables', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  inviteCode: text('invite_code').notNull().unique(),
  maxSeats: integer('max_seats').notNull().default(9),
  seats: jsonb('seats').$type<unknown[]>().notNull().default([]),
  pot: integer('pot').notNull().default(0),
  phase: text('phase').notNull().default('Waiting for players'),
  status: text('status').notNull().default('waiting'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type UserRow = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
export type TableRow = typeof tables.$inferSelect;
export type TableInsert = typeof tables.$inferInsert;
