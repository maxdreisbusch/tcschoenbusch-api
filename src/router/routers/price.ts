import { z } from 'zod';

import { priceSchema } from 'schemes/price';
import { createTRPCRouter, roleCheckProcedure } from '..';

const routerName = 'price';
export const priceRouter = createTRPCRouter({
	create: roleCheckProcedure(routerName, 'create')
		.input(z.object(priceSchema))
		.mutation(({ input, ctx }) => {
			const { roles, areas, from, to, ...rest } = input;
			const rolesToAdd = roles.map((item) => ({ id: parseInt(item) }));
			const areasToAdd = areas.map((item) => ({ id: parseInt(item) }));
			return ctx.prisma.price.create({
				data: {
					...rest,
					from: parseInt(from.replace(':', '')),
					to: parseInt(to.replace(':', '')),
					roles: { connect: rolesToAdd },
					areas: { connect: areasToAdd },
				},
			});
		}),

	get: roleCheckProcedure(routerName, 'get')
		.input(z.string())
		.query(async ({ ctx, input }) =>
			ctx.prisma.price.findUnique({
				where: { id: input },
				select: {
					id: true,
					validFrom: true,
					validTo: true,
					roles: { select: { id: true, title: true } },
					areas: { select: { id: true, name: true } },
					isDefault: true,
					mon: true,
					tue: true,
					wed: true,
					thu: true,
					fri: true,
					sat: true,
					sun: true,
					from: true,
					to: true,
					value: true,
					taxes: true,
					currency: true,
				},
			})
		),

	list: roleCheckProcedure(routerName, 'list')
		.input(
			z.object({
				limit: z.number().min(1).max(100).nullish(),
				cursor: z.string().nullish(),
				filterByRoleId: z.number().optional(),
			})
		)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 50;
			const { cursor } = input;

			const items = await ctx.prisma.price.findMany({
				select: {
					id: true,
					validFrom: true,
					validTo: true,
					roles: { select: { id: true, title: true } },
					areas: { select: { id: true, name: true } },
					isDefault: true,
					mon: true,
					tue: true,
					wed: true,
					thu: true,
					fri: true,
					sat: true,
					sun: true,
					from: true,
					to: true,
					value: true,
					currency: true,
				},
				where: { roles: { some: input.filterByRoleId ? { id: input.filterByRoleId } : undefined } },
				orderBy: [{ validFrom: 'asc' }, { validTo: 'asc' }],
				cursor,
			});

			let nextCursor: typeof cursor | null = null;
			if (items.length > limit) {
				const nextItem = items.pop();
				nextCursor = nextItem?.id;
			}
			return {
				items,
				nextCursor,
			};
		}),

	update: roleCheckProcedure(routerName, 'update')
		.input(z.object({ id: z.string(), ...priceSchema }))
		.mutation(({ input, ctx }) => {
			const { id, roles, areas, from, to, ...rest } = input;
			const rolesToAdd = roles.map((item) => ({ id: parseInt(item) }));
			const areasToAdd = areas.map((item) => ({ id: parseInt(item) }));

			return ctx.prisma.price.update({
				where: { id },
				data: {
					...rest,
					from: parseInt(from.replace(':', '')),
					to: parseInt(to.replace(':', '')),
					roles: { set: rolesToAdd },
					areas: { set: areasToAdd },
				},
			});
		}),

	delete: roleCheckProcedure(routerName, 'delete')
		.input(z.string())
		.mutation(({ input, ctx }) =>
			ctx.prisma.price.delete({
				where: { id: input },
			})
		),
});
