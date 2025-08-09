import { z } from 'zod';

import { seasonSchemaObject } from 'schemes/season';
import { createTRPCRouter, publicProcedure, roleCheckProcedure } from '..';

const routerName = 'season';
export const seasonRouter = createTRPCRouter({
	upsert: roleCheckProcedure(routerName, 'upsert')
		.input(seasonSchemaObject)
		.mutation(({ input, ctx }) => {
			const { id, ...data } = input;

			return ctx.prisma.season.upsert({
				where: { id: id ?? 0 },
				create: data,
				update: data,
			});
		}),

	list: publicProcedure.query(async ({ ctx }) => {
		return ctx.prisma.season.findMany({
			orderBy: [{ starting: 'desc' }],
			include: { _count: true },
		});
	}),

	get: publicProcedure.input(z.number()).query(async ({ input, ctx }) =>
		ctx.prisma.season.findUnique({
			where: { id: input },
			include: { _count: true },
		})
	),

	getCurrentSeason: publicProcedure.query(async ({ ctx }) =>
		ctx.prisma.season.findFirst({
			where: { current: true },
		})
	),

	setCurrentSeason: roleCheckProcedure(routerName, 'setCurrentSeason')
		.input(z.number())
		.mutation(async ({ input, ctx }) =>
			ctx.prisma.$transaction([
				ctx.prisma.season.update({
					where: { id: input },
					data: { current: true },
				}),
				ctx.prisma.season.updateMany({
					where: { id: { not: input } },
					data: { current: false },
				}),
			])
		),

	listActiveAndFuture: publicProcedure
		.input(z.object({ teamFilter: z.number().optional(), invertTeamFilter: z.boolean().optional() }))
		.query(async ({ input, ctx }) =>
			ctx.prisma.season.findMany({
				where: {
					ending: { gte: new Date() },
					teams: input.teamFilter
						? {
								none: input.invertTeamFilter ? { teamId: input.teamFilter } : undefined,
								some: !input.invertTeamFilter ? { teamId: input.teamFilter } : undefined,
						  }
						: undefined,
				},
			})
		),

	delete: roleCheckProcedure(routerName, 'delete')
		.input(z.number())
		.mutation(({ input, ctx }) => ctx.prisma.season.delete({ where: { id: input } })),
});
