import jwksClient from 'jwks-rsa';

//TODO: change this
const jwksUri = 'https://login.tc-schoenbusch.de/.well-known/jwks.json';
const jsonWebKeyClient = jwksClient({
	cache: true,
	rateLimit: true,
	jwksUri,
	timeout: 1000,
});

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPublicSigningKey = (header: any, callback: any) => {
	jsonWebKeyClient
		.getSigningKey(header.kid)
		.then((data) => {
			callback(null, data.getPublicKey());
		})
		.catch((e) => {
			callback(e, null);
		});
};
