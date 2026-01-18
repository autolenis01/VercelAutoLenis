#!/usr/bin/env node

/**
 * Navigation gate: Check for broken internal links and missing routes
 * Scans TypeScript/JavaScript files for Link components and validates routes exist
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { join } from 'path'

const INTERNAL_LINKS = new Set()
const VIOLATIONS = []

function scanForLinks(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  
  // Match <Link href="/path"> patterns
  const linkPattern = /<Link[^>]+href=["']([^"']+)["']/g
  let match
  
  while ((match = linkPattern.exec(content)) !== null) {
    const href = match[1]
    
    // Only check internal links (starting with /)
    if (href.startsWith('/') && !href.startsWith('//')) {
      // Remove query params and hash
      const cleanPath = href.split('?')[0].split('#')[0]
      INTERNAL_LINKS.add(cleanPath)
    }
  }
}

function scanDirectory(dir) {
  const entries = readdirSync(dir)
  
  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    
    if (stat.isDirectory()) {
      if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(entry)) {
        scanDirectory(fullPath)
      }
    } else if (stat.isFile() && /\.(tsx?|jsx?)$/.test(entry)) {
      scanForLinks(fullPath)
    }
  }
}

function checkRouteExists(route) {
  // Remove leading slash
  const routePath = route.substring(1)
  
  if (!routePath) {
    // Root route always exists
    return true
  }
  
  // Check if app directory route exists
  const appRoutePath = join('app', routePath)
  
  // Check for page.tsx, page.ts, route.tsx, route.ts
  const possibleFiles = [
    join(appRoutePath, 'page.tsx'),
    join(appRoutePath, 'page.ts'),
    join(appRoutePath, 'route.tsx'),
    join(appRoutePath, 'route.ts'),
  ]
  
  for (const file of possibleFiles) {
    if (existsSync(file)) {
      return true
    }
  }
  
  // Check if it's a directory with an index
  if (existsSync(appRoutePath) && statSync(appRoutePath).isDirectory()) {
    return true // Directory exists, likely has nested routes
  }
  
  return false
}

console.log('🔍 Scanning for internal links...\n')

// Scan all app and components
scanDirectory('app')
scanDirectory('components')

console.log(`Found ${INTERNAL_LINKS.size} internal links\n`)

// Check each link
for (const link of INTERNAL_LINKS) {
  if (!checkRouteExists(link)) {
    VIOLATIONS.push({
      route: link,
      message: `Route ${link} referenced in Link component but no corresponding page/route found`,
    })
  }
}

if (VIOLATIONS.length === 0) {
  console.log('✅ All internal links are valid\n')
  process.exit(0)
} else {
  console.warn(`⚠️  Found ${VIOLATIONS.length} potentially broken link(s):\n`)
  VIOLATIONS.forEach((v, i) => {
    console.warn(`${i + 1}. ${v.route}`)
    console.warn(`   ${v.message}\n`)
  })
  // Exit 0 for now (warnings only, not blocking)
  console.log('Note: These are warnings only and do not block the build.\n')
  process.exit(0)
}
