#!/usr/bin/env node

/**
 * Build Safety Scanner
 * Detects common patterns that cause build failures:
 * - next/font/google usage (network call at build)
 * - Module-level fetch() calls
 * - Module-level SDK initialization (Stripe, Resend, etc.)
 * - Module-level process.env reads in lib/
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const VIOLATIONS = []

function scanFile(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  // Rule 1: Detect next/font/google (build-time network call)
  if (content.includes('next/font/google')) {
    VIOLATIONS.push({
      file: filePath,
      rule: 'NO_GOOGLE_FONTS',
      message: 'next/font/google causes build-time network call. Use local fonts or @fontsource.',
    })
  }

  // Rule 2: Detect module-level fetch() in non-API code
  if (filePath.startsWith('lib/') || filePath.startsWith('components/')) {
    lines.forEach((line, idx) => {
      if (/^(const|let|var)\s+\w+\s*=\s*fetch\(/.test(line)) {
        VIOLATIONS.push({
          file: filePath,
          line: idx + 1,
          rule: 'NO_MODULE_FETCH',
          message: 'Module-level fetch() detected. Move inside function.',
        })
      }
    })
  }

  // Rule 3: Detect module-level SDK init (new Stripe, new Resend, etc.)
  lines.forEach((line, idx) => {
    if (/^export\s+const\s+\w+\s*=\s*new\s+(Stripe|Resend|SendGrid|Supabase)/.test(line)) {
      VIOLATIONS.push({
        file: filePath,
        line: idx + 1,
        rule: 'NO_MODULE_SDK_INIT',
        message: 'Module-level SDK initialization. Use lazy getter function instead.',
      })
    }
  })

  // Rule 4: Detect module-level process.env access in lib/
  if (filePath.startsWith('lib/') && !filePath.includes('lib/env.ts')) {
    lines.forEach((line, idx) => {
      if (/^(export\s+)?(const|let|var)\s+\w+\s*=\s*process\.env\./.test(line)) {
        VIOLATIONS.push({
          file: filePath,
          line: idx + 1,
          rule: 'NO_MODULE_ENV_READ',
          message: 'Module-level process.env read. Use lazy initialization or lib/env.ts.',
        })
      }
    })
  }
}

function scanDir(dir) {
  const entries = readdirSync(dir)
  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    
    if (stat.isDirectory()) {
      if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(entry)) {
        scanDir(fullPath)
      }
    } else if (stat.isFile() && /\.(ts|tsx|js|jsx|mjs)$/.test(entry)) {
      scanFile(fullPath)
    }
  }
}

console.log('🔍 Scanning for build-unsafe patterns...\n')

scanDir('lib')
scanDir('app')
scanDir('components')

if (VIOLATIONS.length === 0) {
  console.log('✅ No build-safety violations detected.\n')
  process.exit(0)
} else {
  console.error(`❌ Found ${VIOLATIONS.length} build-safety violation(s):\n`)
  VIOLATIONS.forEach((v, i) => {
    console.error(`${i + 1}. [${v.rule}] ${v.file}${v.line ? `:${v.line}` : ''}`)
    console.error(`   ${v.message}\n`)
  })
  process.exit(1)
}
