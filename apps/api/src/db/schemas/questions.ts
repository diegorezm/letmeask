import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { roomsTable } from './room.ts';

export const questionsTable = pgTable('questions', {
  id: uuid().primaryKey().defaultRandom(),
  question: text().notNull(),
  answer: text(),
  roomId: uuid('room_id')
    .references(() => roomsTable.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
