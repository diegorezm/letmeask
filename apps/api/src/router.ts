import { roomsRouter } from './modules/rooms/routes/index.ts';
import { publicProcedure, router } from './trpc.ts';

export const appRouter = router({
  ping: publicProcedure.query(() => ({ pong: true })),
  rooms: roomsRouter,
});

export type AppRouter = typeof appRouter;
