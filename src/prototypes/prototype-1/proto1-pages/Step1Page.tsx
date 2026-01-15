import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heading, Text, TextField, Button, Flex, Box, Card } from '@radix-ui/themes'
import { ArrowRight, ArrowLeft } from '@phosphor-icons/react'
import { useFlow } from '../proto1-components/layout/FlowProvider'

export default function Step1Page() {
  const navigate = useNavigate()
  const { state, updateFormData } = useFlow()
  const [name, setName] = useState(state.formData.name as string || '')

  const handleNext = () => {
    updateFormData('name', name)
    navigate('/prototype-1/step-2')
  }

  return (
    <Flex direction="column" gap="6" style={{ paddingTop: 'var(--space-9)', maxWidth: '600px', margin: '0 auto' }}>
      <Box>
        <Text size="2" style={{ color: 'var(--gray-11)' }}>Step 1 of 2</Text>
        <Heading size="7" mt="2" style={{ color: 'var(--gray-12)' }}>
          What's your name?
        </Heading>
      </Box>

      <Card size="3">
        <Flex direction="column" gap="4">
          <Box>
            <Text as="label" size="2" weight="medium" mb="2" style={{ display: 'block', color: 'var(--gray-12)' }}>
              Full Name
            </Text>
            <TextField.Root
              size="3"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>

          <Text size="2" style={{ color: 'var(--gray-11)' }}>
            This information is only stored locally and used to demonstrate
            state management in the prototype.
          </Text>
        </Flex>
      </Card>

      <Flex gap="3" justify="between">
        <Button
          variant="soft"
          size="3"
          onClick={() => navigate('/prototype-1')}
        >
          <ArrowLeft size="20" weight="bold" style={{ width: 'var(--icon-size-md)', height: 'var(--icon-size-md)' }} />
          Back
        </Button>

        <Button
          size="3"
          onClick={handleNext}
          disabled={!name.trim()}
        >
          Next
          <ArrowRight size="20" weight="bold" style={{ width: 'var(--icon-size-md)', height: 'var(--icon-size-md)' }} />
        </Button>
      </Flex>
    </Flex>
  )
}
