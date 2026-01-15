#!/usr/bin/env node
import { readdirSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

const SCREENSHOT_DIR = join(projectRoot, 'public', 'screenshots')

console.log('\n📷 Screenshot Capture Tool\n')

// Ensure screenshots directory exists
if (!existsSync(SCREENSHOT_DIR)) {
  mkdirSync(SCREENSHOT_DIR, { recursive: true })
  console.log(`✓ Created screenshots directory: ${SCREENSHOT_DIR}\n`)
}

// Discover prototypes
const prototypesDir = join(projectRoot, 'src', 'prototypes')
let prototypeIds: string[] = []

try {
  const entries = readdirSync(prototypesDir, { withFileTypes: true })
  prototypeIds = entries
    .filter(entry => entry.isDirectory() && entry.name.startsWith('prototype-'))
    .map(entry => entry.name)
} catch (error) {
  console.error('❌ Could not read prototypes directory:', (error as Error).message)
  process.exit(1)
}

if (prototypeIds.length === 0) {
  console.log('ℹ️  No prototypes found')
  process.exit(0)
}

console.log(`Found ${prototypeIds.length} prototype(s): ${prototypeIds.join(', ')}\n`)
console.log('📸 How to capture screenshots:\n')
console.log('Option 1: Using Claude Code (Recommended)')
console.log('  Ask Claude Code to capture screenshots of all prototypes using Playwright MCP')
console.log('  Example: "Capture screenshots of all prototypes at 1200x800"\n')

console.log('Option 2: Using Playwright CLI (if browsers installed)')
console.log('  First install: npx playwright install chromium')
console.log('  Then run this script with --capture flag\n')

console.log('Option 3: Manual capture')
console.log('  1. Run: npm run dev')
console.log('  2. Open each prototype in your browser')
console.log('  3. Take screenshots (1200x800px recommended)')
console.log('  4. Save to: public/screenshots/{prototype-id}.png\n')

console.log('Prototype URLs:')
prototypeIds.forEach(id => {
  console.log(`  • http://localhost:5173/${id} → ${SCREENSHOT_DIR}/${id}.png`)
})

console.log('\n💡 Screenshots are displayed on prototype cards on the landing page')
console.log('📁 Target directory:', SCREENSHOT_DIR, '\n')
