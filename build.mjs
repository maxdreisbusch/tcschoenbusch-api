import { rmSync } from 'fs';
import { build } from 'tsup';

rmSync('dist', { recursive: true, force: true });

build({
	entry: ['src/servers/express.ts'],
	outDir: 'dist/server',
	format: ['esm'],
	clean: true,
	sourcemap: true,
	splitting: false,
	target: 'node18',
	platform: 'node',
	external: ['@trpc/server', 'zod', 'express', 'cors', 'superjson'],
	dts: true,
	tsconfig: 'tsconfig.build.json',
});

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

// build({
// 	entry: ['packages/databaseTypes.ts'],
// 	outDir: 'dist/client',
// 	format: ['cjs'],
// 	clean: true,
// 	sourcemap: true,
// 	dts: true,
// 	tsconfig: 'tsconfig.client.json',
// });
// build({
// 	entry: ['packages/schemes.ts'],
// 	outDir: 'dist/client',
// 	format: ['cjs'],
// 	clean: true,
// 	sourcemap: true,
// 	dts: true,
// 	tsconfig: 'tsconfig.client.json',
// });
// build({
// 	entry: ['packages/frontendUtils.ts'],
// 	outDir: 'dist/client',
// 	format: ['cjs'],
// 	clean: true,
// 	sourcemap: true,
// 	dts: true,
// 	tsconfig: 'tsconfig.client.json',
// });
