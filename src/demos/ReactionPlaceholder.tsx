import { Box, Text } from '@radix-ui/themes'

type ReactionPlaceholderProps = {
  categoryTitle: string
  variantTitle: string
}

/**
 * Placeholder for the reaction (toast, modal, banner, etc.) per variant.
 * Replace with real reaction UI when designs are ready.
 */
export function ReactionPlaceholder({ categoryTitle, variantTitle }: ReactionPlaceholderProps) {
  return (
    <Box
      style={{
        marginTop: 'var(--space-4)',
        padding: 'var(--space-4)',
        backgroundColor: 'var(--gray-3)',
        borderRadius: 'var(--radius-3)',
        borderLeft: '4px solid var(--accent-8)'
      }}
    >
      <Text size="2" style={{ color: 'var(--gray-11)' }}>
        Reaction: {categoryTitle} — {variantTitle}
      </Text>
      <Text size="1" style={{ color: 'var(--gray-10)', display: 'block', marginTop: 'var(--space-1)' }}>
        Trigger the action above to see this variant&apos;s reaction (placeholder).
      </Text>
    </Box>
  )
}
