import { reset, seed } from "drizzle-seed"
import { db } from "./connection.ts"
import { schema } from "./schemas/index.ts"
import { exit } from "node:process"

await reset(db, schema)

await seed(db, schema).refine(f => ({
  rooms: {
    count: 20,
    columns: {
      name: f.companyName(),
      description: f.loremIpsum()
    }
  }
}))

console.log("Database seeded!")
exit(0)
