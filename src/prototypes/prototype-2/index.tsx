import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Heading, Text, Button, Card, Flex, TextField } from '@radix-ui/themes'
import { ArrowLeft, Sparkle, PaperPlaneTilt } from '@phosphor-icons/react'
import styles from './Proto2.module.css'

export default function Prototype2() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (message.trim()) {
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <Box className={styles.container}>
      <Container size="2">
        <Flex direction="column" gap="6" style={{ paddingTop: 'var(--space-9)' }}>
          {/* Header */}
          <Flex align="center" gap="3">
            <Button
              variant="ghost"
              size="2"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={20} weight="bold" />
            </Button>
            <Box>
              <Text size="2" style={{ color: 'var(--gray-11)' }}>Prototype 2</Text>
              <Heading size="6" style={{ color: 'var(--gray-12)' }}>
                Single-Page Example
              </Heading>
            </Box>
          </Flex>

          {/* Main Content */}
          <Card size="3" className={styles.card}>
            <Flex direction="column" align="center" gap="5">
              <Sparkle size={56} weight="duotone" style={{ color: 'var(--accent-9)' }} />

              <Box style={{ textAlign: 'center' }}>
                <Heading size="5" mb="2" style={{ color: 'var(--gray-12)' }}>
                  Simple Component Showcase
                </Heading>
                <Text size="3" style={{ color: 'var(--gray-11)' }}>
                  This demonstrates a single-page prototype with CSS Modules.
                  All logic is contained in one file for simpler prototypes.
                </Text>
              </Box>

              {/* Interactive Demo */}
              <Box style={{ width: '100%' }}>
                <Flex direction="column" gap="3">
                  <TextField.Root
                    size="3"
                    placeholder="Type something..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  />

                  <Button
                    size="3"
                    onClick={handleSubmit}
                    disabled={!message.trim()}
                    style={{ width: '100%' }}
                  >
                    <PaperPlaneTilt size={20} weight="bold" />
                    Submit
                  </Button>
                </Flex>

                {submitted && (
                  <Box mt="4" p="3" className={styles.successMessage}>
                    <Text size="2" weight="medium" style={{ color: 'var(--green-11)' }}>
                      ✓ Message received: "{message}"
                    </Text>
                  </Box>
                )}
              </Box>
            </Flex>
          </Card>

          {/* Info Box */}
          <Box className={styles.infoBox}>
            <Text size="2" style={{ color: 'var(--gray-11)' }}>
              💡 <strong>Pattern:</strong> Single-page prototypes are great for simple
              component showcases, UI explorations, or when you don't need complex state management.
            </Text>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}
