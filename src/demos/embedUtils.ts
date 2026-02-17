/**
 * Builds the full URL for embedding a demo (e.g. in iframes or share links).
 * Uses origin + base path so production deploys (e.g. GitHub Pages) get correct URLs.
 */

const baseUrl = (import.meta.env.VITE_EMBED_ORIGIN as string) || ''
const basePath = (import.meta.env.BASE_URL as string) || '/'

/**
 * Returns the absolute URL for the current page (or the given pathname).
 * When VITE_EMBED_ORIGIN is set (e.g. in production), that origin is used so
 * copied links point to the deployed site even when developing locally.
 */
export function getEmbedUrl(pathname?: string): string {
  const path = pathname ?? window.location.pathname
  const normalizedBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const fullPath = normalizedBase === '' ? normalizedPath : `${normalizedBase}${normalizedPath}`.replace('//', '/')

  if (baseUrl) {
    const origin = baseUrl.replace(/\/$/, '')
    return `${origin}${fullPath}`
  }
  return `${window.location.origin}${fullPath}`
}

/**
 * Returns an iframe snippet for embedding the demo on another page.
 */
export function getEmbedSnippet(embedUrl: string, title: string, width = 800, height = 600): string {
  return `<iframe src="${embedUrl}" title="${title.replace(/"/g, '&quot;')}" width="${width}" height="${height}"></iframe>`
}
