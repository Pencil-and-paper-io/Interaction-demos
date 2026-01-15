import { useNavigate } from 'react-router-dom'
import { useMemo, useEffect, useState } from 'react'
import { Grid, Card, Heading, Text, Box, Flex, Inset, Button } from '@radix-ui/themes'
import { Play, Cube, Sparkle } from '@phosphor-icons/react'
import { getRelativeTime } from '../utils/relativeTime'
import ThemeToggle from './ThemeToggle'
import prototypeDates from '../data/prototype-dates.json'
import { clearProto1State } from '../prototypes/prototype-1/proto1-components/layout/FlowProvider'

type PrototypeCard = {
  id: string
  title: string
  description: string
  icon: React.ElementType
  route: string
  loomUrl?: string
  lastUpdated: string
}

// This array will be populated by the scaffold command
// or manually when adding new prototypes
const prototypeData: Omit<PrototypeCard, 'lastUpdated'>[] = [
  {
    id: 'prototype-1',
    title: 'Multi-page Flow Example',
    description: 'A multi-step workflow with state management and nested routing',
    icon: Cube,
    route: '/prototype-1'
  },
  {
    id: 'prototype-2',
    title: 'Single-page Example',
    description: 'A simple component showcase using CSS Modules',
    icon: Sparkle,
    route: '/prototype-2'
  }
]

function PrototypeScreenshot({
  prototypeId,
  IconComponent
}: {
  prototypeId: string
  IconComponent: React.ElementType
}) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <Box
      style={{
        height: '280px',
        backgroundColor: 'var(--gray-3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid var(--gray-6)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Hidden img to check if screenshot exists */}
      <img
        src={`/screenshots/${prototypeId}.png`}
        alt=""
        style={{ display: 'none' }}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />

      {/* Show screenshot as background if loaded */}
      {imageLoaded && !imageError && (
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(/screenshots/${prototypeId}.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Show icon only if screenshot failed to load */}
      {(!imageLoaded || imageError) && (
        <IconComponent
          size={80}
          style={{ color: 'var(--gray-9)', opacity: 0.3 }}
          weight="duotone"
        />
      )}
    </Box>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()

  // Clear prototype states when returning to home page
  useEffect(() => {
    clearProto1State()
    // Add more clear functions as prototypes are added
  }, [])

  // Merge prototype data with dates and sort by most recent first
  const prototypes = useMemo(() => {
    return prototypeData
      .map(proto => ({
        ...proto,
        lastUpdated: (prototypeDates as Record<string, string>)[proto.id] || new Date().toISOString()
      }))
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
  }, [])

  return (
    <Box style={{ minHeight: '100vh', padding: 'var(--space-6)' }}>
      {/* Header */}
      <Flex direction="column" align="center" gap="6" mb="9">
        <Flex justify="between" align="center" width="100%" style={{ maxWidth: '1200px' }}>
          <Box />
          <Flex align="center" gap="3">
            <Text size="2" style={{ color: 'var(--gray-11)' }}>
              Theme
            </Text>
            <ThemeToggle />
          </Flex>
        </Flex>

        <Box style={{ textAlign: 'center', maxWidth: '700px' }}>
          <Heading size="9" mb="3" style={{ color: 'var(--gray-12)' }}>
            Prototype Collection
          </Heading>
          <Text size="5" style={{ color: 'var(--gray-11)', lineHeight: 1.6 }}>
            Edit this title and description to match your project.
            This template helps you build and organize interactive prototypes.
          </Text>
        </Box>
      </Flex>

      {/* Prototype Grid */}
      {prototypes.length === 0 ? (
        <Box style={{
          textAlign: 'center',
          padding: 'var(--space-9)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <Heading size="6" mb="4" style={{ color: 'var(--gray-11)' }}>
            No prototypes yet
          </Heading>
          <Text size="3" style={{ color: 'var(--gray-10)' }}>
            Get started by running:
          </Text>
          <Box mt="4" p="4" style={{
            backgroundColor: 'var(--gray-3)',
            borderRadius: 'var(--radius-3)',
            fontFamily: 'monospace'
          }}>
            <Text size="2" weight="medium">npm run new-proto</Text>
          </Box>
          <Text size="2" mt="4" style={{ color: 'var(--gray-10)' }}>
            Or ask Claude Code to create a prototype for you!
          </Text>
        </Box>
      ) : (
        <Grid
          columns={{ initial: '1', sm: '2', lg: '3' }}
          gap="8"
          style={{ maxWidth: '1600px', margin: '0 auto', width: '100%' }}
        >
          {prototypes.map((prototype) => {
            const IconComponent = prototype.icon
            return (
              <Card
                key={prototype.id}
                size="4"
                style={{
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  minHeight: '450px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                {/* Primary Visual Area - Screenshot */}
                <Inset side="top" pb="current">
                  <PrototypeScreenshot
                    prototypeId={prototype.id}
                    IconComponent={IconComponent}
                  />
                </Inset>

                {/* Bottom Section - Metadata & CTAs */}
                <Flex direction="column" gap="4" style={{ flex: 1, padding: 'var(--space-5)' }}>
                  {/* Prototype Name */}
                  <Heading size="5" style={{ color: 'var(--gray-12)' }}>
                    {prototype.title}
                  </Heading>

                  {/* Description */}
                  <Text
                    size="3"
                    style={{
                      color: 'var(--gray-11)',
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {prototype.description}
                  </Text>

                  {/* Relative Date */}
                  <Text size="2" style={{ color: 'var(--gray-10)' }}>
                    {getRelativeTime(prototype.lastUpdated)}
                  </Text>

                  {/* CTAs */}
                  <Flex direction="column" gap="2" style={{ marginTop: 'var(--space-2)' }}>
                    <Button
                      size="3"
                      onClick={() => navigate(prototype.route)}
                    >
                      View Prototype
                    </Button>
                    <Button
                      size="3"
                      variant="soft"
                      onClick={() => navigate(`/docs/${prototype.id}`)}
                    >
                      Documentation
                    </Button>
                  </Flex>

                  {/* Optional Loom Link */}
                  {prototype.loomUrl && (
                    <Button
                      size="2"
                      variant="ghost"
                      style={{
                        width: '100%',
                        gap: 'var(--space-2)',
                        marginTop: 'var(--space-1)',
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        window.open(prototype.loomUrl, '_blank', 'noopener,noreferrer')
                      }}
                    >
                      <Play size={16} weight="fill" />
                      Watch Loom
                    </Button>
                  )}
                </Flex>
              </Card>
            )
          })}
        </Grid>
      )}
    </Box>
  )
}
