import { rmSync } from 'fs';
import { build } from 'tsup';

rmSync('dist/packages', { recursive: true, force: true });

build({
	entry: ['packages/client.ts', 'packages/schemes.ts', 'packages/frontendUtils.ts', 'packages/databaseTypes.ts'],
	outDir: 'dist/client',
	format: ['cjs'],
	clean: true,
	sourcemap: true,
	dts: true,
	tsconfig: 'tsconfig.client.json',
	external: ['@prisma/client', '@trpc/client', 'zod', 'superjson'],
});
