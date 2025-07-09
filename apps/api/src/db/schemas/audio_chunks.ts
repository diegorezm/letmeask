import { pgTable, text, timestamp, uuid, vector } from 'drizzle-orm/pg-core';
import { roomsTable } from './room.ts';

export const audioChunksTable = pgTable('audio_chunks', {
  id: uuid().primaryKey().defaultRandom(),
  transcription: text().notNull(),
  embeddings: vector({ dimensions: 1536 }).notNull(),
  roomId: uuid('room_id')
    .references(() => roomsTable.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
