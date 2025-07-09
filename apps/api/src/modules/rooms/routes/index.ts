import { TRPCError } from '@trpc/server';
import { count, desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../../db/connection.ts';
import { schema } from '../../../db/schemas/index.ts';
import { generateEmbeddings, transcribeAudio } from '../../../services/gpt.ts';
import { publicProcedure, router } from '../../../trpc.ts';

export const roomsRouter = router({
  findAll: publicProcedure
    .input(
      z.object({
        limit: z.coerce.number().optional().default(5),
      })
    )
    .query(async ({ input }) => {
      const { limit } = input;
      const rooms = await db
        .select({
          id: schema.rooms.id,
          name: schema.rooms.name,
          createdAt: schema.rooms.createdAt,
          questionCount: count(schema.questions.id),
        })
        .from(schema.rooms)
        .leftJoin(
          schema.questions,
          eq(schema.questions.roomId, schema.rooms.id)
        )
        .groupBy(schema.rooms.id, schema.rooms.name)
        .orderBy(desc(schema.rooms.createdAt))
        .limit(limit);
      return rooms;
    }),
  findById: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ input }) => {
      const room = await db.query.rooms.findFirst({
        where: eq(schema.rooms.id, input.id),
        with: {},
      });

      if (!room) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found.' });
      }
      return room;
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { name, description } = input;
      const [res] = await db
        .insert(schema.rooms)
        .values({
          name,
          description,
        })
        .returning();
      if (!res) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while creating this room!',
        });
      }

      return res;
    }),
  uploadAudio: publicProcedure
    .input(
      z.object({
        roomId: z.string().uuid(),
        data: z.array(z.number()),
      })
    )
    .mutation(async ({ input }) => {
      const { roomId, data } = input;
      const buff = Buffer.from(data);
      try {
        const transcription = await transcribeAudio({ data: buff });
        const embeddings = await generateEmbeddings(transcription);

        if (!embeddings) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'No embeddings.',
          });
        }

        const [chunk] = await db
          .insert(schema.audioChunks)
          .values({
            embeddings,
            roomId,
            transcription,
          })
          .returning();
        if (!chunk) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Could not save audio chunk to the DB.',
          });
        }
        return { chunkId: chunk.id };
      } catch (error: unknown) {
        if (error instanceof TRPCError) {
          throw error;
        }

        if (error instanceof Error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            cause: error,
            message: 'Something went wrong!',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong!',
        });
      }
    }),
});
