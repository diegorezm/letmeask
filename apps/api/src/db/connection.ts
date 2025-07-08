import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '../env.ts';
import { schema } from './schemas/index.ts';

export const db = drizzle(env.DATABASE_URL, {
  schema,
  casing: "snake_case"
});
