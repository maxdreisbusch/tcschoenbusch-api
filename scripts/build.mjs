import { rmSync } from 'fs';
import { build } from 'tsup';

rmSync('dist/server', { recursive: true, force: true });

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
	dts: false,
	tsconfig: 'tsconfig.build.json',
});
