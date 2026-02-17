import { useState, useRef, useEffect } from 'react'
import { PencilSimple, DotsThree, MagnifyingGlass, Bell, CaretDown, FolderOpen, ListChecks, Palette, Trash, X } from '@phosphor-icons/react'
import styles from './WarningBaseScreen.module.css'

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

type WarningBaseScreenProps = {
  warningVariant?: string
}

export function WarningBaseScreen({ warningVariant }: WarningBaseScreenProps) {
  const [openMenuTaskId, setOpenMenuTaskId] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const isConfirmation = warningVariant === 'confirmation'

  useEffect(() => {
    if (!openMenuTaskId) return
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuTaskId(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openMenuTaskId])

  const openDeleteModal = () => {
    setOpenMenuTaskId(null)
    setShowDeleteModal(true)
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
              3 PHASE STANDARD
              <PencilSimple size={14} weight="regular" className={styles.chipEditIcon} aria-hidden />
            </span>
          </div>
          <div className={styles.heroMetaCol}>
            <span className={styles.heroMetaLabel}>Type</span>
            <span className={styles.chipEditable}>
              <Palette size={16} weight="regular" className={styles.chipLeadIcon} aria-hidden />
              DESIGN
              <PencilSimple size={14} weight="regular" className={styles.chipEditIcon} aria-hidden />
            </span>
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
        {taskSections.map((section) => (
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
                  {section.tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.name}</td>
                      <td className={statusClass(task.status)}>{task.status}</td>
                      <td>{task.dueDate}</td>
                      <td>{task.assignee}</td>
                      <td>{task.timeEstimated}</td>
                      <td>{task.taskType}</td>
                      <td>
                        <div className={styles.rowMenuWrap} ref={openMenuTaskId === task.id ? menuRef : undefined}>
                          <button
                            type="button"
                            className={styles.rowMenuBtn}
                            aria-label={`Menu for ${task.name}`}
                            aria-expanded={openMenuTaskId === task.id}
                            onClick={() => setOpenMenuTaskId((id) => (id === task.id ? null : task.id))}
                          >
                            <DotsThree size={18} weight="bold" />
                          </button>
                          {isConfirmation && openMenuTaskId === task.id && (
                            <div className={styles.rowMenuDropdown}>
                              <button
                                type="button"
                                className={styles.rowMenuItem}
                                onClick={openDeleteModal}
                              >
                                <Trash size={16} weight="regular" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </main>

      {isConfirmation && showDeleteModal && (
        <>
          <div className={styles.modalBackdrop} onClick={() => setShowDeleteModal(false)} aria-hidden="true" />
          <div className={styles.modal} role="dialog" aria-labelledby="confirm-modal-title" aria-modal="true">
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setShowDeleteModal(false)}
              aria-label="Close"
            >
              <X size={20} weight="bold" />
            </button>
            <h2 id="confirm-modal-title" className={styles.modalTitle}>Confirmation</h2>
            <p className={styles.modalBody}>
              Deleting this task will be a permanent and irreversible change.
            </p>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.modalCancelBtn} onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button type="button" className={styles.modalConfirmBtn} onClick={() => setShowDeleteModal(false)}>
                Confirm
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
