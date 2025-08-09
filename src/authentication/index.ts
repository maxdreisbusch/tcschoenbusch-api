import { UserRole } from 'db/databaseTypes';
import { env } from 'utils/env';

export const tokenAudience: string = env.TOKEN_AUDIENCE;
export const tokenIssuer: string = env.TOKEN_ISSUER;

export type AppSessionUser = {
	id: string;
	name: string | null;
	email: string | null;
	roles: Array<number> | null;
};

//eslint-disable-next-line
export const generateAppSessionUser = (user: any): AppSessionUser => {
	const { id, name, email, roles } = user;

	return {
		id,
		name,
		email,
		roles: (roles as Array<UserRole>).sort((prev, next) => prev.priority - next.priority).map((i: { id: number }) => i.id),
	};
};
