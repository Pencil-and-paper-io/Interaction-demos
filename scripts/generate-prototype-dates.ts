import { execSync } from 'child_process'
import { writeFileSync, mkdirSync, readdirSync } from 'fs'
import { join } from 'path'

// Auto-discover all prototype directories
const prototypesDir = join(process.cwd(), 'src', 'prototypes')
let prototypeIds: string[] = []

try {
  const entries = readdirSync(prototypesDir, { withFileTypes: true })
  prototypeIds = entries
    .filter(entry => entry.isDirectory() && entry.name.startsWith('prototype-'))
    .map(entry => entry.name)
} catch (error) {
  console.log('No prototypes directory found yet, creating empty dates file...')
}

const dates: Record<string, string> = {}

prototypeIds.forEach(protoId => {
  try {
    // Get the last commit date for files in the prototype directory
    const command = `git log -1 --format=%cI -- "src/prototypes/${protoId}/"`
    const output = execSync(command, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim()

    if (output) {
      dates[protoId] = output
    } else {
      // If no commits found, use current date as fallback
      dates[protoId] = new Date().toISOString()
    }
  } catch (error) {
    // If git command fails or directory doesn't exist, use current date
    dates[protoId] = new Date().toISOString()
  }
})

// Ensure the data directory exists
const dataDir = join(process.cwd(), 'src', 'data')
mkdirSync(dataDir, { recursive: true })

// Write the JSON file
const outputPath = join(dataDir, 'prototype-dates.json')
writeFileSync(outputPath, JSON.stringify(dates, null, 2))

console.log('✓ Prototype dates generated successfully:')
console.log(JSON.stringify(dates, null, 2))
console.log(`\nWritten to: ${outputPath}`)
