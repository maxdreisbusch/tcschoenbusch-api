import { z } from 'zod';

import { teamSchemaObject } from 'schemes/team';
import { createTRPCRouter, publicProcedure, roleCheckProcedure } from '..';

const routerName = 'team';
export const teamRouter = createTRPCRouter({
	upsert: roleCheckProcedure(routerName, 'upsert')
		.input(teamSchemaObject)
		.mutation(({ input, ctx }) => {
			const { id, ...data } = input;

			if (id) {
				return ctx.prisma.team.update({
					where: { id },
					data,
				});
			}
			return ctx.prisma.team.create({
				data,
			});
		}),

	list: publicProcedure.query(async ({ ctx }) =>
		ctx.prisma.team.findMany({
			orderBy: [{ orderNumber: 'asc' }],
		})
	),

	get: publicProcedure.input(z.number().optional()).query(async ({ input, ctx }) =>
		input
			? ctx.prisma.team.findUnique({
					where: { id: input },
					include: { _count: true },
			  })
			: {}
	),

	delete: roleCheckProcedure(routerName, 'delete')
		.input(z.number())
		.mutation(({ input, ctx }) => ctx.prisma.team.delete({ where: { id: input } })),
});
