import { PermissionState } from 'db/databaseTypes';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { ApplicationDialogPermission } from 'utils/backend';
import { createTRPCRouter, roleCheckProcedure } from '..';

const primaryCheck = {
	router: z.string(),
	action: z.string(),
	userRoleId: z.number(),
};

const allowedCheck = z.nativeEnum(PermissionState);

const routerName = 'permission';
export const permissionRouter = createTRPCRouter({
	create: roleCheckProcedure(routerName, 'create')
		.input(
			z.object({
				...primaryCheck,
				allowed: allowedCheck,
			})
		)
		.mutation(({ input, ctx }) =>
			ctx.prisma.permission.create({
				data: input,
			})
		),

	createMany: roleCheckProcedure(routerName, 'createMany')
		.input(
			z.object({
				userRoleId: z.number(),
				router: z.string(),
				actions: z.string().array(),
				allowed: allowedCheck,
			})
		)
		.mutation(({ input, ctx }) => {
			const { userRoleId, router, allowed } = input;

			const newPermissions = input.actions.map((action) => ({ userRoleId, router, allowed, action }));
			return ctx.prisma.permission.createMany({
				data: newPermissions,
			});
		}),

	list: roleCheckProcedure(routerName, 'list')
		.input(
			z.object({
				limit: z.number().min(1).max(100).nullish(),
				cursor: z.object(primaryCheck).nullish(),
				filterByRoleId: z.number().optional(),
			})
		)
		.query(async ({ ctx, input }) => {
			if (ctx.permission !== PermissionState.ALL) throw new TRPCError({ code: 'UNAUTHORIZED' });

			const limit = input.limit ?? 50;
			const { cursor } = input;
			const items = await ctx.prisma.permission.findMany({
				take: limit + 1, // get an extra item at the end which we'll use as next cursor
				where: { userRoleId: input.filterByRoleId },
				cursor: cursor ? { router_action_userRoleId: cursor } : undefined,
				orderBy: [{ router: 'asc' }, { action: 'asc' }],
			});

			let nextCursor: typeof cursor | null = null;

			if (items.length > limit) {
				const nextItem = items.pop();
				if (nextItem) {
					nextCursor = {
						router: nextItem.router,
						action: nextItem.action,
						userRoleId: nextItem.userRoleId,
					};
				}
			}
			return {
				items,
				nextCursor,
			};
		}),

	getByRouterAndRoleId: roleCheckProcedure(routerName, 'getByRouterAndRoleId')
		.input(
			z.object({
				router: z.string(),
				userRoleId: z.number(),
			})
		)
		.query(async ({ input, ctx }) => {
			const { router, userRoleId } = input;
			const permissions: { action: string }[] = await ctx.prisma.permission.findMany({
				where: { router, userRoleId },
				select: { action: true },
			});
			return permissions.map((item) => item.action);
		}),

	getApplicationDialogPermission: roleCheckProcedure(routerName, 'getApplicationDialogPermission')
		.input(z.nativeEnum(ApplicationDialogPermission))
		.query(async ({ input, ctx }) => {
			const permissions = await ctx.prisma.permission.findMany({
				where: {
					userRoleId: { in: ctx.session?.roles ?? [] },
					router: 'applicationDialogPermissions',
					action: input,
				},
				select: { allowed: true },
			});

			let highestPermission: PermissionState = PermissionState.NONE;
			for (const permission of permissions) {
				if (permission.allowed === PermissionState.OWN) highestPermission = PermissionState.OWN;
				if (permission.allowed === PermissionState.ALL) return PermissionState.ALL;
			}
			return highestPermission;
		}),

	getMenuPermissions: roleCheckProcedure(routerName, 'getMenuPermissions').query(async ({ ctx }) => {
		if (ctx.session) {
			const permissions = await ctx.prisma.permission.findMany({
				where: {
					userRoleId: { in: ctx.session?.roles ?? [] },
					router: 'menuPermissions',
					allowed: PermissionState.ALL,
				},
				select: { action: true },
			});

			const result: Array<string> = [];
			for (const permission of permissions) {
				if (!result.includes(permission.action)) result.push(permission.action);
			}
			return result;
		}
	}),

	update: roleCheckProcedure(routerName, 'update')
		.input(
			z.object({
				...primaryCheck,
				allowed: allowedCheck,
			})
		)
		.mutation(({ input, ctx }) => {
			const { router, action, userRoleId, allowed } = input;
			return ctx.prisma.permission.update({
				where: { router_action_userRoleId: { router, action, userRoleId } },
				data: { allowed },
			});
		}),

	delete: roleCheckProcedure(routerName, 'delete')
		.input(z.object(primaryCheck))
		.mutation(({ input, ctx }) => {
			return ctx.prisma.permission.delete({
				where: { router_action_userRoleId: input },
			});
		}),
});
