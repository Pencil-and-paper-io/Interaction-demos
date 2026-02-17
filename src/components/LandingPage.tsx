import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import {
  ChartLine,
  CheckCircle,
  CursorClick,
  Star,
  StarHalf,
  XCircle,
  Warning
} from '@phosphor-icons/react'
import ThemeToggle from './ThemeToggle'
import { clearProto1State } from '../prototypes/prototype-1/proto1-components/layout/FlowProvider'
import { demoCategories, getDemoPath, type DemoCategory, type DemoVariant } from '../data/demo-categories'
import styles from './LandingPage.module.css'

const categoryIcons: Record<string, React.ElementType> = {
  success: CheckCircle,
  error: XCircle,
  warning: Warning,
  'system-status': ChartLine
}

/** Icon for each variant: cursor click (baseline), star outline bold (1-star), star half (2-star), star fill (3-star). Others use category icon. */
function getVariantIcon(variant: DemoVariant, category: DemoCategory): { Icon: React.ElementType; weight?: 'bold' | 'fill' | 'regular' } {
  switch (variant.routeSegment) {
    case 'baseline':
      return { Icon: CursorClick, weight: 'regular' }
    case '1-star':
      return { Icon: Star, weight: 'bold' }
    case '2-star':
      return { Icon: StarHalf, weight: 'regular' }
    case '3-star':
      return { Icon: Star, weight: 'fill' }
    default:
      return { Icon: categoryIcons[category.id] ?? ChartLine, weight: 'regular' }
  }
}

export default function LandingPage() {
  const [logoVisible, setLogoVisible] = useState(true)
  useEffect(() => {
    clearProto1State()
  }, [])

  return (
    <div className={styles.root}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className={styles.headerRow}>
        <div className={styles.titleBlock}>
          {logoVisible && (
            <img
              src="https://cdn.prod.website-files.com/65d32a145451f865e1ca2bbe/6993889ac812dd64878ad545_LogoPNP.png"
              alt=""
              className={styles.logo}
              onError={() => setLogoVisible(false)}
            />
          )}
          <h1 className={styles.pageTitle}>Interaction demos</h1>
        </div>
        <div className={styles.themeRow}>
          <span>Theme</span>
          <ThemeToggle />
        </div>
      </header>

      <main id="main-content" className={styles.mainContent}>
        {demoCategories.map((category) => {
          const hasVariants = category.variants.length > 0
          return (
            <section key={category.id} className={styles.categorySection} aria-labelledby={`category-${category.id}`}>
              <h2 id={`category-${category.id}`} className={styles.categoryHeading}>
                {category.title}
              </h2>
              <ul className={styles.demoList}>
                {hasVariants ? (
                  category.variants.map((variant) => {
                    const { Icon, weight = 'regular' } = getVariantIcon(variant, category)
                    return (
                      <li key={variant.id} className={styles.demoItem}>
                        <Link
                          to={getDemoPath(category.routeSegment, variant.routeSegment)}
                          className={styles.demoItemLink}
                        >
                          <span className={styles.demoItemIconCell} aria-hidden>
                            <Icon size={28} weight={weight} />
                          </span>
                          <span className={styles.demoItemTitle}>{variant.title}</span>
                        </Link>
                      </li>
                    )
                  })
                ) : (
                  <li className={styles.demoItem}>
                    <span className={styles.demoItemLink} style={{ cursor: 'default' }}>
                      <span className={styles.demoItemIconCell} aria-hidden>
                        <ChartLine size={28} weight="regular" />
                      </span>
                      <span className={styles.demoItemTitle}>TBD</span>
                    </span>
                  </li>
                )}
              </ul>
            </section>
          )
        })}
      </main>
    </div>
  )
}
