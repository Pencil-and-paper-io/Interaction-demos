import { Component, ReactNode } from 'react'
import { Box, Heading, Text, Button, Flex } from '@radix-ui/themes'
import { WarningCircle } from '@phosphor-icons/react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-6)',
        }}>
          <Flex direction="column" align="center" gap="4" style={{ maxWidth: '500px' }}>
            <WarningCircle size={64} weight="duotone" style={{ color: 'var(--red-9)' }} />
            <Heading size="6" style={{ color: 'var(--gray-12)' }}>
              Something went wrong
            </Heading>
            <Text size="3" style={{ color: 'var(--gray-11)', textAlign: 'center' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>
            <Button
              size="3"
              onClick={() => {
                this.setState({ hasError: false, error: undefined })
                window.location.href = '/'
              }}
            >
              Return to Home
            </Button>
          </Flex>
        </Box>
      )
    }

    return this.props.children
  }
}
