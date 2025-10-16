import { PermissionState } from 'db/databaseTypes';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, roleCheckProcedure } from '..';

const PushNotificationChannelSchema = z.object({
	id: z.string().cuid().optional(),
	title: z.string(),
	isPublic: z.boolean().default(true),
	grantedUserRoles: z.number().array(),
});

const routerName = 'pushNotificationChannelRouter';
export const pushNotificationChannelRouter = createTRPCRouter({
	create: roleCheckProcedure(routerName, 'create')
		.input(PushNotificationChannelSchema)
		.mutation(async ({ input, ctx }) => {
			const { title, isPublic, grantedUserRoles } = input;
			const grantedRoles = grantedUserRoles.map((id) => ({ id }));

			return await ctx.prisma.pushNotificationChannel.create({
				data: { title, isPublic, grantedUserRoles: { connect: grantedRoles } },
			});
		}),

	list: roleCheckProcedure(routerName, 'list').query(async ({ ctx }) => {
		if (ctx.permission === PermissionState.ALL) return await ctx.prisma.pushNotificationChannel.findMany();
		const grantedRoles = ctx.session.roles?.map((id) => ({ id }));
		const items = await ctx.prisma.pushNotificationChannel.findMany({
			where: { OR: [{ isPublic: true }, { grantedUserRoles: { some: { OR: grantedRoles } } }] },
		});

		return items;
	}),

	listPublic: publicProcedure.query(async ({ ctx }) => await ctx.prisma.pushNotificationChannel.findMany({ where: { isPublic: true } })),

	get: roleCheckProcedure(routerName, 'get')
		.input(z.string())
		.query(({ ctx, input }) => {
			return ctx.prisma.pushNotificationChannel.findUnique({ where: { id: input }, include: { grantedUserRoles: { select: { id: true } } } });
		}),

	update: roleCheckProcedure(routerName, 'update')
		.input(PushNotificationChannelSchema)
		.mutation(({ input, ctx }) => {
			const { id, grantedUserRoles, ...data } = input;
			const grantedRoles = grantedUserRoles.map((id) => ({ id }));

			return ctx.prisma.pushNotificationChannel.update({
				where: { id },
				data: { ...data, grantedUserRoles: { connect: grantedRoles } },
			});
		}),

	delete: roleCheckProcedure(routerName, 'delete')
		.input(z.string().cuid())
		.mutation(({ input, ctx }) => {
			return ctx.prisma.pushNotificationChannel.delete({
				where: { id: input },
			});
		}),
});
