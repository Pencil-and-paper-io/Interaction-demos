import { Link, useParams, Navigate } from 'react-router-dom'
import { Box, Heading, Text, Flex, Card } from '@radix-ui/themes'
import { getCategoryBySegment, getDemoPath } from '../data/demo-categories'
import { BaseScreenPlaceholder } from './BaseScreenPlaceholder'
import { SuccessBaseScreen } from './success/SuccessBaseScreen'
import { ErrorBaseScreen } from './error/ErrorBaseScreen'
import { WarningBaseScreen } from './warning/WarningBaseScreen'

export function CategoryHub() {
  const { category: categorySegment } = useParams<{ category: string }>()
  const category = categorySegment ? getCategoryBySegment(categorySegment) : undefined

  if (!categorySegment || !category) {
    return <Navigate to="/" replace />
  }

  const isSuccess = category.routeSegment === 'success'
  const isError = category.routeSegment === 'error'
  const isWarning = category.routeSegment === 'warning'

  return (
    <Box style={{ padding: isSuccess || isError || isWarning ? 0 : 'var(--space-6)', maxWidth: isSuccess || isError || isWarning ? 'none' : '900px', margin: '0 auto' }}>
      <Flex direction="column" gap="6">
        {!isSuccess && !isError && !isWarning && (
          <Flex justify="between" align="center" wrap="wrap" gap="4">
            <Box>
              <Heading size="8" style={{ color: 'var(--gray-12)' }}>
                {category.title}
              </Heading>
              <Text size="3" style={{ color: 'var(--gray-11)', marginTop: 'var(--space-2)' }}>
                {category.description}
              </Text>
            </Box>
          </Flex>
        )}

        {isSuccess ? <SuccessBaseScreen /> : isError ? <ErrorBaseScreen /> : isWarning ? <WarningBaseScreen /> : <BaseScreenPlaceholder categoryTitle={category.title} />}

        <Box style={isSuccess || isError || isWarning ? { padding: 'var(--space-6)', maxWidth: '900px', margin: '0 auto', width: '100%' } : undefined}>
          <Heading size="4" mb="3" style={{ color: 'var(--gray-12)' }}>
            Demos
          </Heading>
          <Text size="2" style={{ color: 'var(--gray-11)', marginBottom: 'var(--space-4)' }}>
            Same base screen and trigger; each link shows a different reaction.
          </Text>
          {category.variants.length === 0 ? (
            <Text size="2" style={{ color: 'var(--gray-10)' }}>
              Variants TBD.
            </Text>
          ) : (
            <Flex gap="3" wrap="wrap">
              {category.variants.map((variant) => (
                <Card key={variant.id} size="2" asChild>
                  <Link
                    to={getDemoPath(category.routeSegment, variant.routeSegment)}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      padding: 'var(--space-4)',
                      display: 'block'
                    }}
                  >
                    <Text size="3" weight="medium" style={{ color: 'var(--accent-11)' }}>
                      {variant.title}
                    </Text>
                  </Link>
                </Card>
              ))}
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  )
}
