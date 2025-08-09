import { z } from 'zod';

import { eventSchemaObject } from 'schemes/event';
import { createTRPCRouter, publicProcedure, roleCheckProcedure } from '..';

const include = { _count: true, category: { select: { title: true } } };

const routerName = 'events';
export const eventsRouter = createTRPCRouter({
	upsert: roleCheckProcedure(routerName, 'upsert')
		.input(eventSchemaObject)
		.mutation(({ input, ctx }) => {
			const { id, ...data } = input;

			return ctx.prisma.event.upsert({
				where: { id: id ?? '' },
				create: data,
				update: data,
			});
		}),

	list: publicProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).nullish(),
				cursor: z.string().nullish(),
				filterByCategory: z.string().optional(),
			})
		)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 50;
			const { cursor } = input;
			const items = await ctx.prisma.event.findMany({
				take: limit + 1, // get an extra item at the end which we'll use as next cursor
				where: input.filterByCategory ? { categoryId: input.filterByCategory } : undefined,
				cursor: cursor ? { id: cursor } : undefined,
				orderBy: [{ start: 'asc' }],
				include,
			});

			let nextCursor: typeof cursor | null = null;

			if (items.length > limit) {
				const nextItem = items.pop();
				if (nextItem) nextCursor = nextItem.id;
			}

			return {
				items,
				nextCursor,
			};
		}),

	listUpcoming: publicProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).nullish(),
				cursor: z.string().nullish(),
				filterByCategorySlug: z.string().optional(),
			})
		)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 5;
			const { cursor } = input;
			const items = await ctx.prisma.event.findMany({
				take: limit + 1, // get an extra item at the end which we'll use as next cursor
				where: {
					category: input.filterByCategorySlug ? { slug: input.filterByCategorySlug } : undefined,
					end: { gte: new Date() },
				},
				cursor: cursor ? { id: cursor } : undefined,
				orderBy: [{ start: 'asc' }],
				include,
			});

			let nextCursor: typeof cursor | null = null;

			if (items.length > limit) {
				const nextItem = items.pop();
				if (nextItem) nextCursor = nextItem.id;
			}
			return {
				items,
				nextCursor,
			};
		}),

	get: publicProcedure.input(z.string()).query(async ({ input, ctx }) =>
		ctx.prisma.event.findUnique({
			where: { id: input },
			include,
		})
	),

	delete: roleCheckProcedure(routerName, 'delete')
		.input(z.string())
		.mutation(({ input, ctx }) =>
			ctx.prisma.event.delete({
				where: { id: input },
			})
		),

	listEventLocations: publicProcedure.query(async ({ ctx }) => {
		const result: Array<string> = [];
		const locations = await ctx.prisma.event.findMany({
			select: { location: true },
			where: { location: { not: null } },
			distinct: ['location'],
		});

		for (const location of locations) {
			if (location.location) result.push(location.location);
		}

		return result;
	}),
});
