#!/usr/bin/env node

/**
 * Postinstall script that runs prisma generate with a fallback URL
 * when POSTGRES_PRISMA_URL is not set.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Provide a placeholder URL if POSTGRES_PRISMA_URL is not set or is empty
if (!process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_PRISMA_URL === '') {
  process.env.POSTGRES_PRISMA_URL = 'postgresql://placeholder';
}

try {
  const command = 'prisma generate';
  
  // Check if we're in a pnpm workspace by looking for pnpm-lock.yaml
  const hasPnpm = fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'));
  
  if (hasPnpm) {
    execSync(`pnpm exec ${command}`, { stdio: 'inherit' });
  } else {
    execSync(`npx ${command}`, { stdio: 'inherit' });
  }
} catch (error) {
  console.error('Error running prisma generate:', error.message);
  // Exit with error code to fail the install if prisma generate fails
  process.exit(1);
}
