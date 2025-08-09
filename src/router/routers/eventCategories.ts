import { z } from 'zod';

import { eventCategoriesSchemaObject } from 'schemes/eventCategories';
import { createTRPCRouter, publicProcedure, roleCheckProcedure } from '..';

const routerName = 'eventCategories';
export const eventCategoriesRouter = createTRPCRouter({
	upsert: roleCheckProcedure(routerName, 'upsert')
		.input(eventCategoriesSchemaObject)
		.mutation(({ input, ctx }) => {
			const { id, ...data } = input;

			return ctx.prisma.eventCategory.upsert({
				where: { id: id ?? '' },
				create: data,
				update: data,
			});
		}),

	list: publicProcedure.query(({ ctx }) =>
		ctx.prisma.eventCategory.findMany({
			orderBy: [{ title: 'asc' }],
			include: { _count: true },
		})
	),

	get: publicProcedure.input(z.string()).query(async ({ input, ctx }) =>
		ctx.prisma.eventCategory.findUnique({
			where: { id: input },
			include: { _count: true },
		})
	),

	delete: roleCheckProcedure(routerName, 'delete')
		.input(z.string())
		.mutation(({ input, ctx }) =>
			ctx.prisma.eventCategory.delete({
				where: { id: input },
			})
		),
});
