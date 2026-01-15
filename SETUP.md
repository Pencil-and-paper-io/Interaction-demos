# Setup Guide

Complete setup instructions for getting your proto-template repository ready for use.

## Initial Repository Setup

### 1. Create Repository from Template

**Option A: Using GitHub**
1. Click "Use this template" button on GitHub
2. Name your repository (e.g., `my-prototypes`)
3. Clone to your local machine

**Option B: Manual Clone**
```bash
git clone <this-repo-url> my-prototypes
cd my-prototypes
rm -rf .git
git init
git add .
git commit -m "Initial commit from proto-template"
```

### 2. Install Dependencies

```bash
npm install
```

This will install all dependencies and automatically generate the prototype dates file (`src/data/prototype-dates.json`).

### 3. Configure for Your Project

#### Update `vite.config.ts`

Change the base path to match your repository name:

```typescript
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/my-prototypes/' : '/',
})
```

#### Update `package.json`

Change the project name:

```json
{
  "name": "my-prototypes",
  ...
}
```

#### Update Landing Page

Edit `src/components/LandingPage.tsx` header:

```tsx
<Heading size="8" mb="2">
  My Project Prototypes
</Heading>
<Text size="4">
  Your custom description here
</Text>
```

### 4. Initialize Git

```bash
git init
git add .
git commit -m "Initial setup"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## GitHub Pages Configuration

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select:
   - Source: **GitHub Actions**
4. Save

### 2. First Deployment

Push to main branch:

```bash
git push origin main
```

GitHub Actions will automatically:
- Build your project
- Deploy to GitHub Pages
- Create a live site at `https://{username}.github.io/{repo-name}/`

### 3. Verify Deployment

1. Go to **Actions** tab on GitHub
2. Wait for workflow to complete (green checkmark)
3. Visit your site URL
4. You should see the landing page with example prototypes

## Optional: Playwright Setup (for Screenshots)

### 1. Install Playwright

```bash
npm install -D @playwright/test
npx playwright install chromium
```

### 2. Test Screenshot Script

```bash
npm run screenshots
```

This will capture screenshots of all prototypes and save them to `public/screenshots/`.

### 3. Enable in GitHub Actions

Uncomment the screenshot capture step in `.github/workflows/deploy.yml`:

```yaml
- name: Install Playwright
  run: npx playwright install chromium --with-deps

- name: Capture screenshots
  run: npm run screenshots
```

## Claude Code Setup

### 1. Verify Figma MCP Connection

In Claude Code:
```
"Check if Figma MCP is connected"
```

Claude should confirm access to `mcp__figma__*` tools.

### 2. Test Figma Integration

Share a Figma link:
```
"Here's my design: https://figma.com/file/..."
```

Claude Code should automatically:
- Extract design metadata
- Get design context
- Capture screenshots
- Map values to Radix variables

### 3. Configure Figma MCP (if not working)

See Claude Code documentation for Figma MCP setup:
- [Claude Code Figma Integration](https://docs.claude.com/code/figma)

## Development Workflow

### 1. Start Dev Server

```bash
npm run dev
```

Visit `http://localhost:5173`

### 2. Create First Prototype

**Using CLI** (when available):
```bash
npm run new-proto
```

**Using Claude Code**:
```
"Create a new prototype for [feature name]. Use the multi-page flow pattern."
```

### 3. Build and Test

```bash
npm run build
npm run preview
```

### 4. Push to GitHub

```bash
git add .
git commit -m "Add new prototype"
git push
```

GitHub Actions deploys automatically.

## Customization

### Theme Colors

Edit `src/main.tsx` to change accent color:

```tsx
<Theme
  accentColor="blue"  // Change to: red, green, purple, etc.
  ...
>
```

### Typography

Edit `src/index.css` for global font settings:

```css
:root {
  font-family: 'Your Font', system-ui, sans-serif;
}
```

### Landing Page Layout

Edit `src/components/LandingPage.tsx`:
- Change grid columns breakpoints
- Adjust card sizes
- Modify header layout

## Troubleshooting

### Build Fails

**Error: Cannot find module**
```bash
npm install
```

**TypeScript errors**
```bash
npm run build
# Read error messages carefully
# Check CLAUDE.md for common pitfalls
```

### GitHub Pages Not Working

**404 on deployed site:**
- Check `vite.config.ts` base path matches repo name
- Verify GitHub Pages is enabled in Settings
- Check Actions tab for deployment errors

**Assets not loading:**
- Ensure base path in `vite.config.ts` has leading and trailing slashes: `/repo-name/`
- Clear browser cache and try again

### Figma MCP Not Working

**Claude Code can't access Figma:**
- Check Figma MCP is installed and configured
- Verify Figma link is accessible
- Check console for error messages

### Screenshots Not Generating

**Playwright errors:**
```bash
npx playwright install chromium --with-deps
```

**Permission errors in CI:**
- Check GitHub Actions has necessary permissions
- Verify workflow file syntax is correct

## Environment Variables

No environment variables are required for basic usage.

**Optional** (for advanced features):
- `NODE_ENV` - Set to `production` for production builds (auto-set in CI)

## Maintenance

### Update Dependencies

```bash
npm update
npm audit fix
```

### Clean Build

```bash
rm -rf dist node_modules
npm install
npm run build
```

### Reset Prototype Dates

```bash
npm run generate-dates
```

## Next Steps

1. ✅ Delete example prototypes (`prototype-1`, `prototype-2`)
2. ✅ Create your first real prototype
3. ✅ Add Figma links and documentation
4. ✅ Capture screenshots
5. ✅ Share with your team!

---

For detailed development guidelines, see [CLAUDE.md](./CLAUDE.md).

For usage and patterns, see [README.md](./README.md).
