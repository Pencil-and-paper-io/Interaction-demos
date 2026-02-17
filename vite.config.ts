import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Actions sets GITHUB_REPOSITORY (e.g. "owner/repo"); use repo name as base path for Pages
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = repoName ? `/${repoName}/` : process.env.NODE_ENV === 'production' ? '/Interaction-demos/' : '/'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
