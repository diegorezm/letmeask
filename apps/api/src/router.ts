import { questionsRouter } from './modules/questions/routes/index.ts';
import { roomsRouter } from './modules/rooms/routes/index.ts';
import { publicProcedure, router } from './trpc.ts';

export const appRouter = router({
  ping: publicProcedure.query(() => ({ pong: true })),
  rooms: roomsRouter,
  questions: questionsRouter,
});

export type AppRouter = typeof appRouter;
