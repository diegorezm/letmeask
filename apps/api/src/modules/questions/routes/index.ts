import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../../db/connection.ts';
import { schema } from '../../../db/schemas/index.ts';
import { publicProcedure, router } from '../../../trpc.ts';

export const questionsRouter = router({
  findByRoomId: publicProcedure
    .input(
      z.object({
        roomId: z.string().uuid(),
      })
    )
    .query(async ({ input }) => {
      const { roomId } = input;
      const questions = await db
        .select()
        .from(schema.questions)
        .where(eq(schema.questions.roomId, roomId))
        .orderBy(desc(schema.questions.createdAt));
      return questions;
    }),
});
