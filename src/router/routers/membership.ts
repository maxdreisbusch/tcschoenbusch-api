import { createTRPCRouter, roleCheckProcedure } from '..';
import * as jwt from 'jsonwebtoken';

const routerName = 'membership';
export const membershipRouter = createTRPCRouter({
	getMembershipCardData: roleCheckProcedure(routerName, 'get').query(({ ctx }) => {
		const membershipToken = jwt.sign({ id: ctx.session.id, name: ctx.session.name, email: ctx.session.email }, 'AbTcSMemBership#CardSecret#2025!', {
			expiresIn: '30 days',
		});
		return { id: ctx.session.id, name: ctx.session.name, email: ctx.session.email, membershipToken };
	}),
});
