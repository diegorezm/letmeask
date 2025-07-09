import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../../db/connection.ts';
import { schema } from '../../../db/schemas/index.ts';
import { publicProcedure, router } from '../../../trpc.ts';
import { TRPCError } from '@trpc/server';

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

  create: publicProcedure
    .input(
      z.object({
        question: z.string().min(1).max(1024),
        roomId: z.string().uuid(),
      })
    )
    .mutation(async ({ input }) => {
      const [res] = await db.insert(schema.questions).values(input).returning();
      if (!res) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Could not create this question.',
        });
      }
      return res;
    }),
});
