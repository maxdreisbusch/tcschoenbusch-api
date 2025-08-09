import { z } from 'zod';

import { controlInterfaceSchema, controlInterfaceSchemaObject } from 'schemes/controlInterface';
import { addMinutes, subMinutes } from 'utils/backend';
import { createTRPCRouter, publicProcedure, roleCheckProcedure } from '..';

import { isCourtAvailable } from './reservation';

const routerName = 'controlInterface';
export const controlInterfaceRouter = createTRPCRouter({
	create: roleCheckProcedure(routerName, 'create')
		.input(controlInterfaceSchemaObject)
		.mutation(({ input, ctx }) => {
			const { affectedCourts, ...data } = input;
			const modifiedAffectedCourts = affectedCourts?.map((id: string) => ({ id }));
			return ctx.prisma.controlInterface.create({
				data: { ...data, affectedCourts: { connect: modifiedAffectedCourts } },
			});
		}),

	get: roleCheckProcedure(routerName, 'get')
		.input(z.string())
		.query(async ({ ctx, input: id }) =>
			ctx.prisma.controlInterface.findUnique({ where: { id }, include: { affectedCourts: { select: { id: true } } } })
		),

	list: roleCheckProcedure(routerName, 'list').query(async ({ ctx }) => ctx.prisma.controlInterface.findMany({ orderBy: [{ title: 'asc' }] })),

	update: roleCheckProcedure(routerName, 'update')
		.input(z.object({ id: z.string(), ...controlInterfaceSchema }))
		.mutation(({ input, ctx }) => {
			const { id, affectedCourts, ...data } = input;

			const modifiedAffectedCourts = affectedCourts?.map((id: string) => ({ id }));

			return ctx.prisma.controlInterface.update({
				where: { id },
				data: {
					...data,
					affectedCourts: { connect: modifiedAffectedCourts },
				},
			});
		}),

	delete: roleCheckProcedure(routerName, 'delete')
		.input(z.string())
		.mutation(({ input, ctx }) => ctx.prisma.controlInterface.delete({ where: { id: input } })),

	execute: publicProcedure.input(z.string()).query(async ({ ctx, input: id }) => {
		const controlInterface = await ctx.prisma.controlInterface.findUnique({
			where: { id },
			include: { affectedCourts: { select: { id: true } } },
		});

		if (controlInterface) {
			const now = new Date();
			const result: Array<boolean> = [];

			for (const court of controlInterface.affectedCourts) {
				const [isAvailablePre, isAvailablePost] = await Promise.all([
					isCourtAvailable(now, addMinutes(now, controlInterface.preBooking + 1), court.id),
					isCourtAvailable(subMinutes(now, controlInterface.postBooking + 1), now, court.id),
				]);

				//if the court is not available, the switches need to be on
				result.push(!(isAvailablePre && isAvailablePost));
			}

			if (controlInterface.connectByAnd) return result.every((v) => v);
			if (controlInterface.connectByOr) return result.some((v) => v);
			return result;
		}
		return null;
	}),
});
