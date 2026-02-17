import { useState, useCallback } from 'react'
import {
  MagnifyingGlass,
  Question,
  CaretDown,
  House,
  Star,
  TreeStructure,
  MapPin,
  ChartBar,
  SquaresFour,
  Plus,
  Minus
} from '@phosphor-icons/react'
import { orgChartRoot, type OrgChartNode, type OrgChartPerson } from './orgChartData'
import { OrgChartDrawer } from './OrgChartDrawer'
import styles from './ErrorBaseScreen.module.css'

type ErrorBaseScreenProps = {
  errorVariant?: string
}

export function ErrorBaseScreen({ errorVariant }: ErrorBaseScreenProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['1', '3']))
  const [drawerPerson, setDrawerPerson] = useState<OrgChartPerson | null>(null)

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const openDrawer = useCallback((person: OrgChartPerson) => {
    setDrawerPerson(person)
  }, [])

  const closeDrawer = useCallback(() => {
    setDrawerPerson(null)
  }, [])

  return (
    <div className={styles.root}>
      <aside className={styles.sidebar} aria-label="App navigation">
        <div className={styles.sidebarTitle}>HR Suite Org</div>
        <div className={styles.sidebarIconWrap}>
          <button type="button" className={styles.sidebarIcon} aria-label="Home">
            <House size={22} weight="fill" />
          </button>
        </div>
        <button type="button" className={styles.sidebarIcon} aria-label="Favorites">
          <Star size={22} weight="regular" />
        </button>
        <div className={`${styles.sidebarIconWrap} ${styles.sidebarIconWrapActive}`}>
          <button type="button" className={styles.sidebarIcon} aria-label="Org chart" aria-current="true">
            <TreeStructure size={22} weight="fill" />
          </button>
        </div>
        <button type="button" className={styles.sidebarIcon} aria-label="Location">
          <MapPin size={22} weight="regular" />
        </button>
        <button type="button" className={styles.sidebarIcon} aria-label="Dashboard">
          <ChartBar size={22} weight="regular" />
        </button>
      </aside>
      <div className={styles.mainWrap}>
        <header className={styles.topBar} aria-label="Top navigation">
          <span className={styles.breadcrumb}>HR Suite &gt; Technical Department</span>
          <div className={styles.topBarIcons}>
            <button type="button" aria-label="Search">
              <MagnifyingGlass size={20} weight="regular" />
            </button>
            <button type="button" aria-label="Help">
              <Question size={20} weight="regular" />
            </button>
            <button type="button" aria-label="App launcher">
              <SquaresFour size={20} weight="regular" />
            </button>
          </div>
        </header>

        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Technical Department</h1>
          <div className={styles.headerActions}>
            <button type="button" className={styles.headerBtn}>
              EXPAND TO <CaretDown size={14} weight="bold" />
            </button>
            <button type="button" className={styles.headerBtn}>
              EXPORT <CaretDown size={14} weight="bold" />
            </button>
            <div className={styles.viewToggle}>
              <button type="button" className={styles.viewToggleBtn} aria-label="List view">
                <ChartBar size={20} weight="regular" />
              </button>
              <button type="button" className={`${styles.viewToggleBtn} ${styles.viewToggleBtnActive}`} aria-label="Org chart view" aria-pressed="true">
                <TreeStructure size={20} weight="fill" />
              </button>
            </div>
          </div>
        </div>

      <main className={styles.main}>
        <div className={styles.orgChart}>
          <svg className={styles.orgChartLines} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <line x1="50" y1="8" x2="50" y2="30" />
            <line x1="24" y1="16.5" x2="76" y2="16.5" />
          </svg>
          <div className={styles.orgChartContent}>
          <OrgChartTree
            node={orgChartRoot}
            expandedIds={expandedIds}
            toggleExpand={toggleExpand}
            openDrawer={openDrawer}
            drawerPersonId={drawerPerson?.id ?? null}
          />
          </div>
        </div>
      </main>

      </div>
      {drawerPerson && <OrgChartDrawer person={drawerPerson} onClose={closeDrawer} errorVariant={errorVariant} />}
    </div>
  )
}

type OrgChartTreeProps = {
  node: OrgChartNode
  expandedIds: Set<string>
  toggleExpand: (id: string) => void
  openDrawer: (person: OrgChartPerson) => void
  drawerPersonId: string | null
}

function OrgChartTree({ node, expandedIds, toggleExpand, openDrawer, drawerPersonId }: OrgChartTreeProps) {
  const { person, children } = node
  const isExpanded = expandedIds.has(person.id)
  const hasChildren = children.length > 0

  return (
    <div className={styles.nodeConnector}>
      <button
        type="button"
        className={`${styles.nodeCard} ${drawerPersonId === person.id ? styles.nodeCardSelected : ''}`}
        onClick={() => openDrawer(person)}
      >
        <div className={styles.nodeName}>
          {person.name} ({person.employeeId})
        </div>
        <div className={styles.nodeMeta}>
          {person.jobTitle} ({person.jobRoleId})
        </div>
        <div className={styles.nodeLocation}>{person.location}</div>
      </button>
      {hasChildren && (
        <>
          <div className={person.id === '3' ? styles.expandBtnRowAboveManjul : undefined} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <button
              type="button"
              className={styles.expandBtn}
              onClick={(e) => { e.stopPropagation(); toggleExpand(person.id) }}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <Minus size={14} weight="bold" /> : <Plus size={14} weight="bold" />}
            </button>
            {!isExpanded && (
              <span className={styles.expandBadge} aria-hidden="true">
                {children.length}
              </span>
            )}
          </div>
          {isExpanded && (
            <div className={styles.nodeChildren}>
              {children.map((child) => (
                <OrgChartTree
                  key={child.person.id}
                  node={child}
                  expandedIds={expandedIds}
                  toggleExpand={toggleExpand}
                  openDrawer={openDrawer}
                  drawerPersonId={drawerPersonId}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
