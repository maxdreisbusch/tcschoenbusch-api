import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	PAYPAL_ID: z.string(),
	PAYPAL_SECRET: z.string(),
	PAYPAL_URL: z.string().url(),
	TOKEN_AUDIENCE: z.string(),
	TOKEN_ISSUER: z.string(),
	NODE_ENV: z.string().optional().default('PROD'),
	PORT: z.string().default('4000'),
	EXPO_PUSHNOTIFICATIONS_PAT: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
	process.exit(1); // Stop the app if env is invalid
}

export const env = {
	...parsed.data,
};
