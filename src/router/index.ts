import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { prisma } from 'db';

import { getHighestPermissionState } from 'utils/backend';
import { PermissionState } from 'db/databaseTypes';
import * as trpcExpress from '@trpc/server/adapters/express';
import { getServerAuthSession } from 'authentication/jwt';
import { AppSessionUser } from 'authentication';

export const createContext = async ({ req }: trpcExpress.CreateExpressContextOptions) => {
	const authorizationHeader = req.headers.authorization;
	const session = await getServerAuthSession(authorizationHeader);
	return {
		session: session ?? null,
		prisma,
	};
};

export type Context = Awaited<ReturnType<typeof createContext>>;
const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter({ shape }) {
		return shape;
	},
});

export const createTRPCRouter = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

const enforceUserIsAuthenticated = middleware<{ session: AppSessionUser }>(({ ctx, next }) => {
	if (!ctx.session) throw new TRPCError({ code: 'UNAUTHORIZED' });

	return next({
		ctx: {
			// infers the `session` as non-nullable
			session: ctx.session!,
		},
	});
});
export const protectedProcedure = t.procedure.use(enforceUserIsAuthenticated);

const roleCheck = (router: string, action: string) =>
	middleware<{ session: AppSessionUser; permission: PermissionState.ALL | PermissionState.OWN }>(async ({ ctx, next }) => {
		if (!ctx.session?.roles || ctx.session.roles.length === 0) throw new TRPCError({ code: 'UNAUTHORIZED' });

		const permissions = await ctx.prisma.permission.findMany({
			where: {
				OR: [
					{ router, action, userRoleId: { in: ctx.session?.roles } },
					{ router: '*', action: '*', userRoleId: { in: ctx.session?.roles } },
				],
			},
		});
		const permissionState = getHighestPermissionState(permissions);
		if (permissionState === PermissionState.NONE) throw new TRPCError({ code: 'UNAUTHORIZED' });

		return next({
			ctx: {
				permission: permissionState,
			},
		});
	});
export const roleCheckProcedure = (router: string, action: string) => t.procedure.use(roleCheck(router, action));
