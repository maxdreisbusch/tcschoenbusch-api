import 'utils/env';

import { prisma } from 'db';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from '../router/routers';
import express from 'express';
import cors from 'cors';
import { env } from '../utils/env';
import { createContext } from 'router';

export const createTRPCMiddleware = trpcExpress.createExpressMiddleware({
	router: appRouter,
	createContext: createContext,
	onError:
		env.NODE_ENV === 'development'
			? ({ path, error }: { path: unknown; error: unknown }) => {
					console.log(`❌ tRPC failed on ${path ?? '<no-path>'}: ${JSON.stringify(error)}`);
			  }
			: undefined,
});

const app = express();
app.use(cors());
app.use('/trpc', createTRPCMiddleware);

app.get('/health', async (req, res) => {
	try {
		await prisma.$queryRaw`SELECT 1`;
		res.status(200).json({ status: 'ok', db: 'connected' });
	} catch (error) {
		console.error('DB check failed:', error);
		res.status(500).json({ status: 'error', db: 'disconnected' });
	}
});

app.listen(parseInt(env.PORT), () => console.log(`Server is running on http://localhost:${env.PORT}/trpc`));
