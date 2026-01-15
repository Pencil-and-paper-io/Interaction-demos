import { useNavigate } from 'react-router-dom'
import { Heading, Text, Button, Flex, Box, Card, Code } from '@radix-ui/themes'
import { ArrowLeft, House, CheckCircle } from '@phosphor-icons/react'
import { useFlow } from '../proto1-components/layout/FlowProvider'

export default function Step2Page() {
  const navigate = useNavigate()
  const { state } = useFlow()

  return (
    <Flex direction="column" gap="6" style={{ paddingTop: 'var(--space-9)', maxWidth: '600px', margin: '0 auto' }}>
      <Box>
        <Text size="2" style={{ color: 'var(--gray-11)' }}>Step 2 of 2</Text>
        <Heading size="7" mt="2" style={{ color: 'var(--gray-12)' }}>
          Review & Complete
        </Heading>
      </Box>

      <Card size="3">
        <Flex direction="column" gap="4" align="center">
          <CheckCircle
            size="64"
            weight="duotone"
            style={{
              color: 'var(--green-9)',
              width: 'var(--icon-size-2xl)',
              height: 'var(--icon-size-2xl)'
            }}
          />

          <Box style={{ textAlign: 'center' }}>
            <Text as="div" size="5" weight="bold" style={{ color: 'var(--gray-12)' }}>
              {`Thanks, ${state.formData.name || 'there'}!`}
            </Text>
            <Text as="div" size="3" mt="2" style={{ color: 'var(--gray-11)' }}>
              You've completed the example flow.
            </Text>
          </Box>

          <Box style={{ width: '100%' }}>
            <Text size="2" weight="medium" mb="2" style={{ display: 'block', color: 'var(--gray-12)' }}>
              Current Flow State:
            </Text>
            <Code
              size="2"
              style={{
                display: 'block',
                padding: 'var(--space-3)',
                backgroundColor: 'var(--gray-3)',
                borderRadius: 'var(--radius-2)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {JSON.stringify(state, null, 2)}
            </Code>
          </Box>
        </Flex>
      </Card>

      <Flex gap="3" justify="between">
        <Button
          variant="soft"
          size="3"
          onClick={() => navigate('/prototype-1/step-1')}
        >
          <ArrowLeft size="20" weight="bold" style={{ width: 'var(--icon-size-md)', height: 'var(--icon-size-md)' }} />
          Back
        </Button>

        <Button
          size="3"
          onClick={() => navigate('/')}
        >
          <House size="20" weight="bold" style={{ width: 'var(--icon-size-md)', height: 'var(--icon-size-md)' }} />
          Home
        </Button>
      </Flex>
    </Flex>
  )
}
