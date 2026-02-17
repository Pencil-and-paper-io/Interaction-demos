import { useParams, Link } from 'react-router-dom'
import { Box } from '@radix-ui/themes'
import { getCategoryBySegment, getVariantBySegment, getDemoPath } from '../data/demo-categories'
import { BaseScreenPlaceholder } from './BaseScreenPlaceholder'
import { SuccessBaseScreen } from './success/SuccessBaseScreen'
import { ErrorBaseScreen } from './error/ErrorBaseScreen'
import { WarningBaseScreen } from './warning/WarningBaseScreen'
import { CopyEmbedButton } from './CopyEmbedButton'
import { Navigate } from 'react-router-dom'
import styles from './DemoView.module.css'

const LOGO_URL = 'https://cdn.prod.website-files.com/65d32a145451f865e1ca2bbe/6993889ac812dd64878ad545_LogoPNP.png'

export function DemoView() {
  const { category: categorySegment, variant: variantSegment } = useParams<{
    category: string
    variant: string
  }>()
  const category = categorySegment ? getCategoryBySegment(categorySegment) : undefined
  const variant =
    category && variantSegment ? getVariantBySegment(category, variantSegment) : undefined

  if (!categorySegment || !category) {
    return <Navigate to="/" replace />
  }

  if (!variantSegment) {
    return <Navigate to={getDemoPath(categorySegment)} replace />
  }

  if (!variant) {
    return <Navigate to={getDemoPath(categorySegment)} replace />
  }

  const pageTitle = `${category.title} — ${variant.title}`
  const isSuccess = category.routeSegment === 'success'
  const isError = category.routeSegment === 'error'
  const isWarning = category.routeSegment === 'warning'

  return (
    <div className={styles.layout}>
      {/* Content area ~85%: container with stroke, rounding, shadow */}
      <section className={styles.contentSection} aria-label="Demo content">
        <div className={styles.contentContainer}>
          {isSuccess ? (
            <SuccessBaseScreen successVariant={variant.routeSegment} />
          ) : isError ? (
            <ErrorBaseScreen errorVariant={variant.routeSegment} />
          ) : isWarning ? (
            <WarningBaseScreen warningVariant={variant.routeSegment} />
          ) : (
            <Box style={{ padding: 'var(--space-6)', maxWidth: '900px', margin: '0 auto' }}>
              <BaseScreenPlaceholder categoryTitle={category.title} />
            </Box>
          )}
          <div className={styles.copyEmbedFloating}>
            <CopyEmbedButton
              title={pageTitle}
              iconOnly
              tooltip="Copy embed"
              showCopiedLabel
              className={styles.copyEmbedFloatingBtn}
            />
          </div>
        </div>
      </section>

      {/* Header bar ~15%: flat, no stroke */}
      <header className={styles.headerBar}>
        <div className={styles.header}>
          <div className={styles.headerLeftPill}>
            <Link to="/demos" className={styles.logoLink} aria-label="Back to Interaction demos">
              <img src={LOGO_URL} alt="" className={styles.logoImg} />
            </Link>
            <Link to="/demos" className={styles.interactionDemosLink}>
              Interaction demos
            </Link>
            <span className={styles.breadcrumbSep} aria-hidden="true">
              {' > '}
            </span>
            <span className={styles.demoTitle} title={pageTitle}>
              {pageTitle}
            </span>
          </div>
        </div>
      </header>
    </div>
  )
}
