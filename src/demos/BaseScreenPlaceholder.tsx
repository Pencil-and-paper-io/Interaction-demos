import { ReactNode } from 'react'
import { Box, Heading, Text } from '@radix-ui/themes'

type BaseScreenPlaceholderProps = {
  categoryTitle: string
  children?: ReactNode
}

/**
 * Placeholder for the shared base screen per category.
 * Replace with real UI when visual references are provided.
 */
export function BaseScreenPlaceholder({ categoryTitle, children }: BaseScreenPlaceholderProps) {
  return (
    <Box
      style={{
        border: '2px dashed var(--gray-6)',
        borderRadius: 'var(--radius-4)',
        padding: 'var(--space-8)',
        backgroundColor: 'var(--gray-2)',
        minHeight: '280px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-4)'
      }}
    >
      <Heading size="5" style={{ color: 'var(--gray-11)' }}>
        {categoryTitle} — Base screen
      </Heading>
      <Text size="3" style={{ color: 'var(--gray-10)', textAlign: 'center' }}>
        Same UI and trigger for all variants in this category. Visual reference to be added.
      </Text>
      {children}
    </Box>
  )
}
