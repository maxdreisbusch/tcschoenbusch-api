import { TeamCategory } from 'db/databaseTypes';
import { z } from 'zod';

import { teamSeasonSchemaObject } from 'schemes/teamSeason';
import { createTRPCRouter, publicProcedure, roleCheckProcedure } from '..';

const routerName = 'teamSeason';
export const teamSeasonRouter = createTRPCRouter({
	get: publicProcedure.input(z.object({ seasonId: z.number(), teamId: z.number() })).query(async ({ ctx, input }) =>
		ctx.prisma.teamSeason.findUnique({
			where: { teamId_seasonId: { teamId: input.teamId, seasonId: input.seasonId } },
		})
	),

	upsert: roleCheckProcedure(routerName, 'upsert')
		.input(teamSeasonSchemaObject)
		.mutation(({ input, ctx }) => {
			const { teamId, seasonId, ...data } = input;

			return ctx.prisma.teamSeason.upsert({
				where: { teamId_seasonId: { teamId, seasonId } },
				create: { teamId, seasonId, ...data },
				update: data,
			});
		}),

	listBySeasonId: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
		return ctx.prisma.teamSeason.findMany({
			orderBy: [{ team: { name: 'asc' } }],
			include: { team: { select: { name: true } } },
			where: { seasonId: input },
		});
	}),

	listByTeamId: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
		return ctx.prisma.teamSeason.findMany({
			orderBy: [{ season: { starting: 'desc' } }],
			include: { season: { select: { name: true } } },
			where: { teamId: input },
		});
	}),

	listByCategory: publicProcedure
		.input(z.object({ category: z.nativeEnum(TeamCategory), season: z.number().optional() }))
		.query(async ({ ctx, input }) => {
			let seasonId = input.season;
			if (!seasonId) {
				const currentSeason = await ctx.prisma.season.findFirst({
					where: { current: true },
				});
				if (!currentSeason) return [];
				seasonId = currentSeason.id;
			}

			return ctx.prisma.teamSeason.findMany({
				select: { leagueName: true, nuGroupId: true, nuTeamId: true, team: { select: { name: true } } },
				orderBy: [{ team: { orderNumber: 'asc' } }],
				where: { team: { category: input.category }, seasonId },
			});
		}),

	listLeagueNames: publicProcedure.query(async ({ ctx }) => {
		const result: Array<string> = [];
		const teamSeasons = await ctx.prisma.teamSeason.findMany({
			select: { leagueName: true },
			distinct: ['leagueName'],
		});

		for (const { leagueName } of teamSeasons) {
			if (leagueName && leagueName !== null) result.push(leagueName);
		}

		return result;
	}),

	delete: roleCheckProcedure(routerName, 'delete')
		.input(z.object({ teamId: z.number(), seasonId: z.number() }))
		.mutation(({ input, ctx }) => ctx.prisma.teamSeason.delete({ where: { teamId_seasonId: input } })),
});
