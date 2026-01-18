import { spawnSync } from 'node:child_process';
import path from 'node:path';

const run = (command, args, options = {}) =>
  spawnSync(command, args, { encoding: 'utf8', ...options });

const hasOriginMain =
  run('git', ['rev-parse', '--verify', 'origin/main'], { stdio: 'ignore' }).status === 0;
const hasMain = run('git', ['rev-parse', '--verify', 'main'], { stdio: 'ignore' }).status === 0;

const baseRef = hasOriginMain ? 'origin/main' : hasMain ? 'main' : 'HEAD~1';

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
  .filter((file) => extensions.has(path.extname(file)));

if (files.length === 0) {
  console.log('No changed files to lint');
  process.exit(0);
}

const lintResult = run('pnpm', ['exec', 'eslint', ...files], { stdio: 'inherit' });
process.exit(lintResult.status ?? 1);
