import { useNavigate } from 'react-router-dom'
import { Heading, Text, Button, Flex, Box } from '@radix-ui/themes'
import { ArrowRight, Cube } from '@phosphor-icons/react'
import { useFlow } from '../proto1-components/layout/FlowProvider'

export default function WelcomePage() {
  const navigate = useNavigate()
  const { resetFlow } = useFlow()

  const handleStart = () => {
    resetFlow()
    navigate('/prototype-1/step-1')
  }

  return (
    <Flex direction="column" align="center" gap="6" style={{ paddingTop: 'var(--space-9)' }}>
      <Cube size={80} weight="duotone" style={{ color: 'var(--accent-9)' }} />

      <Box style={{ textAlign: 'center', maxWidth: '500px' }}>
        <Heading size="8" mb="3" style={{ color: 'var(--gray-12)' }}>
          Welcome to Prototype 1
        </Heading>
        <Text size="4" style={{ color: 'var(--gray-11)' }}>
          This is an example multi-page flow prototype demonstrating nested routing,
          state management, and Radix UI components.
        </Text>
      </Box>

      <Button size="4" onClick={handleStart}>
        Get Started
        <ArrowRight size={20} weight="bold" />
      </Button>

      <Box mt="6" p="4" style={{
        backgroundColor: 'var(--gray-3)',
        borderRadius: 'var(--radius-3)',
        border: '1px solid var(--gray-6)',
        maxWidth: '500px',
      }}>
        <Text size="2" style={{ color: 'var(--gray-11)' }}>
          💡 <strong>Tip:</strong> This prototype uses FlowProvider for state management
          with localStorage persistence. Navigate between pages to see it in action.
        </Text>
      </Box>
    </Flex>
  )
}
