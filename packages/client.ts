import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { appRouter } from 'router/routers';

// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
