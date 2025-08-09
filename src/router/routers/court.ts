import { z } from 'zod';

import { courtSchema, courtSchemaObject } from 'schemes/court';
import { createTRPCRouter, roleCheckProcedure } from '..';

const selectList = {
	id: true,
	name: true,
	shortName: true,
	active: true,
	activeFrom: true,
	activeTo: true,
	order: true,
	area: {
		select: { id: true, shortName: true },
	},
	_count: true,
};

const routerName = 'court';
export const courtRouter = createTRPCRouter({
	create: roleCheckProcedure(routerName, 'create')
		.input(courtSchemaObject)
		.mutation(({ input, ctx }) =>
			ctx.prisma.court.create({
				data: input,
			})
		),
	list: roleCheckProcedure(routerName, 'list').query(({ ctx }) =>
		ctx.prisma.court.findMany({
			select: selectList,
			orderBy: [{ order: 'asc' }, { name: 'asc' }],
		})
	),
	get: roleCheckProcedure(routerName, 'get')
		.input(z.string())
		.query(({ ctx, input }) =>
			ctx.prisma.court.findUnique({
				where: { id: input },
				select: {
					id: true,
					name: true,
					shortName: true,
					description: true,
					active: true,
					activeFrom: true,
					activeTo: true,
					areaId: true,
					order: true,
				},
			})
		),
	update: roleCheckProcedure(routerName, 'update')
		.input(z.object({ id: z.string(), ...courtSchema }))
		.mutation(({ input, ctx }) => {
			const { id, ...data } = input;

			return ctx.prisma.court.update({
				where: { id },
				data,
			});
		}),

	delete: roleCheckProcedure(routerName, 'delete')
		.input(z.string())
		.mutation(({ input, ctx }) =>
			ctx.prisma.court.delete({
				where: { id: input },
			})
		),
});
