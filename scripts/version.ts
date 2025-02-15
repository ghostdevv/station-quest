import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const { version } = JSON.parse(
	await readFile(join(import.meta.dirname, '../package.json'), 'utf-8'),
);

await writeFile(
	join(import.meta.dirname, '../src/lib/version.ts'),
	`export const version = '${version}';\n`,
	'utf-8',
);
