# Proto Template - Guide for Claude Code

## Your Role

You are Claude Code helping designers build interactive prototypes rapidly. This is a **template repository** for creating isolated design prototypes, not production code. Your goal is to help designers translate their Figma designs into working, interactive prototypes that demonstrate concepts, gather feedback, and serve as specifications.

## Core Principles

- ✅ **Template for rapid prototyping** - Speed and design fidelity over production polish
- ✅ **Prototype isolation is non-negotiable** - Each prototype must be completely independent
- ✅ **Radix variables exclusively** - Never use raw pixel values or hex codes
- ✅ **Figma MCP auto-inspection** - Always extract design details when Figma links provided
- ✅ **Documentation is mandatory** - Every prototype needs context and purpose documented
- ❌ **NOT production code** - Don't over-engineer, don't add unnecessary features
- ⚠️ **Per-prototype styles** - Each proto has its own CSS file for complete isolation

## Quick Start Checklist

When starting any prototype task:

1. ✅ Check Figma MCP is connected (`mcp__figma__*` tools available)
2. ✅ Understand prototype purpose and audience (client demo, internal feedback, etc.)
3. ✅ Search for similar prototypes (patterns to reuse):
   ```bash
   rg "FlowProvider" src/prototypes/     # Multi-page flows
   rg "CSS Module" src/prototypes/       # Styling patterns
   rg "Phosphor" src/prototypes/         # Icon usage
   ```
4. ✅ Choose prototype type (multi-page flow vs single-page)
5. ✅ Create prototype (CLI: `npm run new-proto` OR ask me to create it)
6. ✅ Extract Figma design details using MCP
7. ✅ Map Figma values to Radix variables
8. ✅ Build prototype matching design
9. ✅ Generate documentation
10. ✅ Capture screenshot

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (Vite) |
| `npm run build` | Generate dates, compile TypeScript, build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build locally |
| `npm run generate-dates` | Generate prototype-dates.json from git history |
| `npm run screenshots` | Capture screenshots of all prototypes (Playwright) |
| `npm run new-proto` | Interactive CLI to scaffold a new prototype |

**Important:** The build command automatically runs `generate-dates` to update last modified timestamps.

## Architecture Overview

```
proto-template/
├── public/
│   └── screenshots/              # Auto-generated prototype screenshots
├── scripts/
│   ├── generate-prototype-dates.ts  # Extract git dates
│   ├── capture-screenshots.ts       # Playwright automation
│   └── scaffold-prototype.ts        # CLI scaffolding tool
├── src/
│   ├── main.tsx                  # Entry with Radix Theme provider
│   ├── App.tsx                   # Router with lazy-loaded routes
│   ├── index.css                 # Global styles
│   ├── data/
│   │   └── prototype-dates.json  # Generated: last update dates
│   ├── utils/
│   │   └── relativeTime.ts       # Format dates ("2 days ago")
│   ├── components/
│   │   ├── LandingPage.tsx       # Main grid with prototype cards
│   │   └── ThemeToggle.tsx       # Light/dark mode toggle
│   └── prototypes/
│       ├── prototype-1/          # Multi-page flow example
│       │   ├── Prototype1.tsx    # Main component with Routes
│       │   ├── proto1-pages/     # Page components
│       │   ├── proto1-components/
│       │   │   ├── core/         # UI components
│       │   │   ├── layout/       # FlowProvider, Container
│       │   │   └── feedback/     # ErrorBoundary
│       │   ├── proto1-hooks/     # Custom hooks
│       │   ├── proto1-types/     # TypeScript types
│       │   ├── proto1-utils/     # Utils and mock data
│       │   └── proto1-styles/    # Per-prototype CSS
│       └── prototype-2/          # Single-page example
│           ├── index.tsx          # Single component
│           └── Proto2.module.css  # CSS Module
├── docs/
│   └── prototypes/               # Documentation for each prototype
├── .github/workflows/
│   └── deploy.yml                # CI/CD to GitHub Pages
└── CLAUDE.md                     # This file
```

### Routing Architecture

**App-level routing** (`App.tsx`):
- `/` → LandingPage (grid of all prototypes)
- `/prototype-{n}/*` → Lazy-loaded prototype with wildcard for nested routes

**Prototype-level routing** (inside `Prototype{N}.tsx`):
- Multi-page flows use nested `<Routes>` for internal navigation
- Single-page prototypes don't need internal routing

## Quick Reference Tables

### When To Use Each Pattern

| When To Use | Prototype Type | Location Pattern |
|-------------|----------------|------------------|
| Multi-step workflow, wizard | Multi-page flow | `Prototype{N}.tsx` + `proto{N}-pages/` |
| Single screen, component showcase | Single-page | `index.tsx` + CSS Module |
| Complex state, multi-step forms | Multi-page flow | FlowProvider context + localStorage |
| Simple interaction, no state | Single-page | Local useState |

### File Naming Conventions

| File/Folder | Purpose | Naming Rule | Example |
|-------------|---------|-------------|---------|
| `proto{N}-pages/` | Flow pages | PascalCase + Page.tsx | `WelcomePage.tsx` |
| `proto{N}-components/` | UI components | PascalCase.tsx | `Button.tsx` |
| `proto{N}-styles/` | CSS/theme | lowercase.css | `theme.css` |
| `proto{N}-hooks/` | Custom hooks | use + PascalCase.ts | `useFlow.ts` |
| `proto{N}-types/` | TypeScript types | lowercase.ts | `index.ts` |
| `proto{N}-utils/` | Utilities | camelCase.ts | `helpers.ts` |

## Figma MCP Workflow (CRITICAL)

**WHEN:** Figma link detected in conversation
**THEN:** Follow this exact sequence:

```
1. Use mcp__figma__get_metadata
   → Get file name, key, description

2. Use mcp__figma__get_design_context
   → Extract components, frames, design tokens

3. Use mcp__figma__get_screenshot (optional)
   → Visual reference if needed

4. Map ALL values to Radix variables:
   Colors     → var(--gray-12), var(--accent-9), etc.
   Spacing    → var(--space-4), var(--space-6), etc.
   Radii      → var(--radius-2), var(--radius-3), etc.
   Typography → var(--font-size-3), var(--line-height-3), etc.
   Shadows    → var(--shadow-2), var(--shadow-4), etc.

5. Ask designer for documentation context:
   - Problem statement (what problem does this solve?)
   - Goal (what should users accomplish?)
   - Workflow (step-by-step user journey)
   - Limitations (what's not included, known issues)

6. Generate markdown documentation with extracted details
```

**Conversion Examples:**
```
Figma: #000000       → Radix: var(--gray-12)
Figma: #FFFFFF       → Radix: var(--gray-1)
Figma: 16px padding  → Radix: var(--space-4)
Figma: 24px padding  → Radix: var(--space-6)
Figma: 8px radius    → Radix: var(--radius-3)
Figma: Bold text     → Radix: var(--font-weight-bold)
```

## Critical Rules (Non-Negotiable)

### ✅ ALWAYS

- **ALWAYS use Radix UI variables** for colors, spacing, typography, shadows
- **ALWAYS prefix prototype files** with `proto{N}-` for isolation
- **ALWAYS generate documentation** when creating prototypes
- **ALWAYS use Figma MCP tools** when Figma links provided (all 3 tools)
- **ALWAYS call clearProto{N}State()** from LandingPage when adding new prototypes
- **ALWAYS use lazy loading** for prototype routes in App.tsx
- **ALWAYS add screenshots** to cards (placeholder icon initially)

### ❌ NEVER

- **NEVER use raw pixel values** → Convert to `var(--space-*)` tokens
- **NEVER use hex codes** → Convert to `var(--gray-*)`, `var(--accent-*)` tokens
- **NEVER share code between prototypes** unless explicitly requested
- **NEVER create a shared components folder** (breaks isolation)
- **NEVER import Radix components directly** if you need customization (create custom instead)
- **NEVER skip documentation** when creating a prototype

### ⚠️ ALWAYS ISOLATE

- Each prototype has its own `proto{N}-styles/theme.css` file
- State management is per-prototype with unique localStorage keys
- Components are prefixed and isolated within prototype folder
- No cross-prototype imports or dependencies

## Common Pitfalls to Avoid

### 1. Hardcoding Values Instead of Radix Variables

❌ **Wrong:**
```css
.container {
  padding: 16px;
  color: #000000;
  background: #ffffff;
  border-radius: 8px;
  font-size: 14px;
}
```

✅ **Correct:**
```css
.container {
  padding: var(--space-4);
  color: var(--gray-12);
  background: var(--color-background);
  border-radius: var(--radius-3);
  font-size: var(--font-size-2);
}
```

### 2. Breaking Prototype Isolation

❌ **Wrong:**
```tsx
// Importing from another prototype
import { Button } from '../prototype-1/proto1-components/core/Button'
```

✅ **Correct:**
```tsx
// Create your own component or use Radix UI directly
import { Button } from '@radix-ui/themes'
```

### 3. Forgetting to Clear State

❌ **Wrong:**
```tsx
// LandingPage.tsx - not clearing prototype state
export default function LandingPage() {
  // No useEffect to clear state
}
```

✅ **Correct:**
```tsx
// LandingPage.tsx - clearing all prototype states
import { clearProto1State } from '../prototypes/prototype-1/proto1-components/layout/FlowProvider'

export default function LandingPage() {
  useEffect(() => {
    clearProto1State()
    // Add more clear functions as prototypes are added
  }, [])
}
```

### 4. Not Using Figma MCP Tools

❌ **Wrong:**
```
Designer: "Here's the Figma link: https://figma.com/file/..."
Claude: "I'll build this based on the screenshot"
```

✅ **Correct:**
```
Designer: "Here's the Figma link: https://figma.com/file/..."
Claude: [Uses mcp__figma__get_metadata, get_design_context, get_screenshot]
Claude: "I've extracted the design. Colors map to Radix variables: ..."
```

### 5. Skipping Loom URL When Provided

❌ **Wrong:**
```tsx
// Not adding loomUrl to prototype card
{
  id: 'prototype-3',
  title: 'New Feature',
  // Missing loomUrl field
}
```

✅ **Correct:**
```tsx
{
  id: 'prototype-3',
  title: 'New Feature',
  loomUrl: 'https://www.loom.com/share/abc123',
}
```

## Radix Variable Reference

### Colors (Light/Dark Mode Compatible)

```css
/* Gray scale */
var(--gray-1)    /* Lightest background */
var(--gray-2)    /* Subtle background */
var(--gray-3)    /* UI element background */
var(--gray-6)    /* Borders */
var(--gray-9)    /* Solid colors */
var(--gray-11)   /* Secondary text */
var(--gray-12)   /* Primary text */

/* Accent colors */
var(--accent-3)  /* Subtle accent background */
var(--accent-9)  /* Primary accent (buttons, links) */
var(--accent-10) /* Hover state */
var(--accent-11) /* Active/pressed state */

/* Semantic colors */
var(--red-9), var(--red-11)      /* Errors */
var(--green-9), var(--green-11)  /* Success */
var(--yellow-9), var(--yellow-11) /* Warnings */
var(--blue-9), var(--blue-11)     /* Info */
```

### Spacing Scale

```css
var(--space-1)  /* 4px - Tiny gaps */
var(--space-2)  /* 8px - Small gaps, button padding */
var(--space-3)  /* 12px - Default gaps */
var(--space-4)  /* 16px - Standard padding */
var(--space-5)  /* 20px - Medium spacing */
var(--space-6)  /* 24px - Large padding */
var(--space-7)  /* 28px */
var(--space-8)  /* 32px */
var(--space-9)  /* 36px - Extra large spacing */
```

### Border Radius

```css
var(--radius-1) /* 2px - Subtle */
var(--radius-2) /* 4px - Small */
var(--radius-3) /* 6px - Medium (most common) */
var(--radius-4) /* 8px - Large */
var(--radius-5) /* 12px - Extra large */
var(--radius-full) /* 9999px - Fully rounded */
```

### Typography

```css
/* Font sizes */
var(--font-size-1)  /* 12px */
var(--font-size-2)  /* 14px - Body text */
var(--font-size-3)  /* 16px - Large body */
var(--font-size-6)  /* 24px - Headings */
var(--font-size-8)  /* 36px - Large headings */

/* Font weights */
var(--font-weight-regular) /* 400 */
var(--font-weight-medium)  /* 500 */
var(--font-weight-bold)    /* 700 */

/* Line heights */
var(--line-height-2) /* 1.5 */
var(--line-height-3) /* 1.6 */
```

### Shadows

```css
var(--shadow-1) /* Subtle */
var(--shadow-2) /* Small elevation */
var(--shadow-3) /* Medium elevation */
var(--shadow-4) /* High elevation */
var(--shadow-5) /* Very high elevation */
```

### Other Tokens

```css
var(--color-background)    /* Page background */
var(--default-font-family) /* System font stack */
```

## Adding New Prototypes

### Method 1: CLI Scaffold (Recommended for Quick Setup)

```bash
npm run new-proto
```

This interactive command will:
1. Ask for prototype number
2. Ask for title and description
3. Ask to choose prototype type (multi-page flow or single-page)
4. Ask for icon from Phosphor Icons
5. Ask for optional Loom URL
6. Generate all necessary files and folders
7. Add route to App.tsx
8. Add card entry to LandingPage.tsx
9. Update date generation script
10. Create documentation stub

### Method 2: LLM-Assisted (Recommended for Complex Prototypes)

Just ask me! For example:

```
"Create a new prototype for the user onboarding flow. It needs 3 steps:
account setup, profile creation, and confirmation. Use the multi-page
pattern with FlowProvider."
```

I will:
1. Check Figma MCP connection
2. Ask for Figma link if you have one
3. Extract design details using MCP
4. Create the complete prototype structure
5. Map all styles to Radix variables
6. Generate documentation
7. Update all necessary files

**When I create a prototype, I will:**
- Create the prototype directory structure
- Add route to App.tsx with lazy loading
- Add card entry to LandingPage.tsx
- Import and call clearProto{N}State() in LandingPage
- Update scripts/generate-prototype-dates.ts prototype list (if using manual list)
- Create documentation file in docs/prototypes/

## Verification Steps

After creating or modifying a prototype:

### 1. Test Build
```bash
npm run build
```
Should complete without errors and include your prototype in the bundle.

### 2. Test Date Generation
```bash
npm run generate-dates
```
Should discover your prototype and generate a date entry.

### 3. Test Landing Page
- Run `npm run dev`
- Navigate to `/`
- Verify your prototype card appears
- Verify screenshot placeholder shows
- Verify last updated date displays
- Verify Loom button appears (if loomUrl provided)
- Click card to navigate to prototype

### 4. Test Prototype Routing
- Navigate to `/prototype-{n}`
- For multi-page: test all internal routes work
- For single-page: verify component renders
- Test theme inheritance (toggle light/dark on landing page first)

### 5. Test State Management (Multi-page only)
- Complete flow, return to home
- Navigate back to prototype
- Verify state was cleared

## Project Structure Details

### Landing Page (`src/components/LandingPage.tsx`)

**Responsibilities:**
- Display grid of prototype cards
- Sort by most recent first
- Clear all prototype states on mount
- Theme toggle in header

**When adding a prototype, update:**
1. Import the clearProto{N}State function
2. Call it in the useEffect hook
3. Add card entry to prototypeData array

### Prototype Structure (Multi-page Flow)

```
prototype-{n}/
├── Prototype{N}.tsx              # Main component
│   ├── Imports: FlowProvider, ErrorBoundary, FlowContainer
│   ├── Imports: All pages
│   ├── Imports: proto{N}-styles/theme.css
│   └── Renders: <Routes> with nested routes
├── proto{N}-pages/
│   ├── WelcomePage.tsx
│   ├── Step1Page.tsx
│   └── ...
├── proto{N}-components/
│   ├── core/                     # Reusable UI components
│   ├── layout/
│   │   ├── FlowProvider.tsx      # Context + localStorage + clearState()
│   │   └── FlowContainer.tsx     # Layout wrapper
│   └── feedback/
│       └── ErrorBoundary.tsx     # Error handling
├── proto{N}-hooks/               # useFlow, etc.
├── proto{N}-types/               # FlowState, etc.
├── proto{N}-utils/               # Helpers, mock data
└── proto{N}-styles/
    └── theme.css                 # Radix variable overrides
```

### Prototype Structure (Single-page)

```
prototype-{n}/
├── index.tsx                     # Single component
└── Proto{N}.module.css           # CSS Module
```

## When Documentation Conflicts with Code

**Always trust the actual codebase.** If you find discrepancies:

1. Verify the pattern by checking multiple examples in the codebase
2. Make your changes following the actual codebase patterns
3. Update this CLAUDE.md file with correct information
4. Note the discrepancy in your response to the user

## Resources

- **Radix UI Colors**: https://www.radix-ui.com/colors
- **Radix UI Themes**: https://www.radix-ui.com/themes/docs
- **Phosphor Icons**: https://phosphoricons.com/
- **React Router**: https://reactrouter.com/

## Success Criteria

Your prototype implementation should:

- [ ] Match Figma design using Radix variables exclusively
- [ ] Be completely isolated from other prototypes
- [ ] Have comprehensive documentation
- [ ] Build without TypeScript errors
- [ ] Display on landing page with correct metadata
- [ ] Clear state when returning to home
- [ ] Work in both light and dark modes
- [ ] Be interactive and demonstrate the concept

---

**Remember:** This is a prototyping template, not production code. Prioritize speed and design fidelity. Keep prototypes simple, isolated, and well-documented.
