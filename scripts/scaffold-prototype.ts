#!/usr/bin/env node
import { input, select, confirm } from '@inquirer/prompts'
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// Available Phosphor icons for prototypes
const iconOptions = [
  { name: 'Sparkle ✨', value: 'Sparkle' },
  { name: 'Cube 📦', value: 'Cube' },
  { name: 'Rocket 🚀', value: 'Rocket' },
  { name: 'Lightning ⚡', value: 'Lightning' },
  { name: 'Star ⭐', value: 'Star' },
  { name: 'Heart ❤️', value: 'Heart' },
  { name: 'Target 🎯', value: 'Target' },
  { name: 'Trophy 🏆', value: 'Trophy' },
  { name: 'Palette 🎨', value: 'Palette' },
  { name: 'Code 💻', value: 'Code' },
  { name: 'Desktop 🖥️', value: 'Desktop' },
  { name: 'Layout 📐', value: 'Layout' },
]

async function main() {
  console.log('\n🎨 Proto Template - New Prototype Scaffolder\n')

  // Get prototype ID
  const prototypeId = await input({
    message: 'Prototype ID (e.g., "prototype-3"):',
    validate: (value) => {
      if (!value.match(/^prototype-\d+$/)) {
        return 'ID must be in format: prototype-{number}'
      }
      const protoPath = join(projectRoot, 'src', 'prototypes', value)
      if (existsSync(protoPath)) {
        return `Prototype "${value}" already exists!`
      }
      return true
    },
  })

  const prototypeNumber = prototypeId.split('-')[1]

  // Get prototype details
  const name = await input({
    message: 'Prototype name:',
    validate: (value) => value.length > 0 || 'Name is required',
  })

  const description = await input({
    message: 'Short description:',
    validate: (value) => value.length > 0 || 'Description is required',
  })

  const icon = await select({
    message: 'Choose an icon:',
    choices: iconOptions,
  })

  const prototypeType = await select({
    message: 'Prototype type:',
    choices: [
      { name: 'Multi-page Flow (with routing, state management)', value: 'multi-page' },
      { name: 'Single-page Component (simpler structure)', value: 'single-page' },
    ],
  })

  const hasLoom = await confirm({
    message: 'Add Loom video link?',
    default: false,
  })

  let loomUrl = ''
  if (hasLoom) {
    loomUrl = await input({
      message: 'Loom URL:',
      validate: (value) => {
        if (!value.startsWith('http')) {
          return 'Please enter a valid URL'
        }
        return true
      },
    })
  }

  console.log('\n📝 Generating prototype files...\n')

  // Create prototype directory structure
  const protoPath = join(projectRoot, 'src', 'prototypes', prototypeId)
  mkdirSync(protoPath, { recursive: true })

  if (prototypeType === 'multi-page') {
    generateMultiPagePrototype(prototypeId, prototypeNumber, name, description)
  } else {
    generateSinglePagePrototype(prototypeId, prototypeNumber, name, description)
  }

  // Update App.tsx with new route
  updateAppRoutes(prototypeId, prototypeNumber, prototypeType)

  // Update LandingPage.tsx with new card
  updateLandingPage(prototypeId, name, description, icon, loomUrl)

  // Create documentation stub
  createDocumentation(prototypeId, name, description)

  console.log('✅ Prototype scaffolded successfully!\n')
  console.log(`📁 Files created in: src/prototypes/${prototypeId}/`)
  console.log(`📄 Documentation: public/docs/prototypes/${prototypeId}.md`)
  console.log(`🔗 Route added: /${prototypeId}`)
  console.log('\n🚀 Next steps:')
  console.log('   1. Run: npm run dev')
  console.log(`   2. Visit: http://localhost:5173/${prototypeId}`)
  console.log('   3. Edit the generated files to build your prototype')
  console.log('   4. Update documentation with details from Figma\n')
}

function generateMultiPagePrototype(id: string, num: string, name: string, description: string) {
  const protoPath = join(projectRoot, 'src', 'prototypes', id)
  const componentName = `Prototype${num}`
  const prefix = `proto${num}`

  // Create directory structure
  mkdirSync(join(protoPath, `${prefix}-pages`), { recursive: true })
  mkdirSync(join(protoPath, `${prefix}-components`, 'layout'), { recursive: true })
  mkdirSync(join(protoPath, `${prefix}-components`, 'core'), { recursive: true })
  mkdirSync(join(protoPath, `${prefix}-styles`), { recursive: true })
  mkdirSync(join(protoPath, `${prefix}-types`), { recursive: true })
  mkdirSync(join(protoPath, `${prefix}-utils`), { recursive: true })

  // Main component file
  writeFileSync(
    join(protoPath, `${componentName}.tsx`),
    `import { Routes, Route, Navigate } from 'react-router-dom'
import { FlowProvider } from './${prefix}-components/layout/FlowProvider'
import FlowContainer from './${prefix}-components/layout/FlowContainer'
import WelcomePage from './${prefix}-pages/WelcomePage'
import './${prefix}-styles/theme.css'

export default function ${componentName}() {
  return (
    <FlowProvider>
      <FlowContainer>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="*" element={<Navigate to="/${id}" replace />} />
        </Routes>
      </FlowContainer>
    </FlowProvider>
  )
}
`
  )

  // Welcome page
  writeFileSync(
    join(protoPath, `${prefix}-pages`, 'WelcomePage.tsx'),
    `import { Box, Container, Heading, Text, Button, Flex } from '@radix-ui/themes'
import { ArrowRight } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <Container size="2">
      <Flex direction="column" align="center" gap="6" style={{ paddingTop: 'var(--space-9)' }}>
        <Box style={{ textAlign: 'center' }}>
          <Heading size="8" mb="3" style={{ color: 'var(--gray-12)' }}>
            ${name}
          </Heading>
          <Text size="4" style={{ color: 'var(--gray-11)' }}>
            ${description}
          </Text>
        </Box>

        <Button size="3" onClick={() => navigate('/')}>
          <ArrowRight size={20} weight="bold" />
          Get Started
        </Button>
      </Flex>
    </Container>
  )
}
`
  )

  // FlowProvider
  writeFileSync(
    join(protoPath, `${prefix}-components`, 'layout', 'FlowProvider.tsx'),
    `import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const STORAGE_KEY = '${prefix}-flow-state'

interface FlowState {
  currentStep: number
  // Add your state properties here
}

interface FlowContextType {
  state: FlowState
  updateState: (updates: Partial<FlowState>) => void
  resetFlow: () => void
}

const FlowContext = createContext<FlowContextType | undefined>(undefined)

const initialState: FlowState = {
  currentStep: 0,
}

export function FlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FlowState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return initialState
      }
    }
    return initialState
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const updateState = (updates: Partial<FlowState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  const resetFlow = () => {
    setState(initialState)
  }

  return (
    <FlowContext.Provider value={{ state, updateState, resetFlow }}>
      {children}
    </FlowContext.Provider>
  )
}

export function useFlow() {
  const context = useContext(FlowContext)
  if (!context) {
    throw new Error('useFlow must be used within FlowProvider')
  }
  return context
}

export function clear${componentName}State() {
  localStorage.removeItem(STORAGE_KEY)
}
`
  )

  // FlowContainer
  writeFileSync(
    join(protoPath, `${prefix}-components`, 'layout', 'FlowContainer.tsx'),
    `import { Box } from '@radix-ui/themes'
import { ReactNode } from 'react'

export default function FlowContainer({ children }: { children: ReactNode }) {
  return (
    <Box style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-background)',
    }}>
      {children}
    </Box>
  )
}
`
  )

  // Theme CSS
  writeFileSync(
    join(protoPath, `${prefix}-styles`, 'theme.css'),
    `/* ${name} - Custom Styles */

/* Always use Radix variables - never hardcode values */

.${prefix}-container {
  padding: var(--space-6);
  max-width: 1200px;
  margin: 0 auto;
}

.${prefix}-card {
  background: var(--gray-2);
  border: 1px solid var(--gray-6);
  border-radius: var(--radius-3);
  padding: var(--space-5);
  box-shadow: var(--shadow-2);
}

.${prefix}-button-primary {
  background-color: var(--accent-9);
  color: white;
}

/* Add more custom styles using Radix variables */
`
  )

  console.log(`  ✓ Multi-page prototype structure created`)
}

function generateSinglePagePrototype(id: string, num: string, name: string, description: string) {
  const protoPath = join(projectRoot, 'src', 'prototypes', id)
  const componentName = `Proto${num}`

  // Main component file
  writeFileSync(
    join(protoPath, 'index.tsx'),
    `import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Heading, Text, Button, Card, Flex } from '@radix-ui/themes'
import { ArrowLeft } from '@phosphor-icons/react'
import styles from './${componentName}.module.css'

export default function ${componentName}() {
  const navigate = useNavigate()
  const [state, setState] = useState({
    // Add your state here
  })

  return (
    <Box className={styles.container}>
      <Container size="3">
        <Flex direction="column" gap="6">
          {/* Header */}
          <Button
            variant="ghost"
            size="2"
            onClick={() => navigate('/')}
            style={{ alignSelf: 'flex-start' }}
          >
            <ArrowLeft size={20} weight="bold" />
            Back to Home
          </Button>

          {/* Content */}
          <Box style={{ textAlign: 'center' }}>
            <Heading size="8" mb="3">
              ${name}
            </Heading>
            <Text size="4" style={{ color: 'var(--gray-11)' }}>
              ${description}
            </Text>
          </Box>

          {/* Your prototype content here */}
          <Card className={styles.card} size="4">
            <Heading size="5" mb="3">
              Start building your prototype
            </Heading>
            <Text size="3">
              This is a single-page prototype template. Add your components and interactions here.
            </Text>
          </Card>
        </Flex>
      </Container>
    </Box>
  )
}
`
  )

  // CSS Module
  writeFileSync(
    join(protoPath, `${componentName}.module.css`),
    `/* ${name} - Component Styles */

.container {
  min-height: 100vh;
  background-color: var(--color-background);
  padding: var(--space-6);
}

.card {
  background: var(--gray-2);
  border: 1px solid var(--gray-6);
  box-shadow: var(--shadow-3);
}

/* Always use Radix CSS custom properties */
/* Example variables:
 * Colors: var(--gray-1) through var(--gray-12), var(--accent-9)
 * Spacing: var(--space-1) through var(--space-9)
 * Radii: var(--radius-1) through var(--radius-6)
 * Shadows: var(--shadow-1) through var(--shadow-6)
 */
`
  )

  console.log(`  ✓ Single-page prototype structure created`)
}

function updateAppRoutes(id: string, num: string, type: string) {
  const appPath = join(projectRoot, 'src', 'App.tsx')
  let content = readFileSync(appPath, 'utf-8')

  const componentName = `Prototype${num}`
  const importPath = type === 'multi-page'
    ? `./prototypes/${id}/${componentName}`
    : `./prototypes/${id}`

  // Add import
  const lazyImportLine = `const ${componentName} = lazy(() => import('${importPath}'))`
  const importSection = content.match(/const Prototype\d+ = lazy\([^)]+\)\n/g)
  if (importSection) {
    const lastImport = importSection[importSection.length - 1]
    content = content.replace(lastImport, lastImport + lazyImportLine + '\n')
  }

  // Add route
  const routePath = type === 'multi-page' ? `/${id}/*` : `/${id}`
  const routeLine = `        <Route path="${routePath}" element={<${componentName} />} />`

  const routeMatch = content.match(/(\s+)<Route path="\/prototype-\d+[^"]*" element={<Prototype\d+ \/>} \/>/g)
  if (routeMatch) {
    const lastRoute = routeMatch[routeMatch.length - 1]
    content = content.replace(lastRoute, lastRoute + '\n' + routeLine)
  }

  writeFileSync(appPath, content)
  console.log(`  ✓ Route added to App.tsx`)
}

function updateLandingPage(id: string, name: string, description: string, icon: string, loomUrl: string) {
  const landingPath = join(projectRoot, 'src', 'components', 'LandingPage.tsx')
  let content = readFileSync(landingPath, 'utf-8')

  // Add icon import if not already present
  if (!content.includes(`import { ${icon} }`)) {
    content = content.replace(
      /import { ([^}]+) } from '@phosphor-icons\/react'/,
      `import { $1, ${icon} } from '@phosphor-icons/react'`
    )
  }

  // Add prototype data entry
  const newEntry = `  {
    id: '${id}',
    title: '${name}',
    description: '${description}',
    icon: ${icon},
    route: '/${id}'${loomUrl ? `,\n    loomUrl: '${loomUrl}'` : ''}
  }`

  const dataArrayMatch = content.match(/const prototypeData[^=]*=\s*\[([\s\S]*?)\]/m)
  if (dataArrayMatch) {
    const existingEntries = dataArrayMatch[1]
    const newDataArray = `const prototypeData: Omit<PrototypeCard, 'lastUpdated'>[] = [\n${existingEntries},\n${newEntry}\n]`
    content = content.replace(/const prototypeData[^=]*=\s*\[[^\]]*\]/, newDataArray)
  }

  writeFileSync(landingPath, content)
  console.log(`  ✓ Card added to LandingPage.tsx`)
}

function createDocumentation(id: string, name: string, description: string) {
  const docsPath = join(projectRoot, 'public', 'docs', 'prototypes', `${id}.md`)

  const docContent = `# ${name}

## Overview

${description}

## Problem Statement

[Describe the problem this prototype solves]

## Goal

[What should users accomplish with this prototype?]

## Workflow

1. [Step 1]
2. [Step 2]
3. [Step 3]

## Key Features

- Feature 1
- Feature 2
- Feature 3

## Technical Implementation

[Describe the technical approach]

## Limitations

- Limitation 1
- Limitation 2

## Figma Design

Design files and specifications would be linked here when available.

[Link to Figma file]

## Version History

- **${new Date().toISOString().split('T')[0]}** - Initial prototype created
`

  writeFileSync(docsPath, docContent)
  console.log(`  ✓ Documentation stub created`)
}

main().catch((error) => {
  console.error('\n❌ Error:', error.message)
  process.exit(1)
})
