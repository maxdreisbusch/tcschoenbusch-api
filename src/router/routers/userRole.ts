import { PermissionState } from 'db/databaseTypes';
import { z } from 'zod';

import { userRoleSchema, userRoleSchemaObject } from 'schemes/userRole';
import { createTRPCRouter, roleCheckProcedure } from '..';

const routerName = 'userRole';
export const userRoleRouter = createTRPCRouter({
	create: roleCheckProcedure(routerName, 'create')
		.input(userRoleSchemaObject)
		.mutation(({ input, ctx }) =>
			ctx.prisma.userRole.create({
				data: input,
			})
		),

	list: roleCheckProcedure(routerName, 'list').query(({ ctx }) => {
		let where;
		if (ctx.permission !== PermissionState.ALL) where = { users: { some: { id: ctx.session.id } } };

		return ctx.prisma.userRole.findMany({
			select: { id: true, title: true, description: true, _count: true },
			where,
		});
	}),

	get: roleCheckProcedure(routerName, 'get')
		.input(z.number())
		.query(({ ctx, input }) => {
			let additionalWhere;
			if (ctx.permission !== PermissionState.ALL) additionalWhere = { users: { some: { id: ctx.session.id } } };

			return ctx.prisma.userRole.findFirstOrThrow({
				where: { id: input, ...additionalWhere },
				select: {
					id: true,
					title: true,
					description: true,
					isDefault: true,
					_count: true,
				},
			});
		}),

	getUsersByRole: roleCheckProcedure(routerName, 'getUsersByRole')
		.input(z.number())
		.query(({ ctx, input }) => {
			return ctx.prisma.user.findMany({
				where: { roles: { some: { id: input } } },
				select: {
					id: true,
					name: true,
					email: true,
					image: true,
				},
			});
		}),

	getAddableUsers: roleCheckProcedure(routerName, 'getAddableUsers')
		.input(z.number())
		.query(({ ctx, input }) => {
			return ctx.prisma.user.findMany({
				where: { roles: { none: { id: input } } },
				select: {
					id: true,
					name: true,
					email: true,
					image: true,
				},
			});
		}),

	update: roleCheckProcedure(routerName, 'update')
		.input(z.object({ id: z.number(), ...userRoleSchema }))
		.mutation(({ input, ctx }) =>
			ctx.prisma.userRole.update({
				where: { id: input.id },
				data: { title: input.title, description: input.description, isDefault: input.isDefault },
			})
		),

	delete: roleCheckProcedure(routerName, 'delete')
		.input(z.number())
		.mutation(({ input, ctx }) =>
			ctx.prisma.userRole.delete({
				where: { id: input },
			})
		),

	removeUserFromRole: roleCheckProcedure(routerName, 'removeUserFromRole')
		.input(z.object({ userId: z.string(), roleId: z.number() }))
		.mutation(({ input, ctx }) =>
			ctx.prisma.userRole.update({
				where: { id: input.roleId },
				data: { users: { disconnect: { id: input.userId } } },
			})
		),

	addUsersToRole: roleCheckProcedure(routerName, 'addUsersToRole')
		.input(z.object({ userIds: z.string().array(), roleId: z.number() }))
		.mutation(({ input, ctx }) => {
			const usersToAdd = input.userIds.map((item) => ({ id: item }));
			return ctx.prisma.userRole.update({
				where: { id: input.roleId },
				data: { users: { connect: usersToAdd } },
			});
		}),
});
