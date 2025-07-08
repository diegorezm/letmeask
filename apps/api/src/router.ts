import { initTRPC } from '@trpc/server';

export const t = initTRPC.create();
export const appRouter = t.router({
  ping: t.procedure.query(() => {
    return { pong: true };
  }),
});
export type AppRouter = typeof appRouter;
