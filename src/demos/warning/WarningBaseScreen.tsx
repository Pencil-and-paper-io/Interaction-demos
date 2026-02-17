import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { PencilSimple, DotsThree, MagnifyingGlass, Bell, CaretDown, FolderOpen, ListChecks, Palette, Trash, X } from '@phosphor-icons/react'
import styles from './WarningBaseScreen.module.css'

const DROPDOWN_WIDTH = 140

type TaskStatus = 'Complete' | 'In progress' | 'Draft'

type Task = {
  id: string
  name: string
  status: TaskStatus
  dueDate: string
  assignee: string
  timeEstimated: string
  taskType: string
}

type TaskSection = {
  title: string
  tasks: Task[]
}

const taskSections: TaskSection[] = [
  {
    title: 'Phase 1',
    tasks: [
      { id: '1', name: 'Kickoff', status: 'Complete', dueDate: 'Jan 15, 2025', assignee: 'J. Smith', timeEstimated: '2h', taskType: 'Meeting' },
      { id: '2', name: 'Requirements review', status: 'In progress', dueDate: 'Jan 22, 2025', assignee: 'A. Lee', timeEstimated: '4h', taskType: 'Review' },
      { id: '3', name: 'Scope document', status: 'Draft', dueDate: 'Jan 28, 2025', assignee: 'M. Chen', timeEstimated: '6h', taskType: 'Document' },
      { id: '4', name: 'Stakeholder sign-off', status: 'Draft', dueDate: 'Feb 2, 2025', assignee: 'K. Jones', timeEstimated: '1h', taskType: 'Approval' }
    ]
  },
  {
    title: 'Phase 2',
    tasks: [
      { id: '5', name: 'Design sprint', status: 'Draft', dueDate: 'Feb 10, 2025', assignee: 'A. Lee', timeEstimated: '16h', taskType: 'Design' },
      { id: '6', name: 'Wireframes', status: 'Draft', dueDate: 'Feb 14, 2025', assignee: 'S. Park', timeEstimated: '8h', taskType: 'Design' },
      { id: '7', name: 'Prototype', status: 'Draft', dueDate: 'Feb 20, 2025', assignee: 'S. Park', timeEstimated: '12h', taskType: 'Design' },
      { id: '8', name: 'Design review', status: 'Draft', dueDate: 'Feb 24, 2025', assignee: 'M. Chen', timeEstimated: '2h', taskType: 'Review' }
    ]
  }
]

function statusClass(status: TaskStatus): string {
  switch (status) {
    case 'Complete':
      return styles.statusComplete
    case 'In progress':
      return styles.statusInProgress
    default:
      return styles.statusDraft
  }
}

type ProjectType = 'design' | 'refresh' | 'audit' | 'analysis'
type CompletedTaskChoice = 'keep' | 'remove' | null

const TYPE_TO_WORKFLOW: Record<ProjectType, string> = {
  design: '3 phase standard',
  refresh: 'UI Workflow',
  audit: 'Audit workflow',
  analysis: 'Analysis workflow'
}

const LOADING_PHASES: TaskSection[] = [
  {
    title: 'Audit Phase',
    tasks: [
      { id: 'a1', name: 'Initial audit', status: 'Draft', dueDate: 'Mar 1, 2025', assignee: 'J. Smith', timeEstimated: '4h', taskType: 'Audit' },
      { id: 'a2', name: 'Findings report', status: 'Draft', dueDate: 'Mar 5, 2025', assignee: 'M. Chen', timeEstimated: '6h', taskType: 'Document' }
    ]
  },
  {
    title: 'UI Refresh Phase',
    tasks: [
      { id: 'u1', name: 'UI audit', status: 'Draft', dueDate: 'Mar 8, 2025', assignee: 'S. Park', timeEstimated: '8h', taskType: 'Design' },
      { id: 'u2', name: 'Component refresh', status: 'Draft', dueDate: 'Mar 12, 2025', assignee: 'A. Lee', timeEstimated: '12h', taskType: 'Design' },
      { id: 'u3', name: 'QA pass', status: 'Draft', dueDate: 'Mar 15, 2025', assignee: 'K. Jones', timeEstimated: '4h', taskType: 'Review' }
    ]
  },
  {
    title: 'Flow Optimization',
    tasks: [
      { id: 'f1', name: 'Flow mapping', status: 'Draft', dueDate: 'Mar 18, 2025', assignee: 'J. Smith', timeEstimated: '6h', taskType: 'Analysis' },
      { id: 'f2', name: 'Optimization tasks', status: 'Draft', dueDate: 'Mar 22, 2025', assignee: 'M. Chen', timeEstimated: '10h', taskType: 'Implementation' }
    ]
  }
]

function getAllLoadingTaskIds(): string[] {
  return LOADING_PHASES.flatMap((s) => s.tasks.map((t) => t.id))
}

type WarningBaseScreenProps = {
  warningVariant?: string
}

export function WarningBaseScreen({ warningVariant }: WarningBaseScreenProps) {
  const [openMenuTaskId, setOpenMenuTaskId] = useState<string | null>(null)
  const [dropdownAnchor, setDropdownAnchor] = useState<{ top: number; left: number } | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [pendingDeleteTaskId, setPendingDeleteTaskId] = useState<string | null>(null)
  const [deletedTaskIds, setDeletedTaskIds] = useState<Set<string>>(new Set())
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const isConfirmation = warningVariant === 'confirmation'

  // Dependencies variant: project info modal and post-save loading
  const [showProjectInfoModal, setShowProjectInfoModal] = useState(false)
  const [projectType, setProjectType] = useState<ProjectType>('design')
  const [completedTaskChoice, setCompletedTaskChoice] = useState<CompletedTaskChoice>(null)
  const [workflowPhase, setWorkflowPhase] = useState<'idle' | 'loading' | 'loaded'>('idle')
  const [visibleLoadingTaskIds, setVisibleLoadingTaskIds] = useState<Set<string>>(new Set())
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false)
  const [typeDropdownAnchor, setTypeDropdownAnchor] = useState<{ top: number; left: number; width: number } | null>(null)
  const typeDropdownRef = useRef<HTMLDivElement>(null)
  const isDependencies = warningVariant === 'dependencies'
  const workflowLabel = TYPE_TO_WORKFLOW[projectType]
  const showRefreshWarning = isDependencies && projectType === 'refresh'
  const canSaveProjectInfo = !showRefreshWarning || completedTaskChoice !== null
  const displayTypeLabel = (workflowPhase === 'loading' || workflowPhase === 'loaded') ? 'REFRESH' : projectType.toUpperCase()
  const displayWorkflowLabel = (workflowPhase === 'loading' || workflowPhase === 'loaded') ? 'UI WORKFLOW' : '3 PHASE STANDARD'

  const closeMenu = () => {
    setOpenMenuTaskId(null)
    setDropdownAnchor(null)
  }

  useEffect(() => {
    if (!openMenuTaskId) return
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (menuRef.current?.contains(target)) return
      if ((e.target as Element).closest?.('[data-row-menu-trigger]')) return
      closeMenu()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openMenuTaskId])

  useEffect(() => {
    if (!isTypeDropdownOpen) return
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (typeDropdownRef.current?.contains(target)) return
      if ((e.target as Element).closest?.('[data-project-type-trigger]')) return
      setIsTypeDropdownOpen(false)
      setTypeDropdownAnchor(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isTypeDropdownOpen])

  const openMenu = (taskId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setOpenMenuTaskId(taskId)
    setDropdownAnchor({
      top: rect.bottom + 4,
      left: rect.right - DROPDOWN_WIDTH
    })
  }

  const openDeleteModal = () => {
    if (!openMenuTaskId) return
    closeMenu()
    setPendingDeleteTaskId(openMenuTaskId)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setPendingDeleteTaskId(null)
  }

  const confirmDelete = () => {
    if (!pendingDeleteTaskId) return
    const taskIdToDelete = pendingDeleteTaskId
    setShowDeleteModal(false)
    setPendingDeleteTaskId(null)
    // Start row transition only after modal is closed
    setDeletingTaskId(taskIdToDelete)
    const deleteAnimationMs = 420
    setTimeout(() => {
      setDeletedTaskIds((prev) => new Set([...prev, taskIdToDelete]))
      setDeletingTaskId(null)
    }, deleteAnimationMs)
  }

  const openProjectInfoModal = () => {
    setProjectType('design')
    setCompletedTaskChoice(null)
    setShowProjectInfoModal(true)
    setIsTypeDropdownOpen(false)
    setTypeDropdownAnchor(null)
  }

  const closeProjectInfoModal = () => {
    setShowProjectInfoModal(false)
    setCompletedTaskChoice(null)
    setIsTypeDropdownOpen(false)
    setTypeDropdownAnchor(null)
  }

  const saveProjectInfo = () => {
    if (!canSaveProjectInfo) return
    setShowProjectInfoModal(false)
    setCompletedTaskChoice(null)
    setIsTypeDropdownOpen(false)
    setTypeDropdownAnchor(null)
    setWorkflowPhase('loading')
    setVisibleLoadingTaskIds(new Set())
    const allIds = getAllLoadingTaskIds()
    allIds.forEach((id, i) => {
      setTimeout(() => {
        setVisibleLoadingTaskIds((prev) => new Set([...prev, id]))
      }, 400 + i * 120)
    })
    const totalDelay = 400 + allIds.length * 120
    setTimeout(() => setWorkflowPhase('loaded'), totalDelay + 100)
  }

  const toggleTypeDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setIsTypeDropdownOpen((prev) => !prev)
    setTypeDropdownAnchor({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width
    })
  }

  const selectProjectType = (nextType: ProjectType) => {
    setProjectType(nextType)
    setCompletedTaskChoice(null)
    setIsTypeDropdownOpen(false)
    setTypeDropdownAnchor(null)
  }

  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <span className={styles.appLogo}>
            <FolderOpen size={22} weight="duotone" />
            <span>ProjectHub</span>
          </span>
          <nav className={styles.topBarNav} aria-label="Main">
            <a href="#" className={styles.topBarNavLink}>Projects</a>
            <span className={styles.topBarNavSep}>/</span>
            <span className={styles.topBarNavCurrent}>Project Alpha</span>
          </nav>
        </div>
        <div className={styles.topBarRight}>
          <button type="button" className={styles.topBarIconBtn} aria-label="Search">
            <MagnifyingGlass size={20} weight="regular" />
          </button>
          <button type="button" className={styles.topBarIconBtn} aria-label="Notifications">
            <Bell size={20} weight="regular" />
          </button>
          <button type="button" className={styles.topBarUserBtn}>
            <span className={styles.topBarUserAvatar}>JD</span>
            <span className={styles.topBarUserName}>Jane Doe</span>
            <CaretDown size={14} weight="bold" />
          </button>
        </div>
      </div>

      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>Project Alpha</h1>
        <div className={styles.heroMeta}>
          <div className={styles.heroMetaCol}>
            <span className={styles.heroMetaLabel}>Workflow</span>
            <span className={styles.chipEditable}>
              <ListChecks size={16} weight="regular" className={styles.chipLeadIcon} aria-hidden />
              {displayWorkflowLabel}
              {!isDependencies && <PencilSimple size={14} weight="regular" className={styles.chipEditIcon} aria-hidden />}
            </span>
          </div>
          <div className={styles.heroMetaCol}>
            <span className={styles.heroMetaLabel}>Type</span>
            {isDependencies ? (
              <button
                type="button"
                className={styles.chipEditable}
                onClick={openProjectInfoModal}
                aria-label="Edit project type"
              >
                <Palette size={16} weight="regular" className={styles.chipLeadIcon} aria-hidden />
                {displayTypeLabel}
                <PencilSimple size={14} weight="regular" className={styles.chipEditIcon} aria-hidden />
              </button>
            ) : (
              <span className={styles.chipEditable}>
                <Palette size={16} weight="regular" className={styles.chipLeadIcon} aria-hidden />
                DESIGN
                <PencilSimple size={14} weight="regular" className={styles.chipEditIcon} aria-hidden />
              </span>
            )}
          </div>
          <div className={styles.heroMetaCol}>
            <span className={styles.heroMetaLabel}>Status</span>
            <div>
              <span className={styles.chipStatus}>ACTIVE</span>
              <span className={styles.heroStatusExtra}>50 DAYS LEFT</span>
            </div>
          </div>
          <div className={styles.heroMetaCol}>
            <span className={styles.heroMetaLabel}>Assignees</span>
            <div className={styles.assigneeAvatars}>
              <span className={`${styles.assigneeAvatar} ${styles.assigneeAvatar1}`} title="J. Smith">JJ</span>
              <span className={`${styles.assigneeAvatar} ${styles.assigneeAvatar2}`} title="M. Chen">CC</span>
              <span className={`${styles.assigneeAvatar} ${styles.assigneeAvatar3}`} title="S. Park">FV</span>
              <span className={`${styles.assigneeAvatar} ${styles.assigneeAvatar4}`} title="A. Lee">MO</span>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.content}>
        {isDependencies && (workflowPhase === 'loading' || workflowPhase === 'loaded') ? (
          LOADING_PHASES.map((section) => (
            <section key={section.title} className={styles.section}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Due date</th>
                      <th>Assignee</th>
                      <th>Time estimated</th>
                      <th>Task type</th>
                      <th aria-label="Row menu" />
                    </tr>
                  </thead>
                  <tbody>
                    {section.tasks.map((task) => {
                      const isVisible = visibleLoadingTaskIds.has(task.id)
                      return (
                        <tr
                          key={task.id}
                          className={isVisible ? styles.rowLoaded : styles.rowShimmer}
                        >
                          {isVisible ? (
                            <>
                              <td>{task.name}</td>
                              <td className={statusClass(task.status)}>{task.status}</td>
                              <td>{task.dueDate}</td>
                              <td>{task.assignee}</td>
                              <td>{task.timeEstimated}</td>
                              <td>{task.taskType}</td>
                              <td />
                            </>
                          ) : (
                            <>
                              <td colSpan={7}>
                                <div className={styles.shimmerBar} />
                              </td>
                            </>
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ))
        ) : (
          taskSections.map((section) => (
            <section key={section.title} className={styles.section}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Due date</th>
                      <th>Assignee</th>
                      <th>Time estimated</th>
                      <th>Task type</th>
                      <th aria-label="Row menu" />
                    </tr>
                  </thead>
                  <tbody>
                    {section.tasks
                      .filter((task) => !deletedTaskIds.has(task.id))
                      .map((task) => {
                        const isDeleting = deletingTaskId === task.id
                        return (
                          <tr
                            key={task.id}
                            className={isDeleting ? styles.rowDeleting : undefined}
                          >
                            <td>{task.name}</td>
                            <td className={statusClass(task.status)}>{task.status}</td>
                            <td>{task.dueDate}</td>
                            <td>{task.assignee}</td>
                            <td>{task.timeEstimated}</td>
                            <td>{task.taskType}</td>
                            <td>
                              <div className={styles.rowMenuWrap}>
                                <button
                                  type="button"
                                  data-row-menu-trigger
                                  className={styles.rowMenuBtn}
                                  aria-label={`Menu for ${task.name}`}
                                  aria-expanded={openMenuTaskId === task.id}
                                  onClick={(e) => openMenuTaskId === task.id ? closeMenu() : openMenu(task.id, e)}
                                >
                                  <DotsThree size={18} weight="bold" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </section>
          ))
        )}
      </main>

      {isConfirmation && openMenuTaskId && dropdownAnchor && (
        createPortal(
          <div
            ref={menuRef}
            className={styles.rowMenuDropdown}
            style={{
              position: 'fixed',
              top: dropdownAnchor.top,
              left: dropdownAnchor.left,
              width: DROPDOWN_WIDTH
            }}
          >
            <button
              type="button"
              className={styles.rowMenuItem}
              onClick={openDeleteModal}
            >
              <Trash size={16} weight="regular" />
              Delete
            </button>
          </div>,
          document.body
        )
      )}

      {isConfirmation && showDeleteModal && (
        <>
          <div className={styles.modalBackdrop} onClick={closeDeleteModal} aria-hidden="true" />
          <div className={styles.modal} role="dialog" aria-labelledby="confirm-modal-title" aria-modal="true">
            <button
              type="button"
              className={styles.modalClose}
              onClick={closeDeleteModal}
              aria-label="Close"
            >
              <X size={20} weight="bold" />
            </button>
            <h2 id="confirm-modal-title" className={styles.modalTitle}>Confirmation</h2>
            <p className={styles.modalBody}>
              Deleting this task will be a permanent and irreversible change.
            </p>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.modalCancelBtn} onClick={closeDeleteModal}>
                Cancel
              </button>
              <button type="button" className={styles.modalConfirmBtn} onClick={confirmDelete}>
                Confirm
              </button>
            </div>
          </div>
        </>
      )}

      {isDependencies && showProjectInfoModal && (
        <>
          <div className={styles.modalBackdrop} onClick={closeProjectInfoModal} aria-hidden="true" />
          <div className={styles.modalProjectInfo} role="dialog" aria-labelledby="project-info-modal-title" aria-modal="true">
            <button
              type="button"
              className={styles.modalClose}
              onClick={closeProjectInfoModal}
              aria-label="Close"
            >
              <X size={20} weight="bold" />
            </button>
            <h2 id="project-info-modal-title" className={styles.modalTitle}>Project information</h2>
            <p className={styles.modalBody}>
              Changing the project type impacts the workflows available.
            </p>
            <div className={styles.modalForm}>
              <label className={styles.modalLabel}>
                Type
              </label>
              <button
                type="button"
                data-project-type-trigger
                className={`${styles.modalSelectButton} ${isTypeDropdownOpen ? styles.modalSelectButtonOpen : ''}`}
                aria-haspopup="listbox"
                aria-expanded={isTypeDropdownOpen}
                onClick={toggleTypeDropdown}
              >
                <span className={styles.modalSelectValue}>
                  {projectType === 'design' ? 'Design' : projectType === 'refresh' ? 'Refresh' : projectType === 'audit' ? 'Audit' : 'Analysis'}
                </span>
                <CaretDown size={16} weight="bold" className={styles.modalSelectChevron} aria-hidden />
              </button>

              <label className={styles.modalLabel}>Workflow</label>
              <div className={styles.modalReadOnly}>{workflowLabel}</div>
              {showRefreshWarning && (
                <div className={styles.modalWarningBlock}>
                  <p className={styles.modalWarningText}>
                    Refresh projects cause the default workflow to change to UI Workflow — removing 42 tasks which don&apos;t apply.
                    What would you like to do with your (1) completed task?
                  </p>
                  <div className={styles.modalChoiceRow}>
                    <button
                      type="button"
                      className={`${styles.choiceChip} ${completedTaskChoice === 'keep' ? styles.choiceChipSelected : ''}`}
                      onClick={() => setCompletedTaskChoice('keep')}
                    >
                      Keep (1) task
                    </button>
                    <button
                      type="button"
                      className={`${styles.choiceChip} ${completedTaskChoice === 'remove' ? styles.choiceChipSelected : ''}`}
                      onClick={() => setCompletedTaskChoice('remove')}
                    >
                      Remove (1) task
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.modalCancelBtn} onClick={closeProjectInfoModal}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.modalConfirmBtn}
                onClick={saveProjectInfo}
                disabled={!canSaveProjectInfo}
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}

      {isDependencies && showProjectInfoModal && isTypeDropdownOpen && typeDropdownAnchor && (
        createPortal(
          <div
            ref={typeDropdownRef}
            className={styles.modalSelectMenu}
            role="listbox"
            aria-label="Project type"
            style={{
              position: 'fixed',
              top: typeDropdownAnchor.top,
              left: typeDropdownAnchor.left,
              width: typeDropdownAnchor.width
            }}
          >
            {(['design', 'refresh', 'audit', 'analysis'] as ProjectType[]).map((t) => {
              const label = t === 'design' ? 'Design' : t === 'refresh' ? 'Refresh' : t === 'audit' ? 'Audit' : 'Analysis'
              const selected = projectType === t
              return (
                <button
                  key={t}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`${styles.modalSelectOption} ${selected ? styles.modalSelectOptionSelected : ''}`}
                  onClick={() => selectProjectType(t)}
                >
                  {selected && <span className={styles.modalSelectCheck} aria-hidden>✓</span>}
                  <span>{label}</span>
                </button>
              )
            })}
          </div>,
          document.body
        )
      )}
    </div>
  )
}
