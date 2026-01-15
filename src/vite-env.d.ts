/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// CSS module declarations
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

// CSS import declarations
declare module '*.css?inline' {
  const content: string
  export default content
}
