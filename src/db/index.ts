import { PrismaClient } from '@prisma/client';
import { env } from 'utils/env';

export const prisma = new PrismaClient({
	//log: [],
	log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
export type PrismaType = PrismaClient;
