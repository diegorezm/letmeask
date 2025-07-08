import { fastifyCors } from '@fastify/cors';
import {
  type FastifyTRPCPluginOptions,
  fastifyTRPCPlugin,
} from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { env } from './env.ts';
import { type AppRouter, appRouter } from './router.ts';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: 'http://localhost:3000',
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    router: appRouter,
    onError({ path, error }) {
      // report to error monitoring
      // biome-ignore lint/suspicious/noConsole: <only in dev>
      console.error(`Error in tRPC handler on path '${path}':`, error);
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
});

app.get('/ping', () => {
  return 'pong';
});

app.listen({ port: env.PORT }).then(() => {
  // biome-ignore lint/suspicious/noConsole: <only in dev>
  console.log(`Server running at: http://localhost:${env.PORT}/`);
});
