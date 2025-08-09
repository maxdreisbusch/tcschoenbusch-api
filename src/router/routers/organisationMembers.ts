import { z } from 'zod';

import { organisationMemberSchemaObject } from 'schemes/organisationMember';
import { createTRPCRouter, publicProcedure, roleCheckProcedure } from '..';

const routerName = 'organisationMembers';
export const organisationMembersRouter = createTRPCRouter({
	upsert: roleCheckProcedure(routerName, 'upsert')
		.input(organisationMemberSchemaObject)
		.mutation(({ input, ctx }) => {
			const { id, childMembers, ...data } = input;
			const children = childMembers?.map((value) => ({ id: value }));

			return ctx.prisma.organisationMember.upsert({
				where: { id: id ?? '' },
				create: { ...data, childMembers: { connect: children } },
				update: { ...data, childMembers: { set: children } },
			});
		}),

	list: publicProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).nullish(),
				cursor: z.string().nullish(),
				organisation: z.string(),
			})
		)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 50;
			const { cursor } = input;
			const items = await ctx.prisma.organisationMember.findMany({
				take: limit + 1, // get an extra item at the end which we'll use as next cursor
				cursor: cursor ? { id: cursor } : undefined,
				orderBy: { orderID: 'asc' },
				where: { OR: [{ organisationId: input.organisation }, { organisation: { slug: input.organisation } }] },
			});

			let nextCursor: typeof cursor | null = null;

			if (items.length > limit) {
				const nextItem = items.pop();
				if (nextItem) nextCursor = nextItem.id;
			}
			return {
				items,
				nextCursor,
			};
		}),

	get: publicProcedure.input(z.string()).query(async ({ input, ctx }) =>
		ctx.prisma.organisationMember.findUnique({
			where: { id: input },
			include: {
				childMembers: { select: { id: true } },
			},
		})
	),

	delete: roleCheckProcedure(routerName, 'delete')
		.input(z.string())
		.mutation(({ input, ctx }) =>
			ctx.prisma.organisationMember.delete({
				where: { id: input },
			})
		),
});
