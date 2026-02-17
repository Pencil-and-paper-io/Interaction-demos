import { useState, useCallback, useRef, useEffect } from 'react'
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

const LINE_COLOR = '#5e7ce2'

type ErrorBaseScreenProps = {
  errorVariant?: string
}

export function ErrorBaseScreen({ errorVariant }: ErrorBaseScreenProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['1', '3']))
  const [drawerPerson, setDrawerPerson] = useState<OrgChartPerson | null>(null)
  const [highlightCardId, setHighlightCardId] = useState<string | null>(null)
  const nodeRefs = useRef<Record<string, HTMLElement | null>>({})
  const linesRef = useRef<{ remove(): void }[]>([])

  const registerNodeRef = useCallback((id: string, el: HTMLElement | null) => {
    nodeRefs.current[id] = el
  }, [])

  useEffect(() => {
    // When the drawer is open, hide connectors entirely so they never sit above the UI
    if (drawerPerson) {
      linesRef.current.forEach((line) => line.remove())
      linesRef.current = []
      return
    }

    const LeaderLine = window.LeaderLine
    if (!LeaderLine) return

    const raf = requestAnimationFrame(() => {
      linesRef.current.forEach((line) => line.remove())
      linesRef.current = []

      const get = (id: string) => nodeRefs.current[id]
      const one = get('1')
      const two = get('2')
      const three = get('3')
      const four = get('4')
      const five = get('5')

      const opts = {
        startSocket: 'bottom' as const,
        endSocket: 'top' as const,
        color: LINE_COLOR,
        size: 2,
        path: 'grid',
        startPlug: 'behind',
        endPlug: 'disc',
        // Keep connectors visually under overlays/drawers
        zIndex: 10
      }
      if (one && two) linesRef.current.push(new LeaderLine(one, two, opts))
      if (one && three) linesRef.current.push(new LeaderLine(one, three, opts))
      if (one && four) linesRef.current.push(new LeaderLine(one, four, opts))
      if (expandedIds.has('3') && three && five) linesRef.current.push(new LeaderLine(three, five, opts))
    })

    return () => {
      cancelAnimationFrame(raf)
      linesRef.current.forEach((line) => line.remove())
      linesRef.current = []
    }
  }, [expandedIds, drawerPerson])

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

  const handleUpdateSuccess = useCallback((personId: string) => {
    setHighlightCardId(personId)
    setDrawerPerson(null)
  }, [])

  useEffect(() => {
    if (highlightCardId === null) return
    const t = setTimeout(() => setHighlightCardId(null), 2000)
    return () => clearTimeout(t)
  }, [highlightCardId])

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
          <div className={styles.orgChartContent}>
          <OrgChartTree
            node={orgChartRoot}
            expandedIds={expandedIds}
            toggleExpand={toggleExpand}
            openDrawer={openDrawer}
            drawerPersonId={drawerPerson?.id ?? null}
            highlightCardId={highlightCardId}
            registerNodeRef={registerNodeRef}
          />
          </div>
        </div>
      </main>

      </div>
      {drawerPerson && (
        <OrgChartDrawer
          person={drawerPerson}
          onClose={closeDrawer}
          onUpdateSuccess={handleUpdateSuccess}
          errorVariant={errorVariant}
        />
      )}
    </div>
  )
}

type OrgChartTreeProps = {
  node: OrgChartNode
  expandedIds: Set<string>
  toggleExpand: (id: string) => void
  openDrawer: (person: OrgChartPerson) => void
  drawerPersonId: string | null
  highlightCardId: string | null
  registerNodeRef: (id: string, el: HTMLElement | null) => void
}

function OrgChartTree({ node, expandedIds, toggleExpand, openDrawer, drawerPersonId, highlightCardId, registerNodeRef }: OrgChartTreeProps) {
  const { person, children } = node
  const isExpanded = expandedIds.has(person.id)
  const hasChildren = children.length > 0
  const isHighlighted = highlightCardId === person.id

  return (
    <div className={styles.nodeConnector}>
      <button
        ref={(el) => registerNodeRef(person.id, el)}
        type="button"
        className={`${styles.nodeCard} ${drawerPersonId === person.id ? styles.nodeCardSelected : ''} ${isHighlighted ? styles.nodeCardHighlighted : ''}`}
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
                  highlightCardId={highlightCardId}
                  registerNodeRef={registerNodeRef}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
