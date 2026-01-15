import { Link } from 'react-router-dom'
import { useMemo, useEffect, useState, useRef, memo } from 'react'
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

// Memoized screenshot component with Intersection Observer for efficient lazy loading
const PrototypeScreenshot = memo(function PrototypeScreenshot({
  prototypeId,
  IconComponent
}: {
  prototypeId: string
  IconComponent: React.ElementType
}) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Use Intersection Observer for efficient lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect() // Stop observing once visible
          }
        })
      },
      {
        rootMargin: '50px', // Start loading slightly before entering viewport
        threshold: 0.01,
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const screenshotPath = `${import.meta.env.BASE_URL}screenshots/${prototypeId}.png`.replace('//', '/')

  return (
    <Box
      ref={containerRef}
      style={{
        height: 'var(--preview-height-md)',
        backgroundColor: 'var(--gray-3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid var(--gray-6)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Only load image when container is visible */}
      {isVisible && (
        <img
          src={screenshotPath}
          alt={`Screenshot preview of ${prototypeId}`}
          loading="lazy"
          decoding="async"
          style={{
            position: 'absolute',
            width: 0,
            height: 0,
            opacity: 0,
            pointerEvents: 'none'
          }}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      )}

      {/* Show screenshot as background if loaded */}
      {imageLoaded && !imageError && (
        <Box
          role="img"
          aria-label={`Screenshot preview of ${prototypeId}`}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${screenshotPath})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Show icon only if screenshot failed to load or not yet loaded */}
      {(!imageLoaded || imageError) && (
        <IconComponent
          size="80"
          style={{
            color: 'var(--gray-9)',
            opacity: 0.3,
            width: 'var(--icon-size-3xl)',
            height: 'var(--icon-size-3xl)'
          }}
          weight="duotone"
        />
      )}
    </Box>
  )
})

export default function LandingPage() {
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
      {/* Skip Link for Keyboard Navigation */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <Flex direction="column" align="center" gap="6" mb="9">
        <Flex justify="between" align="center" width="100%" className="fluid-container-lg">
          <Box />
          <Flex align="center" gap="3">
            <Text size="2" style={{ color: 'var(--gray-11)' }}>
              Theme
            </Text>
            <ThemeToggle />
          </Flex>
        </Flex>

        <Box style={{ textAlign: 'center' }} className="fluid-container-md">
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
      <main id="main-content">
      {prototypes.length === 0 ? (
        <Box
          className="fluid-container-sm"
          style={{
            textAlign: 'center',
            padding: 'var(--space-9)',
          }}
        >
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
          className="fluid-container-xl"
          style={{ width: '100%' }}
        >
          {prototypes.map((prototype) => {
            const IconComponent = prototype.icon
            return (
              <Card
                key={prototype.id}
                size="4"
                asChild
              >
                <div
                  className="prototype-card"
                  style={{
                    position: 'relative',
                    minHeight: '450px',
                    display: 'flex',
                    flexDirection: 'column',
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
                      asChild
                    >
                      <Link
                        to={prototype.route}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textDecoration: 'none',
                          width: '100%'
                        }}
                      >
                        View Prototype
                      </Link>
                    </Button>
                    <Button
                      size="3"
                      variant="soft"
                      asChild
                    >
                      <Link
                        to={`/docs/${prototype.id}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textDecoration: 'none',
                          width: '100%'
                        }}
                      >
                        Documentation
                      </Link>
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
                        e.stopPropagation()
                        e.preventDefault()
                        window.open(prototype.loomUrl, '_blank', 'noopener,noreferrer')
                      }}
                    >
                      <Play
                        size="16"
                        weight="fill"
                        style={{ width: 'var(--icon-size-sm)', height: 'var(--icon-size-sm)' }}
                      />
                      Watch Loom
                    </Button>
                  )}
                </Flex>
                </div>
              </Card>
            )
          })}
        </Grid>
      )}
      </main>
    </Box>
  )
}
