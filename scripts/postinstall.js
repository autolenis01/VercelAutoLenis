#!/usr/bin/env node

/**
 * Postinstall script that runs prisma generate with a fallback URL
 * when POSTGRES_PRISMA_URL is not set.
 */

const { execSync } = require('child_process');

// Provide a placeholder URL if POSTGRES_PRISMA_URL is not set or is empty
if (!process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_PRISMA_URL === '') {
  process.env.POSTGRES_PRISMA_URL = 'postgresql://placeholder';
}

try {
  // Try to use pnpm exec if available, otherwise fall back to npx
  const command = 'prisma generate';
  try {
    execSync(`pnpm exec ${command}`, { stdio: 'inherit' });
  } catch (e) {
    // If pnpm is not available, try npx
    execSync(`npx ${command}`, { stdio: 'inherit' });
  }
} catch (error) {
  console.error('Error running prisma generate:', error.message);
  process.exit(1);
}
