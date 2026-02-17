/**
 * Type declaration for LeaderLine (loaded via script tag from public/leader-line.min.js).
 * @see https://anseki.github.io/leader-line/
 */
declare global {
  interface Window {
    LeaderLine: typeof LeaderLineClass
  }
}

export interface LeaderLineOptions {
  color?: string
  size?: number
  path?: 'straight' | 'arc' | 'fluid' | 'magnet' | 'grid'
  startSocket?: 'top' | 'right' | 'bottom' | 'left' | 'auto'
  endSocket?: 'top' | 'right' | 'bottom' | 'left' | 'auto'
  startPlug?: string
  endPlug?: string
  hide?: boolean
}

export interface LeaderLineClass {
  new (start: HTMLElement, end: HTMLElement, options?: LeaderLineOptions): LeaderLineInstance
  positionByWindowResize: boolean
}

export interface LeaderLineInstance {
  position(): void
  remove(): void
  show(): void
  hide(): void
}

export {}
