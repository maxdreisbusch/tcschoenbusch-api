import { z } from 'zod';

import { organisationSchemaObject } from 'schemes/organisation';
import { createTRPCRouter, publicProcedure, roleCheckProcedure } from '..';

const routerName = 'organisations';
export const organisationsRouter = createTRPCRouter({
	upsert: roleCheckProcedure(routerName, 'upsert')
		.input(organisationSchemaObject)
		.mutation(({ input, ctx }) => {
			const { id, ...data } = input;

			return ctx.prisma.organisation.upsert({
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
			})
		)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 50;
			const { cursor } = input;
			const items = await ctx.prisma.organisation.findMany({
				take: limit + 1, // get an extra item at the end which we'll use as next cursor
				cursor: cursor ? { id: cursor } : undefined,
				orderBy: [{ title: 'asc' }],
				include: { _count: true },
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

	get: publicProcedure.input(z.string().optional()).query(async ({ input, ctx }) =>
		input
			? ctx.prisma.organisation.findFirst({
					where: { OR: [{ slug: input }, { id: input }] },
					include: { members: { orderBy: { orderID: 'asc' } } },
			  })
			: null
	),

	delete: roleCheckProcedure(routerName, 'delete')
		.input(z.string())
		.mutation(({ input, ctx }) =>
			ctx.prisma.organisation.delete({
				where: { id: input },
			})
		),
});
