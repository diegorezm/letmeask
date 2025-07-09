import { exit } from 'node:process';
import { reset, seed } from 'drizzle-seed';
import { db } from './connection.ts';
import { schema } from './schemas/index.ts';

await reset(db, schema);

await seed(db, schema).refine((f) => ({
  rooms: {
    count: 20,
    columns: {
      name: f.companyName(),
      description: f.loremIpsum(),
    },
  },
  audioChunks: {
    count: 0,
  },
  questions: {
    count: 20,
  },
}));

// biome-ignore lint/suspicious/noConsole: <no need for this rule>
console.log('Database seeded!');
exit(0);
