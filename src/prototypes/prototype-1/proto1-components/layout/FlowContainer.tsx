import { ReactNode } from 'react'
import { Box, Container } from '@radix-ui/themes'

interface FlowContainerProps {
  children: ReactNode
}

export default function FlowContainer({ children }: FlowContainerProps) {
  return (
    <Box style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-background)',
      padding: 'var(--space-6)',
    }}>
      <Container size="3">
        {children}
      </Container>
    </Box>
  )
}
