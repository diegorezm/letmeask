import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const roomsTable = pgTable("rooms", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  description: text(),
  createdAt: timestamp("created_at").defaultNow().notNull()
})
