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
        <Box
          role="alert"
          aria-live="assertive"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-6)',
            backgroundColor: 'var(--color-background)',
          }}
        >
          <Flex direction="column" align="center" gap="5" style={{ maxWidth: '600px' }}>
            <WarningCircle
              size="64"
              weight="duotone"
              style={{
                color: 'var(--red-9)',
                width: 'var(--icon-size-2xl)',
                height: 'var(--icon-size-2xl)'
              }}
            />

            <Box style={{ textAlign: 'center' }}>
              <Heading size="6" mb="2" style={{ color: 'var(--gray-12)' }}>
                Something Went Wrong
              </Heading>
              <Text size="3" style={{ color: 'var(--gray-11)' }}>
                {this.state.error?.message || 'An unexpected error occurred in this prototype'}
              </Text>
            </Box>

            <Box
              style={{
                backgroundColor: 'var(--gray-3)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-3)',
                border: '1px solid var(--gray-6)',
                width: '100%',
              }}
            >
              <Text size="2" style={{ color: 'var(--gray-11)' }}>
                <strong>What you can do:</strong>
                <ul style={{ marginTop: 'var(--space-2)', marginLeft: 'var(--space-5)' }}>
                  <li>Return to the home page and try again</li>
                  <li>Clear your browser's local storage</li>
                  <li>Check the browser console for more details</li>
                  <li>Report this issue to the development team</li>
                </ul>
              </Text>
            </Box>

            <Flex gap="3">
              <Button
                size="3"
                onClick={() => {
                  this.setState({ hasError: false, error: undefined })
                  window.location.href = '/'
                }}
              >
                Return to Home
              </Button>
              <Button
                size="3"
                variant="soft"
                onClick={() => {
                  this.setState({ hasError: false, error: undefined })
                  window.location.reload()
                }}
              >
                Reload Page
              </Button>
            </Flex>
          </Flex>
        </Box>
      )
    }

    return this.props.children
  }
}
