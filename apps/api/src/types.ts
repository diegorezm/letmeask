import type { InferSelectModel } from 'drizzle-orm';
import type { schema } from './db/schemas/index.ts';

export type Room = InferSelectModel<typeof schema.rooms>;
export type Question = InferSelectModel<typeof schema.questions>;
