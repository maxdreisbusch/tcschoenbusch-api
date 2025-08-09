import { PermissionState } from 'db/databaseTypes';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { userSchemaObject } from 'schemes/user';
import { createTRPCRouter, roleCheckProcedure } from '..';

const routerName = 'user';
export const userRouter = createTRPCRouter({
	get: roleCheckProcedure(routerName, 'get')
		.input(z.string().optional())
		.query(async ({ ctx, input }) => {
			if (ctx.permission !== PermissionState.ALL && ctx.permission === PermissionState.OWN && input !== undefined && input !== ctx.session.id)
				throw new TRPCError({ code: 'UNAUTHORIZED' });

			const userId = input ?? ctx.session.id!;

			return ctx.prisma.user.findUnique({
				where: { id: userId },
				select: {
					id: true,
					name: true,
					email: true,
					image: true,
					address: true,
					cityCode: true,
					cityName: true,
					countryCode: true,
					phoneNumber: true,
					publicName: true,
					roles: { select: { id: true, title: true, description: true } },
				},
			});
		}),

	update: roleCheckProcedure(routerName, 'update')
		.input(userSchemaObject)
		.mutation(async ({ ctx, input }) => {
			if (ctx.permission !== PermissionState.ALL && ctx.permission === PermissionState.OWN && input.id !== ctx.session.id)
				throw new TRPCError({ code: 'UNAUTHORIZED' });

			const { id, roles, ...data } = input;
			const setRoles = roles?.map((i) => ({ id: parseInt(i) }));

			return ctx.prisma.user.update({
				where: { id: id },
				data: {
					...data,
					roles: setRoles ? { set: setRoles } : undefined,
					needsSetup: false,
				},
			});
		}),

	updateRoles: roleCheckProcedure(routerName, 'updateRoles')
		.input(z.object({ id: z.string(), roles: z.string().array() }))
		.mutation(async ({ ctx, input }) => {
			if (ctx.permission !== PermissionState.ALL && ctx.permission === PermissionState.OWN && input.id !== ctx.session.id)
				throw new TRPCError({ code: 'UNAUTHORIZED' });

			const { id, roles } = input;
			const setRoles = roles.map((i) => ({ id: parseInt(i) }));

			return ctx.prisma.user.update({
				where: { id: id },
				data: {
					roles: setRoles ? { set: setRoles } : undefined,
				},
			});
		}),

	delete: roleCheckProcedure(routerName, 'delete')
		.input(z.string())
		.query(async ({ ctx, input }) => ctx.prisma.user.delete({ where: { id: input } })),

	getAutosuggestOptions: roleCheckProcedure(routerName, 'getAutosuggestOptions')
		.input(z.string())
		.query(async ({ ctx, input }) => {
			return ctx.prisma.user.findMany({
				where: {
					OR: [{ name: { contains: input } }, { email: { contains: input } }],
					id: { not: ctx.session!.id },
				},
				select: {
					id: true,
					name: true,
					image: true,
					email: true,
				},
				orderBy: { name: 'asc' },
				take: 5,
			});
		}),
});
