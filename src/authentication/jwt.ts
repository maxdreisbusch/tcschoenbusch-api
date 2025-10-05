import jwt from 'jsonwebtoken';
import { AppSessionUser, generateAppSessionUser, tokenAudience, tokenIssuer } from '.';
import { getPublicSigningKey } from './jwks';
import { prisma } from 'db';

const jsonWebTokenOptions: jwt.VerifyOptions = {
	audience: tokenAudience,
	issuer: tokenIssuer,
	algorithms: ['RS256'],
};

const verifyTokenAsync = async (
	token: string,
	getPublicSigningKey: jwt.Secret | jwt.PublicKey | jwt.GetPublicKeyOrSecret,
	options: jwt.VerifyOptions
): Promise<string | jwt.Jwt | jwt.JwtPayload | jwt.VerifyErrors | undefined> =>
	new Promise((resolve, reject) => {
		jwt.verify(token, getPublicSigningKey, options, (err, decoded) => {
			if (err) {
				reject(err);
			} else {
				resolve(decoded);
			}
		});
	});

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const isJwtToken = (data: any): data is jwt.Jwt => data.header && data.payload && data.signature;
//eslint-disable-next-line @typescript-eslint/no-explicit-any
const isJwtPayload = (data: any): data is jwt.JwtPayload => data.iss && data.sub && data.aud;

export const getServerAuthSession = async (authorizationHeader: string | undefined) => {
	try {
		if (!authorizationHeader || authorizationHeader.length === 0) return;

		const token = authorizationHeader.split(' ')[1];
		if (!token) return;

		const decoded = await verifyTokenAsync(token, getPublicSigningKey, jsonWebTokenOptions);

		if (typeof decoded === 'string') return;
		if (isJwtToken(decoded) && isJwtPayload(decoded.payload)) return getAppSessionUser(decoded.payload);
		else if (isJwtPayload(decoded)) return getAppSessionUser(decoded);

		return;
	} catch (ex) {
		console.error(ex);
	}

	return;
};

export const getAppSessionUser = async (payload: jwt.JwtPayload): Promise<AppSessionUser> => {
	const email: string = payload['https://tc-schoenbusch.de/mail'];

	const [auth0User, emailUser] = await Promise.all([
		prisma.user.findUnique({
			where: { auth0Id: payload.sub },
			include: { roles: true },
		}),
		prisma.user.findUnique({
			where: { email },
			include: { roles: true },
		}),
	]);

	if (auth0User && emailUser) {
		return generateAppSessionUser(auth0User);
	} else if (auth0User && !emailUser) {
		await prisma.user.update({ data: { email }, where: { id: auth0User.id } });
		return generateAppSessionUser(auth0User);
	} else if (!auth0User && emailUser) {
		await prisma.user.update({ data: { auth0Id: payload.sub }, where: { id: emailUser.id } });
		return generateAppSessionUser(emailUser);
	}

	const role = await prisma.userRole.findFirst({ where: { isDefault: true }, select: { id: true } });
	const user = await prisma.user.create({
		data: {
			email: email,
			auth0Id: payload.sub!,
			roles: role ? { connect: { id: role?.id } } : undefined,
		},
		include: { roles: true },
	});
	return generateAppSessionUser(user);
};

export const generateMembershipToken = (payload: object) => jwt.sign(payload, 'AbTcSMemBership#Card#2025!', { expiresIn: '30d' });
