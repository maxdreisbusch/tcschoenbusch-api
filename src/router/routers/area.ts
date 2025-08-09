import { PermissionState } from 'db/databaseTypes';
import { z } from 'zod';

import { createTRPCRouter, roleCheckProcedure } from '..';

const dataCheck = {
	name: z.string(),
	shortName: z.string(),
	activeFrom: z.date().nullable().optional(),
	activeTo: z.date().nullable().optional(),
	bookableFrom: z.date().nullable().optional(),
	order: z.number().nullable().optional(),
};

const selectList = {
	id: true,
	name: true,
	shortName: true,
	_count: true,
};

const activeWhere = (date: Date = new Date()) => ({
	OR: [
		{ activeFrom: { lt: date }, activeTo: { gt: date } },
		{ activeFrom: null, activeTo: null },
	],
});
const routerName = 'area';
export const areaRouter = createTRPCRouter({
	list: roleCheckProcedure(routerName, 'list').query(({ ctx }) =>
		ctx.prisma.area.findMany({
			select: selectList,
			orderBy: [{ order: 'asc' }, { name: 'asc' }],
		})
	),
	listActive: roleCheckProcedure(routerName, 'listActive').query(({ ctx }) =>
		ctx.prisma.area.findMany({
			select: selectList,
			where: ctx.permission === PermissionState.ALL ? undefined : activeWhere(),
			orderBy: [{ order: 'asc' }, { name: 'asc' }],
		})
	),
	get: roleCheckProcedure(routerName, 'get')
		.input(z.number())
		.query(({ ctx, input }) =>
			ctx.prisma.area.findUnique({
				where: { id: input },
				select: {
					id: true,
					name: true,
					shortName: true,
					activeFrom: true,
					activeTo: true,
					bookableFrom: true,
					order: true,
				},
			})
		),
	getWithAllCourts: roleCheckProcedure(routerName, 'getWithAllCourts')
		.input(z.number())
		.query(({ ctx, input }) =>
			ctx.prisma.area.findUnique({
				where: { id: input },
				select: {
					id: true,
					name: true,
					shortName: true,
					activeFrom: true,
					activeTo: true,
					order: true,
					courts: {
						select: {
							id: true,
							name: true,
							shortName: true,
							description: true,
							order: true,
							active: true,
							activeFrom: true,
							activeTo: true,
							_count: true,
						},
						orderBy: [{ order: 'asc' }, { name: 'asc' }],
					},
				},
			})
		),
	getWithActiveCourts: roleCheckProcedure(routerName, 'getWithActiveCourts')
		.input(z.object({ areaId: z.number().optional(), date: z.date() }))
		.query(({ ctx, input }) =>
			ctx.prisma.area.findFirst({
				where: { id: input.areaId },
				select: {
					id: true,
					name: true,
					courts: {
						select: { id: true, name: true, description: true },
						where: { AND: [{ active: true }, activeWhere(input.date)] },
						orderBy: [{ order: 'asc' }, { name: 'asc' }],
					},
				},
			})
		),

	upsert: roleCheckProcedure(routerName, 'upsert')
		.input(z.object({ id: z.number().optional(), ...dataCheck }))
		.mutation(({ input, ctx }) => {
			const { id, ...data } = input;

			if (id) {
				return ctx.prisma.area.update({
					where: { id },
					data,
				});
			}
			return ctx.prisma.area.create({ data });
		}),

	delete: roleCheckProcedure(routerName, 'delete')
		.input(z.number())
		.mutation(({ input, ctx }) =>
			ctx.prisma.area.delete({
				where: { id: input },
			})
		),
});
