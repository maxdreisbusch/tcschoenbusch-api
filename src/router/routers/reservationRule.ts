import { z } from 'zod';

import { reservationRuleSchema } from 'schemes/reservationRule';
import { createTRPCRouter, roleCheckProcedure } from '..';

const routerName = 'reservationRule';
export const reservationRuleRouter = createTRPCRouter({
	create: roleCheckProcedure(routerName, 'create')
		.input(z.object(reservationRuleSchema))
		.mutation(({ ctx, input }) =>
			ctx.prisma.reservationRule.create({
				data: {
					...input,
					validFor: { connect: input.validFor?.map((i) => ({ id: parseInt(i) })) },
					affectedAreas: { connect: input.affectedAreas?.map((i) => ({ id: parseInt(i) })) },
					affectedCourts: { connect: input.affectedCourts?.map((i) => ({ id: i })) },
				},
			})
		),

	list: roleCheckProcedure(routerName, 'list').query(({ ctx }) =>
		ctx.prisma.reservationRule.findMany({
			select: {
				id: true,
				name: true,
				checkOn: true,
				validFor: { select: { title: true } },
				affectedAreas: { select: { name: true } },
				affectedCourts: { select: { name: true } },
			},
		})
	),

	get: roleCheckProcedure(routerName, 'get')
		.input(z.string())
		.query(({ ctx, input }) =>
			ctx.prisma.reservationRule.findUnique({
				where: { id: input },
				select: {
					id: true,
					name: true,
					errorDescription: true,
					checkOn: true,
					ruleCheckPluginName: true,
					value: true,
					validFor: { select: { id: true, title: true } },
					affectedAreas: { select: { id: true, name: true } },
					affectedCourts: { select: { id: true, name: true } },
				},
			})
		),

	update: roleCheckProcedure(routerName, 'update')
		.input(z.object({ id: z.string(), ...reservationRuleSchema }))
		.mutation(({ ctx, input }) => {
			const { id, ...data } = input;
			return ctx.prisma.reservationRule.update({
				where: { id },
				data: {
					...data,
					validFor: { set: data.validFor?.map((i) => ({ id: parseInt(i) })) },
					affectedAreas: { set: data.affectedAreas?.map((i) => ({ id: parseInt(i) })) },
					affectedCourts: { set: data.affectedCourts?.map((i) => ({ id: i })) },
				},
			});
		}),

	delete: roleCheckProcedure(routerName, 'delete')
		.input(z.string())
		.mutation(({ ctx, input }) => ctx.prisma.reservationRule.delete({ where: { id: input } })),
});
