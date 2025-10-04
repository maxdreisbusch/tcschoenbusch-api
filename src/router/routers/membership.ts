import { createTRPCRouter, roleCheckProcedure } from '..';

const routerName = 'membership';
export const membershipRouter = createTRPCRouter({
	getMembershipCardData: roleCheckProcedure(routerName, 'get').query(({ ctx }) => {
		return { id: ctx.session.id, name: ctx.session.name, email: ctx.session.email };
	}),
});
