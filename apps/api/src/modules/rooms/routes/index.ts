import { db } from '../../../db/connection.ts';
import { schema } from '../../../db/schemas/index.ts';
import { publicProcedure, router } from '../../../trpc.ts';

export const roomsRouter = router({
  findAll: publicProcedure.query(async () => {
    const rooms = await db.query.rooms.findMany({
      columns: {
        id: true,
        name: true,
      },
      orderBy: schema.rooms.createdAt,
    });
    return rooms;
  }),
});
