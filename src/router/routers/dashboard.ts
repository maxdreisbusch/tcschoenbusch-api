import { createTRPCRouter, roleCheckProcedure } from '..';

const routerName = 'dashboard';
export const dashboardRouter = createTRPCRouter({
	getMyNextReservations: roleCheckProcedure(routerName, 'getMyNextReservations').query(({ ctx }) => {
		return ctx.prisma.reservation.findMany({
			where: {
				OR: [{ ownerId: ctx.session.id }, { fellows: { some: { id: ctx.session.id } } }],
				end: { gt: new Date() },
				deletedAt: null,
			},
			select: {
				id: true,
				title: true,
				start: true,
				end: true,
				court: { select: { name: true } },
				abonnementId: true,
				fellows: { select: { name: true } },
			},
			orderBy: { start: 'asc' },
			take: 4,
		});
	}),

	needsSetup: roleCheckProcedure(routerName, 'needsSetup').query(({ ctx }) =>
		ctx.prisma.user.findUnique({ where: { id: ctx.session.id }, select: { needsSetup: true } })
	),
});
