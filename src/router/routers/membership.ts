import { generateMembershipToken } from 'authentication/jwt';
import { createTRPCRouter, roleCheckProcedure } from '..';

const routerName = 'membership';
export const membershipRouter = createTRPCRouter({
	getMembershipCardData: roleCheckProcedure(routerName, 'get').query(({ ctx }) => {
		try {
			const membershipToken = generateMembershipToken({ id: ctx.session.id, name: ctx.session.name, email: ctx.session.email });

			return { id: ctx.session.id, name: ctx.session.name, email: ctx.session.email, membershipToken };
		} catch (error) {
			console.error('Error generating membership token:', error);
		}
	}),
});
