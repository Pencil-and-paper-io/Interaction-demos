# Proto Template

A template repository for creating isolated, interactive design prototypes with automatic screenshot capture, documentation generation, and GitHub Pages deployment.

## 🎯 Purpose

This template helps designers quickly build and organize interactive prototypes that:
- Demonstrate design concepts and workflows
- Gather feedback from clients and internal teams
- Serve as interactive specifications for engineers
- Maintain complete isolation between different prototypes

## ✨ Features

- **📦 Isolated Prototypes** - Each prototype is completely independent with its own components, styles, and state
- **🎨 Radix UI** - Beautiful, accessible components with automatic light/dark mode
- **🔗 Figma Integration** - Automatic design extraction via Claude Code's Figma MCP
- **📸 Screenshot Automation** - Auto-capture screenshots on commit via GitHub Actions
- **📚 Auto Documentation** - Generate comprehensive docs for each prototype
- **🚀 GitHub Pages** - Automatic deployment to a live site
- **⚡ Lightning Fast** - Vite dev server with hot reload
- **🧭 Easy Navigation** - Landing page with sortable prototype cards

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- Git initialized repository
- (Optional) Claude Code with Figma MCP for design extraction

### Setup

```bash
# Clone this template
# (Or use as template on GitHub)

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the landing page.

## 📖 Usage

### Creating a New Prototype

**Option 1: CLI Scaffold** (Coming Soon)
```bash
npm run new-proto
```

**Option 2: Ask Claude Code**
```
"Create a new prototype for [your feature]. It needs [requirements].
Use the [multi-page/single-page] pattern."
```

Claude Code will:
1. Check for Figma link and extract design details
2. Create the complete prototype structure
3. Map all styles to Radix variables
4. Generate documentation
5. Update all necessary files

### Prototype Patterns

**Multi-page Flow** - For wizards, multi-step workflows:
```
src/prototypes/prototype-{n}/
├── Prototype{N}.tsx              # Main with nested Routes
├── proto{N}-pages/               # Step pages
├── proto{N}-components/layout/   # FlowProvider, Container
└── proto{N}-styles/theme.css     # Radix variables
```

**Single-page** - For component showcases, simple interactions:
```
src/prototypes/prototype-{n}/
├── index.tsx                     # Single component
└── Proto{N}.module.css           # CSS Module
```

### Card Structure

Each prototype appears on the landing page as a card with:
- **Screenshot** - Auto-captured from `/screenshots/{id}.png`
- **Name & Description**
- **Last Updated** - From git history
- **"View Prototype" CTA** - Opens the prototype
- **"Documentation" CTA** - Opens the documentation page
- **Optional Loom button** - If `loomUrl` provided

## 🎨 Styling with Radix Variables

**Always use Radix UI variables**, never raw values:

```css
/* ❌ Wrong */
.container {
  padding: 16px;
  color: #000000;
  border-radius: 8px;
}

/* ✅ Correct */
.container {
  padding: var(--space-4);
  color: var(--gray-12);
  border-radius: var(--radius-3);
}
```

See [CLAUDE.md](./CLAUDE.md) for complete Radix variable reference.

## 📝 Documentation

Every prototype should have documentation at `docs/prototypes/{id}.md` containing:
- **Problem Statement** - What problem does this solve?
- **Goal** - What should users accomplish?
- **Workflow** - Step-by-step user journey
- **Limitations** - Known issues or missing features
- **Figma Links** - Design source files
- **Version History** - From git log

Claude Code will prompt you for these details when creating a prototype with a Figma link.

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production (auto-generates dates) |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run generate-dates` | Update prototype dates from git |
| `npm run screenshots` | Capture all prototype screenshots |
| `npm run new-proto` | Create new prototype (CLI) |

## 📦 Deployment

### GitHub Pages

1. Push to main branch
2. GitHub Actions automatically:
   - Generates prototype dates
   - Captures screenshots
   - Builds the project
   - Deploys to GitHub Pages

3. Visit `https://{username}.github.io/{repo-name}`

### Configuration

Update `vite.config.ts` with your repo name:

```typescript
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
})
```

## 📂 Project Structure

```
proto-template/
├── src/
│   ├── components/
│   │   ├── LandingPage.tsx       # Main grid
│   │   ├── DocumentationPage.tsx # Doc viewer
│   │   └── ThemeToggle.tsx       # Light/dark mode
│   ├── prototypes/
│   │   ├── prototype-1/          # Multi-page example
│   │   └── prototype-2/          # Single-page example
│   └── utils/
│       └── relativeTime.ts       # Date formatting
├── scripts/
│   ├── generate-prototype-dates.ts
│   ├── capture-screenshots.ts    # (Coming soon)
│   └── scaffold-prototype.ts     # (Coming soon)
├── docs/
│   └── prototypes/               # Markdown docs
├── public/
│   └── screenshots/              # Auto-generated
└── CLAUDE.md                     # Comprehensive guide
```

## 🤖 Working with Claude Code

See [CLAUDE.md](./CLAUDE.md) for the complete guide. Key points:

1. **Always check Figma MCP** is connected
2. **Provide Figma links** for automatic design extraction
3. **Answer documentation prompts** (problem, goal, workflow, limitations)
4. **Use Radix variables exclusively** - Claude will convert Figma values
5. **Maintain isolation** - Each prototype is independent

## 📋 Examples

This template includes two example prototypes:

- **Prototype 1**: Multi-page flow with state management, nested routing, and FlowProvider
- **Prototype 2**: Single-page component showcase with CSS Modules

Explore these to understand the patterns, then delete them when creating your own prototypes.

## 🐛 Troubleshooting

**Build fails with TypeScript errors:**
- Run `npm run build` to see specific errors
- Check CLAUDE.md for common pitfalls

**Screenshots not appearing:**
- Screenshots are generated in CI/CD by default
- Run `npm run screenshots` locally (requires Playwright setup)
- Fallback icons show until screenshots exist

**Prototype not showing on landing page:**
- Check `src/components/LandingPage.tsx` has card entry
- Check `src/App.tsx` has route
- Run `npm run generate-dates` to update dates

**Theme not working:**
- Ensure Radix Theme provider is in `main.tsx`
- Check you're using Radix variables, not raw values
- Test with ThemeToggle on landing page

## 📚 Resources

- [Radix UI Documentation](https://www.radix-ui.com/themes/docs)
- [Radix Colors](https://www.radix-ui.com/colors)
- [Phosphor Icons](https://phosphoricons.com/)
- [React Router](https://reactrouter.com/)
- [Vite Documentation](https://vitejs.dev/)

## 📄 License

This is a template repository. Use it however you like for your prototypes.

---

**Built for rapid prototyping with Claude Code** 🚀
