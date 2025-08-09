import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { benefitSchema } from 'schemes/benefit';
import { createTRPCRouter, roleCheckProcedure } from '..';

const routerName = 'benefit';
export const benefitRouter = createTRPCRouter({
	create: roleCheckProcedure(routerName, 'create')
		.input(z.object(benefitSchema))
		.mutation(({ input, ctx }) => {
			return ctx.prisma.benefit.create({
				data: input,
			});
		}),

	get: roleCheckProcedure(routerName, 'get')
		.input(z.string())
		.query(async ({ ctx, input }) =>
			ctx.prisma.benefit.findUnique({
				where: { id: input },
			})
		),

	list: roleCheckProcedure(routerName, 'list').query(async ({ ctx }) =>
		ctx.prisma.benefit.findMany({
			orderBy: [{ title: 'asc' }],
		})
	),

	update: roleCheckProcedure(routerName, 'update')
		.input(z.object({ id: z.string().optional(), ...benefitSchema }))
		.mutation(({ input, ctx }) => {
			const { id, ...data } = input;

			if (!id) throw new TRPCError({ code: 'BAD_REQUEST' });

			return ctx.prisma.benefit.update({
				where: { id },
				data,
			});
		}),

	delete: roleCheckProcedure(routerName, 'delete')
		.input(z.string())
		.mutation(({ input, ctx }) =>
			ctx.prisma.benefit.delete({
				where: { id: input },
			})
		),
});
