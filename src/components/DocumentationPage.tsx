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
        setMarkdown(`# ${prototypeId} Documentation

## Documentation Not Found

Documentation for this prototype hasn't been created yet. Here's how to add it:

### Quick Start

1. Create a markdown file at:
   \`\`\`
   docs/prototypes/${prototypeId}.md
   \`\`\`

2. Or ask Claude Code to generate documentation for you:
   \`\`\`
   "Generate documentation for ${prototypeId}"
   \`\`\`

3. Your documentation should include:
   - **Purpose**: What problem does this prototype solve?
   - **User Flow**: Step-by-step walkthrough
   - **Key Features**: Main functionality
   - **Known Limitations**: What's not included
   - **Design Notes**: Figma links, design decisions

### Need Help?

Check out the [CLAUDE.md](../CLAUDE.md) guide for documentation best practices.
`)
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
      {/* Skip Link for Keyboard Navigation */}
      <a href="#main-content" className="skip-link">
        Skip to documentation content
      </a>

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
            <Box
              role="status"
              aria-live="polite"
              aria-label="Loading documentation"
              style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--gray-11)' }}
            >
              Loading documentation...
            </Box>
          ) : (
            <Box id="main-content" className="markdown-document">
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
