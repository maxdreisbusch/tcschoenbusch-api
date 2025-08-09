import { PermissionState } from 'db/databaseTypes';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { notificationSchema } from 'schemes/notification';
import { createTRPCRouter, roleCheckProcedure } from '..';

const routerName = 'notification';
export const notificationRouter = createTRPCRouter({
	create: roleCheckProcedure(routerName, 'create')
		.input(z.object(notificationSchema))
		.mutation(({ input, ctx }) =>
			ctx.prisma.notification.create({
				data: input,
			})
		),

	get: roleCheckProcedure(routerName, 'get')
		.input(z.string())
		.query(async ({ ctx, input }) =>
			ctx.prisma.notification.findUnique({
				where: { id: input },
			})
		),

	list: roleCheckProcedure(routerName, 'list')
		.input(
			z.object({
				limit: z.number().min(1).max(100).nullish(),
				cursor: z.string().nullish(),
				all: z.boolean().optional(),
			})
		)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 50;
			const { cursor } = input;
			const today = new Date();

			if (input.all && ctx.permission !== PermissionState.ALL) throw new TRPCError({ code: 'UNAUTHORIZED' });

			const items = await ctx.prisma.notification.findMany({
				select: { id: true, title: true, message: true, severity: true, showFrom: !!input.all, showTo: !!input.all },
				where: input.all ? undefined : { showFrom: { lte: today }, showTo: { gte: today } },
				orderBy: [{ showFrom: 'asc' }],
				take: input.all ? limit + 1 : undefined,
				cursor: cursor ? { id: cursor } : undefined,
			});

			let nextCursor: typeof cursor | null = null;
			if (items.length > limit) {
				const nextItem = items.pop();
				nextCursor = nextItem?.id;
			}
			return {
				items,
				nextCursor,
			};
		}),

	update: roleCheckProcedure(routerName, 'update')
		.input(z.object({ id: z.string(), ...notificationSchema }))
		.mutation(({ input, ctx }) => {
			const { id, ...data } = input;

			return ctx.prisma.notification.update({
				where: { id },
				data,
			});
		}),

	delete: roleCheckProcedure(routerName, 'delete')
		.input(z.string())
		.mutation(({ input, ctx }) =>
			ctx.prisma.notification.delete({
				where: { id: input },
			})
		),
});
