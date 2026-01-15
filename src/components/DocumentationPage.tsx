import { useParams, useNavigate } from 'react-router-dom'
import { Box, Container, Button, Flex } from '@radix-ui/themes'
import { ArrowLeft } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import '../styles/markdown.css'

export default function DocumentationPage() {
  const { prototypeId } = useParams<{ prototypeId: string }>()
  const navigate = useNavigate()
  const [markdown, setMarkdown] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/docs/prototypes/${prototypeId}.md`)
        if (!response.ok) {
          throw new Error('Documentation not found')
        }
        const text = await response.text()
        setMarkdown(text)
      } catch (err) {
        console.error('Error loading documentation:', err)
        setMarkdown(`# ${prototypeId} Documentation\n\nDocumentation for this prototype has not been created yet.`)
      } finally {
        setLoading(false)
      }
    }

    if (prototypeId) {
      loadMarkdown()
    }
  }, [prototypeId])

  return (
    <Box style={{ minHeight: '100vh', padding: 'var(--space-6)', backgroundColor: 'var(--color-background)' }}>
      <Container size="3">
        <Flex direction="column" gap="6">
          {/* Header */}
          <Flex align="center" justify="between" wrap="wrap" gap="3">
            <Button
              variant="ghost"
              size="2"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={20} weight="bold" />
              Back to Home
            </Button>

            <Flex gap="2">
              <Button
                size="2"
                onClick={() => navigate(`/${prototypeId}`)}
              >
                View Prototype
              </Button>
            </Flex>
          </Flex>

          {/* Markdown Document */}
          {loading ? (
            <Box style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--gray-11)' }}>
              Loading documentation...
            </Box>
          ) : (
            <Box className="markdown-document">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            </Box>
          )}
        </Flex>
      </Container>
    </Box>
  )
}
