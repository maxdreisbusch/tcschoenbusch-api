import { PermissionState, TransactionReason } from 'db/databaseTypes';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { transactionSchema } from 'schemes/transaction';
import { createTRPCRouter, roleCheckProcedure } from '..';

const routerName = 'transaction';
export const transactionRouter = createTRPCRouter({
	create: roleCheckProcedure(routerName, 'create')
		.input(z.object(transactionSchema))
		.mutation(({ input, ctx }) =>
			ctx.prisma.transaction.create({
				data: {
					userId: input.userId,
					reason: input.reason,
					value: input.value,
					currency: input.currency,
					reservationId: input.reservationId,
				},
			})
		),

	balance: roleCheckProcedure(routerName, 'balance')
		.input(z.string().optional())
		.query(async ({ ctx, input }) => {
			const userId = input ?? ctx.session.id;
			if (ctx.permission !== PermissionState.ALL && ctx.permission === PermissionState.OWN && userId !== ctx.session.id)
				throw new TRPCError({ code: 'UNAUTHORIZED' });

			return ctx.prisma.transaction.groupBy({
				by: ['userId'],
				where: { userId, deleted: false },
				_sum: { value: true },
			});
		}),

	list: roleCheckProcedure(routerName, 'list')
		.input(z.string().optional())
		.query(async ({ ctx, input }) => {
			const userId = input ?? ctx.session.id;
			if (ctx.permission !== PermissionState.ALL && ctx.permission === PermissionState.OWN && userId !== ctx.session.id)
				throw new TRPCError({ code: 'UNAUTHORIZED' });

			return ctx.prisma.transaction.findMany({
				where: { userId, deleted: false },
				orderBy: [{ createdAt: 'desc' }],
				take: 50,
			});
		}),

	refund: roleCheckProcedure(routerName, 'refund')
		.input(z.string())
		.mutation(async ({ input, ctx }) => {
			const transaction = await ctx.prisma.transaction.findUnique({ where: { id: input } });
			if (transaction === null) throw new TRPCError({ code: 'BAD_REQUEST' });

			return ctx.prisma.transaction.create({
				data: {
					...transaction,
					id: undefined,
					value: transaction.value * -1,
					reason: TransactionReason.REFUND,
					createdAt: undefined,
				},
			});
		}),
});
