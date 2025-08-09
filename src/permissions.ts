import { appRouter } from 'router/routers';
import { AppRouter } from '../packages/client';

const filter = (input: Array<string>) => input.filter((name) => name !== 'createCaller' && name !== '_def' && name !== 'getErrorShape');

export const appRouterPermissions: Record<string, Array<string>> = filter(Object.keys(appRouter)).reduce(
	(acc, key) => ({
		...acc,
		[key]: filter(Object.keys(appRouter[key as keyof AppRouter])),
	}),
	{}
);
