import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import c from 'picocolors';

const versionTsPath = join(import.meta.dirname, '../src/lib/version.ts');
const packageJsonPath = join(import.meta.dirname, '../package.json');

const version = process.argv[2];

if (!version || !version.match(/(\d)+.(\d)+.(\d)+/g)) {
	throw new Error(`Invalid version ${version}`);
}

import { VERSION as oldVersion } from '../src/lib/version.ts';
console.log(c.blue('Karma'), c.gray(oldVersion), '->', c.green(version));

// package.json
console.log(c.yellow('i'), `${c.dim('Writing package.json')}`);
const pkg = JSON.parse(await readFile(packageJsonPath, 'utf-8'));
pkg.version = version;
await writeFile(packageJsonPath, JSON.stringify(pkg, null, 2), 'utf-8');

// version.ts
console.log(c.yellow('i'), `${c.dim('Writing version.ts')}`);
await writeFile(
	join(import.meta.dirname, '../src/lib/version.ts'),
	`export const VERSION = '${version}';\n`,
	'utf-8',
);

// commit version changes
console.log(c.yellow('i'), `${c.dim('Committing version changes')}`);
spawnSync('git', [
	'commit',
	`-m "chore(release): ${version}"`,
	packageJsonPath,
	versionTsPath,
]);

// git tag
const tag = `v${version}`;
console.log(c.yellow('i'), `${c.dim('Creating git tag')} ${c.dim(tag)}`);
spawnSync('git', ['tag', tag]);

console.log(
	c.green('✓ Done!'),
	"Don't forget to push with",
	c.bold('git push --tags'),
);
