# Prototype 2: Single-Page Component Example

## Overview

This prototype demonstrates a single-page pattern with CSS Modules for styling. It's ideal for simple component showcases, single-screen explorations, or standalone interactive elements that don't require multi-step navigation.

## Problem Statement

Not all prototypes need complex routing and state management. Sometimes you need a simple, self-contained component to explore a UI pattern, test an interaction, or demonstrate a specific feature.

## Goal

Demonstrate a lightweight single-page prototype pattern that can be used for:
- Component showcases
- Single-screen UI explorations
- Interactive demos
- Simple feature prototypes

## Workflow

1. User arrives at the prototype
2. User interacts with the component (input, buttons, etc.)
3. Component responds with immediate feedback

All logic and state management happens within a single component file. No complex routing or navigation required.

## Key Features

- **Single File Component** - All logic in one place (index.tsx)
- **CSS Modules** - Scoped styling with Proto2.module.css
- **Local State** - Simple useState hooks for component state
- **Radix UI Components** - Leverages Radix for consistent design
- **Minimal Structure** - Quick to scaffold and easy to understand

## Technical Implementation

### File Structure

```
prototype-2/
├── index.tsx              # Main component (all logic here)
└── Proto2.module.css      # Scoped styles
```

### CSS Modules Pattern

```css
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
```

All styles use Radix CSS custom properties - no hardcoded values.

### Radix Variables Used

- **Colors**: `--gray-1` through `--gray-12`, `--color-background`
- **Spacing**: `--space-3` through `--space-6`
- **Shadows**: `--shadow-3`

## Limitations

- Limited to single-page interactions
- No routing or navigation
- State is not persisted (resets on refresh)
- Best for simple, focused explorations

## When to Use This Pattern

Choose the single-page pattern when:
- You're exploring a specific component or interaction
- No multi-step workflow is needed
- State persistence isn't required
- You want to quickly prototype an idea
- The prototype is self-contained

For complex flows with multiple steps, use the multi-page pattern (prototype-1).

## Figma Design

Design files and specifications would be linked here when available.

## Version History

- **2026-01-15** - Initial prototype created as template example
