# Prototype 1: Multi-Page Flow Example

## Overview

This prototype demonstrates a multi-page flow pattern with nested routing, context-based state management, and step-by-step navigation. It showcases how to build complex, multi-step workflows with React Router and Context API.

## Problem Statement

Many user workflows require multiple steps to complete a task. Users need clear navigation, persistent state across steps, and the ability to move forward and backward through the flow without losing their progress.

## Goal

Demonstrate a complete multi-page prototype pattern that can be used as a template for building:
- Onboarding flows
- Multi-step forms
- Wizard-style interfaces
- Sequential data collection workflows

## Workflow

1. **Welcome Page** - Introduction to the flow with a clear call-to-action
2. **Step 1** - First data collection page with form inputs
3. **Step 2** - Second step showing collected data and completion

Users can navigate forward and backward through the flow. State is persisted in localStorage so progress isn't lost on page refresh.

## Key Features

- **Nested Routing** - Uses React Router's nested routes with wildcard paths
- **FlowProvider Context** - Centralized state management for the entire flow
- **State Persistence** - localStorage integration for state preservation
- **Layout Components** - Reusable FlowContainer for consistent layout
- **Error Boundary** - Graceful error handling for the entire flow
- **State Clearing** - Utility function to reset flow state from landing page

## Technical Implementation

### File Structure

```
prototype-1/
├── Prototype1.tsx              # Main component with Routes
├── proto1-pages/              # Step components
│   ├── WelcomePage.tsx
│   ├── Step1Page.tsx
│   └── Step2Page.tsx
├── proto1-components/         # UI components
│   ├── layout/
│   │   ├── FlowProvider.tsx
│   │   └── FlowContainer.tsx
│   └── feedback/
│       └── ErrorBoundary.tsx
├── proto1-styles/             # Styling
│   └── theme.css
└── proto1-types/              # TypeScript definitions
    └── flow.ts
```

### Radix Variables Used

This prototype uses Radix UI theme tokens exclusively:

- **Colors**: `--gray-1` through `--gray-12`, `--blue-9`
- **Spacing**: `--space-2` through `--space-6`
- **Radii**: `--radius-3`
- **Shadows**: `--shadow-2`, `--shadow-3`

## Limitations

- This is a simplified example with mock data
- No backend integration or API calls
- Form validation is basic
- No authentication or authorization
- State is only persisted in localStorage (not synced across devices)

## Figma Design

Design files and specifications would be linked here when available.

## Version History

- **2026-01-15** - Initial prototype created as template example
