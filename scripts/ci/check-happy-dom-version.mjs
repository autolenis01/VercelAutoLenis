#!/usr/bin/env node

/**
 * Security gate: Verify happy-dom version is >= 20.0.0
 * Prevents CVE-2024-12827 (RCE vulnerability in happy-dom < 20.0.0)
 */

import { execSync } from 'child_process'

try {
  const output = execSync('pnpm list happy-dom --json', { encoding: 'utf-8' })
  const parsed = JSON.parse(output)
  
  const happyDomVersion = parsed[0]?.devDependencies?.['happy-dom']?.version
  
  if (!happyDomVersion) {
    console.error('❌ happy-dom not found in devDependencies')
    process.exit(1)
  }
  
  console.log(`happy-dom version: ${happyDomVersion}`)
  
  // Parse version (e.g., "20.1.0" -> [20, 1, 0])
  const [major] = happyDomVersion.split('.').map(Number)
  
  if (major >= 20) {
    console.log('✅ happy-dom is patched (>= 20.0.0)')
    process.exit(0)
  } else {
    console.error('❌ happy-dom version is vulnerable (< 20.0.0)')
    console.error('Please upgrade to happy-dom >= 20.0.0')
    process.exit(1)
  }
} catch (error) {
  console.error('Error checking happy-dom version:', error.message)
  process.exit(1)
}
