import { z } from 'zod';

import { HallencardStatus, createHallencardSchema, useHallencardForAnotherPersonSchema, useHallencardSchema } from 'schemes/hallencard';
import { createHallencardCode, createHallencardPin } from 'utils/backend';
import { createTRPCRouter, roleCheckProcedure } from '..';
import { TransactionReason } from 'db/databaseTypes';

const routerName = 'hallencard';
export const hallencardRouter = createTRPCRouter({
	create: roleCheckProcedure(routerName, 'create')
		.input(z.object(createHallencardSchema))
		.mutation(({ input, ctx }) =>
			ctx.prisma.hallencard.create({
				data: {
					code: createHallencardCode(),
					pin: createHallencardPin().toString(),
					value: input.value,
					printed: false,
				},
			})
		),

	list: roleCheckProcedure(routerName, 'list')
		.input(
			z.object({
				limit: z.number().min(1).max(100).nullish(),
				cursor: z.string().nullish(),
				status: z.nativeEnum(HallencardStatus).nullish(),
			})
		)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 50;
			const { cursor, status } = input;

			let whereClause: { printed: boolean; transactionId: object | null } = {
				printed: true,
				transactionId: { not: null },
			};
			if (status === HallencardStatus.CREATED) whereClause = { printed: false, transactionId: null };
			if (status === HallencardStatus.PRINTED) whereClause = { printed: true, transactionId: null };
			const items = await ctx.prisma.hallencard.findMany({
				select: {
					code: true,
					printed: true,
					value: true,
					transaction: { select: { user: { select: { name: true, image: true } } } },
				},
				cursor: cursor ? { code: cursor } : undefined,
				where: whereClause,
				orderBy: [{ code: 'asc' }],
				take: limit + 1,
			});

			let nextCursor: typeof cursor | null = null;
			if (items.length > limit) {
				const nextItem = items.pop();
				if (nextItem) nextCursor = nextItem.code;
			}

			return {
				items,
				nextCursor,
			};
		}),

	print: roleCheckProcedure(routerName, 'print')
		.input(z.string())
		.query(async ({ ctx, input }) => {
			const card = await ctx.prisma.hallencard.findUnique({
				where: { code: input },
			});
			//TODO: print logic
			return ctx.prisma.hallencard.update({ where: { code: card?.code }, data: { printed: true } });
		}),

	overview: roleCheckProcedure(routerName, 'overview').query(async ({ ctx }) => {
		const [myHallencards, myCurrentValue] = await Promise.all([
			ctx.prisma.hallencard.findMany({
				select: { code: true, value: true, transaction: { select: { createdAt: true } } },
				where: { transaction: { userId: ctx.session.id } },
				orderBy: { transaction: { createdAt: 'desc' } },
				take: 10,
			}),
			ctx.prisma.transaction.groupBy({
				by: ['userId'],
				where: { userId: ctx.session.id, deleted: false },
				_sum: { value: true },
			}),
		]);

		return { myHallencards, myCurrentValue };
	}),

	use: roleCheckProcedure(routerName, 'use')
		.input(z.object(useHallencardSchema))
		.mutation(async ({ input, ctx }) => {
			const hallencard = await ctx.prisma.hallencard.findFirstOrThrow({
				where: { code: input.code, pin: input.pin, transactionId: null },
			});
			return ctx.prisma.transaction.create({
				data: {
					value: hallencard.value,
					currency: 'EUR',
					reason: TransactionReason.HALLENCARD_RECHARGE,
					hallencard: { connect: { code: hallencard.code } },
					user: { connect: { id: ctx.session.id } },
				},
			});
		}),

	useForAnotherPerson: roleCheckProcedure(routerName, 'useForAnotherPerson')
		.input(z.object(useHallencardForAnotherPersonSchema))
		.mutation(async ({ input, ctx }) => {
			const hallencard = await ctx.prisma.hallencard.findFirstOrThrow({
				where: { code: input.code, transactionId: null },
			});
			await ctx.prisma.hallencard.update({ where: { code: input.code }, data: { printed: true } });
			return ctx.prisma.transaction.create({
				data: {
					value: hallencard.value,
					currency: 'EUR',
					reason: TransactionReason.HALLENCARD_RECHARGE,
					hallencard: { connect: { code: hallencard.code } },
					user: { connect: { id: input.userId } },
				},
			});
		}),
});
