/**
 * Central config for interaction demo categories and variants.
 * Drives landing cards, category hubs, and demo routes.
 */

export type DemoVariant = {
  id: string
  title: string
  routeSegment: string
}

export type DemoCategory = {
  id: string
  title: string
  description: string
  routeSegment: string
  variants: DemoVariant[]
}

export const demoCategories: DemoCategory[] = [
  {
    id: 'success',
    title: 'Success',
    description: 'Success feedback demos — same trigger, different reaction intensity.',
    routeSegment: 'success',
    variants: [
      { id: 'baseline', title: 'Baseline', routeSegment: 'baseline' },
      { id: '1-star', title: '1 star', routeSegment: '1-star' },
      { id: '2-star', title: '2 star', routeSegment: '2-star' },
      { id: '3-star', title: '3 star', routeSegment: '3-star' },
      { id: 'overkill', title: 'Overkill', routeSegment: 'overkill' }
    ]
  },
  {
    id: 'error',
    title: 'Error',
    description: 'Error feedback demos — same trigger, different reaction intensity.',
    routeSegment: 'error',
    variants: [
      { id: 'baseline', title: 'Baseline', routeSegment: 'baseline' },
      { id: '1-star', title: '1 star', routeSegment: '1-star' },
      { id: '2-star', title: '2 star', routeSegment: '2-star' },
      { id: '3-star', title: '3 star', routeSegment: '3-star' },
      { id: 'overkill', title: 'Overkill', routeSegment: 'overkill' },
      { id: 'prevention', title: 'Prevention', routeSegment: 'prevention' }
    ]
  },
  {
    id: 'warning',
    title: 'Warning',
    description: 'Warning demos — confirmation and dependencies.',
    routeSegment: 'warning',
    variants: [
      { id: 'confirmation', title: 'Confirmation warning', routeSegment: 'confirmation' },
      { id: 'dependencies', title: 'Dependencies warning', routeSegment: 'dependencies' }
    ]
  },
  {
    id: 'system-status',
    title: 'System Status',
    description: 'System status demos — variants TBD.',
    routeSegment: 'system-status',
    variants: []
  }
]

export function getCategoryBySegment(segment: string): DemoCategory | undefined {
  return demoCategories.find((c) => c.routeSegment === segment)
}

export function getVariantBySegment(
  category: DemoCategory,
  variantSegment: string
): DemoVariant | undefined {
  return category.variants.find((v) => v.routeSegment === variantSegment)
}

export function getDemoPath(categorySegment: string, variantSegment?: string): string {
  const base = `/demos/${categorySegment}`
  return variantSegment ? `${base}/${variantSegment}` : base
}
