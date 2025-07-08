import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { db } from '../../../db/connection.ts';
import { schema } from '../../../db/schemas/index.ts';

export const getRoomsRoute: FastifyPluginCallbackZod = (app) => {
  app.get('/rooms', async () => {
    const rooms = await db.query.rooms.findMany({
      columns: {
        id: true,
        name: true,
      },
      orderBy: schema.rooms.createdAt,
    });
    return { data: rooms };
  });
};
