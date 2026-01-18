import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const run = (command, args, options = {}) =>
  spawnSync(command, args, { encoding: 'utf8', ...options });

const refExists = (ref) =>
  run('git', ['rev-parse', '--verify', ref], { stdio: 'ignore' }).status === 0;
const fetchBranch = (branch) =>
  run('git', ['fetch', 'origin', branch, '--depth=1'], { stdio: 'ignore' }).status === 0;

const loadEventPayload = () => {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) {
    return undefined;
  }
  try {
    return JSON.parse(fs.readFileSync(eventPath, 'utf8'));
  } catch {
    return undefined;
  }
};

const eventPayload = loadEventPayload();
const eventName = process.env.GITHUB_EVENT_NAME;

let baseRef;

if (eventName === 'pull_request' || eventName === 'pull_request_target') {
  const baseSha = process.env.GITHUB_BASE_SHA || eventPayload?.pull_request?.base?.sha;
  if (baseSha) {
    baseRef = baseSha;
  } else {
    const baseBranch = process.env.GITHUB_BASE_REF || eventPayload?.pull_request?.base?.ref;
    if (baseBranch) {
      const originRef = `origin/${baseBranch}`;
      if (!refExists(originRef)) {
        if (!fetchBranch(baseBranch)) {
          console.warn(`Failed to fetch ${originRef}; skipping lint:changed.`);
          process.exit(0);
        }
      }
      baseRef = refExists(originRef) ? originRef : undefined;
    }
  }
} else if (eventName === 'push') {
  const beforeSha = process.env.GITHUB_BEFORE || eventPayload?.before;
  if (beforeSha && !/^0+$/.test(beforeSha)) {
    baseRef = beforeSha;
  } else if (refExists('HEAD~1')) {
    baseRef = 'HEAD~1';
  }
} else {
  if (!refExists('origin/main')) {
    if (!fetchBranch('main')) {
      console.warn('Failed to fetch origin/main; skipping lint:changed.');
      process.exit(0);
    }
  }
  baseRef = refExists('origin/main') ? 'origin/main' : refExists('main') ? 'main' : undefined;
}

if (!baseRef) {
  console.warn('No base ref found for lint:changed; skipping.');
  process.exit(0);
}

console.log(`lint:changed base ref: ${baseRef}`);

const diffResult = run('git', ['diff', '--name-only', `${baseRef}...HEAD`]);

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
  console.log('lint:changed files: 0');
  console.log('No changed files to lint');
  process.exit(0);
}

console.log(`lint:changed files: ${files.length}`);

const lintResult = run('pnpm', ['exec', 'eslint', ...files], { stdio: 'inherit' });
process.exit(lintResult.status ?? 1);
