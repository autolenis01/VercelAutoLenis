import fs from "node:fs";

function fail(msg) {
  console.error(`\n[FAIL] ${msg}\n`);
  process.exit(1);
}

function ok(msg) {
  console.log(`[OK] ${msg}`);
}

const lockPath = "pnpm-lock.yaml";
if (!fs.existsSync(lockPath)) fail("pnpm-lock.yaml not found.");

const lock = fs.readFileSync(lockPath, "utf8");

// Very simple parse: locate a happy-dom entry with version in it
const match = lock.match(/happy-dom:\s*\n\s*specifier:.*\n\s*version:\s*([0-9]+\.[0-9]+\.[0-9]+)/m);
if (!match) fail("Could not find happy-dom version in pnpm-lock.yaml.");

const [major, minor, patch] = match[1].split(".").map(Number);
const isGte20 = major > 20 || (major === 20);

if (!isGte20) {
  fail(`happy-dom is ${match[1]} in pnpm-lock.yaml (must be >= 20.0.0)`);
}

ok(`happy-dom ${match[1]} satisfies >= 20.0.0`);
