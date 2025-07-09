import { TRPCError } from '@trpc/server';
import { desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../../db/connection.ts';
import { schema } from '../../../db/schemas/index.ts';
import { generateAnswer, generateEmbeddings } from '../../../services/gpt.ts';
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
  findById: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ input }) => {
      const question = await db.query.questions.findFirst({
        where: eq(schema.questions.id, input.id),
      });
      if (!question) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Question not found.',
        });
      }
      return question;
    }),
  create: publicProcedure
    .input(
      z.object({
        question: z.string().min(1).max(1024),
        roomId: z.string().uuid(),
      })
    )
    .mutation(async ({ input }) => {
      const embeddings = await generateEmbeddings(input.question);

      if (!embeddings) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }

      const embeddingsAsString = `[${embeddings.join(',')}]`;

      const chunks = await db
        .select({
          id: schema.audioChunks.id,
          transcription: schema.audioChunks.transcription,
          similarity: sql<number>`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector)`,
        })
        .from(schema.audioChunks)

        .where(eq(schema.audioChunks.roomId, input.roomId))
        // TODO: Find a way to make this work.
        // .where(
        //   and(
        //     eq(schema.audioChunks.roomId, input.roomId),
        //     sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector) > 0.7`
        //   )
        // )
        .orderBy(
          sql`${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector`
        )
        .limit(5);

      let answer: string | null = null;

      if (chunks.length > 0) {
        const transcriptions = chunks.map((c) => c.transcription);
        answer = await generateAnswer(input.question, transcriptions);
      }

      const [res] = await db
        .insert(schema.questions)
        .values({ question: input.question, roomId: input.roomId, answer })
        .returning();

      if (!res) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Could not create this question.',
        });
      }

      return { questionId: res.id, answer };
    }),
});
