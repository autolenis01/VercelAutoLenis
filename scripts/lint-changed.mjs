import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const run = (command, args, options = {}) =>
  spawnSync(command, args, { encoding: 'utf8', ...options });

const refExists = (ref) =>
  run('git', ['rev-parse', '--verify', ref], { stdio: 'ignore' }).status === 0;

let baseRef;

if (process.env.GITHUB_BASE_REF) {
  const baseBranch = process.env.GITHUB_BASE_REF;
  const originRef = `origin/${baseBranch}`;
  if (!refExists(originRef)) {
    run('git', ['fetch', 'origin', baseBranch, '--depth=1'], { stdio: 'ignore' });
  }
  baseRef = refExists(originRef) ? originRef : undefined;
} else {
  if (!refExists('origin/main')) {
    run('git', ['fetch', 'origin', 'main', '--depth=1'], { stdio: 'ignore' });
  }
  baseRef = refExists('origin/main') ? 'origin/main' : refExists('main') ? 'main' : undefined;
}

if (!baseRef) {
  console.warn('No base ref found for lint:changed; skipping.');
  process.exit(0);
}

const diffResult = run('git', ['diff', '--name-only', '--diff-filter=ACMRT', `${baseRef}...HEAD`]);

if (diffResult.status !== 0) {
  process.stderr.write(diffResult.stderr || 'Failed to determine changed files.\n');
  process.exit(diffResult.status ?? 1);
}

const extensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']);
const files = diffResult.stdout
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .filter((file) => extensions.has(path.extname(file)))
  .filter((file) => fs.existsSync(file));

if (files.length === 0) {
  console.log('No changed files to lint');
  process.exit(0);
}

const lintResult = run('pnpm', ['exec', 'eslint', ...files], { stdio: 'inherit' });
process.exit(lintResult.status ?? 1);
