import React, { useState, useRef, useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'
import {
  CaretUpDown,
  CaretLeft,
  CaretRight,
  CheckCircle,
  CircleNotch,
  DotsThree,
  File,
  FilePlus,
  Funnel,
  CaretDown,
  Pause,
  Question,
  UserCircle,
  X
} from '@phosphor-icons/react'
import styles from './SuccessBaseScreen.module.css'
import { FinderStyleFilePicker } from './FinderStyleFilePicker'

const GEMS = [
  'Amethyst', 'Ruby', 'Emerald', 'Sapphire', 'Aquamarine', 'Diamond', 'Morganite',
  'Opal', 'Topaz', 'Jade', 'Pearl', 'Onyx', 'Garnet', 'Citrine', 'Turquoise',
  'Lapis', 'Coral', 'Jet', 'Amber', 'Moonstone', 'Peridot', 'Zircon', 'Beryl', 'Spinel', 'Tanzanite'
]
const STATUSES = ['Initial analysis', 'Discovery', 'QA', 'Reporting', 'In progress']
const OWNERS = ['Margaret Rock', 'Mavis Batey', 'Max Newman', 'Alan Turing', 'Dilly Knox', 'Bill Tutte', 'Joan Clarke']

function buildProjects(): Array<{ id: string; name: string; status: string; attachments: number; dateCreated: string; owner: string; dueDate: string }> {
  const list: Array<{ id: string; name: string; status: string; attachments: number; dateCreated: string; owner: string; dueDate: string }> = []
  let idx = 0
  for (let page = 0; page < 5; page++) {
    for (let row = 0; row < 10; row++) {
      idx += 1
      const n = page * 10 + row
      const gem = GEMS[n % GEMS.length]
      const phase = n % 5
      const status = STATUSES[n % STATUSES.length]
      const owner = OWNERS[n % OWNERS.length]
      const createdMonth = 1 + (n % 12)
      const createdDay = 1 + (n % 28)
      const createdYear = 2024 + (row % 2)
      const dueMonth = 1 + ((n + 3) % 12)
      const dueDay = 1 + ((n + 5) % 28)
      let dueDateYear = createdYear + Math.floor(n / 20) % 3
      if (dueDateYear > 2026) dueDateYear = 2026
      if (idx === 10 || idx === 27) dueDateYear = 2027
      const dateCreated = `${String(createdDay).padStart(2, '0')}/${String(createdMonth).padStart(2, '0')}/${createdYear}`
      const dueDate = `${String(dueDay).padStart(2, '0')}/${String(dueMonth).padStart(2, '0')}/${dueDateYear}`
      list.push({
        id: String(idx),
        name: `${gem} - Phase ${phase}`,
        status,
        attachments: 4 + (n * 7) % 125,
        dateCreated,
        owner,
        dueDate
      })
    }
  }
  return list
}

const INITIAL_PROJECTS = buildProjects()
const ROWS_PER_PAGE = 10
const TOTAL_PAGES = 5

type ToastItem = { id: string; message: React.ReactNode; exiting: boolean }

export function SuccessBaseScreen({ successVariant }: { successVariant?: string }) {
  const [projects, setProjects] = useState(INITIAL_PROJECTS)
  const [currentPage, setCurrentPage] = useState(1)
  const [menuOpenRowId, setMenuOpenRowId] = useState<string | null>(null)
  const [filePickerOpen, setFilePickerOpen] = useState(false)
  const [uploadTargetRowId, setUploadTargetRowId] = useState<string | null>(null)
  const [uploadingRowId, setUploadingRowId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [uploadStatusRowId, setUploadStatusRowId] = useState<string | null>(null)
  const [uploadStatusFileNames, setUploadStatusFileNames] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadPaused, setUploadPaused] = useState(false)
  const [uploadCompleteAwaitingDismiss, setUploadCompleteAwaitingDismiss] = useState(false)
  const [uploadStatusDismissing, setUploadStatusDismissing] = useState(false)
  const [overkillOverlayVisible, setOverkillOverlayVisible] = useState(false)
  const [overkillOverlayExiting, setOverkillOverlayExiting] = useState(false)
  const [overkillProgress, setOverkillProgress] = useState(0)
  const [overkillPhase, setOverkillPhase] = useState<'progress' | 'confetti'>('progress')
  const [overkillSubtextVisible, setOverkillSubtextVisible] = useState(false)
  const overkillRowIdRef = useRef<string | null>(null)
  const overkillCountRef = useRef(0)
  const overkillConfettiStartedRef = useRef(false)
  const overkillCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const toastIdRef = useRef(0)
  const dismissTimeoutsRef = useRef<Record<string, number | undefined>>({})
  const uploadIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const uploadCompletionRef = useRef<{ rowId: string; fileCount: number } | null>(null)

  useEffect(() => {
    if (!menuOpenRowId) return
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenRowId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpenRowId])

  useEffect(() => {
    if (!uploadStatusRowId || uploadStatusFileNames.length === 0) return
    if (uploadPaused || uploadCompleteAwaitingDismiss) return
    const id = setInterval(() => {
      setUploadProgress((prev) => {
        const next = prev + 1
        if (next >= 100) {
          if (uploadIntervalRef.current) {
            clearInterval(uploadIntervalRef.current)
            uploadIntervalRef.current = null
          }
          const completion = uploadCompletionRef.current
          if (completion) {
            setProjects((p) =>
              p.map((proj) =>
                proj.id === completion.rowId
                  ? { ...proj, attachments: proj.attachments + completion.fileCount }
                  : proj
              )
            )
            uploadCompletionRef.current = null
          }
          setUploadCompleteAwaitingDismiss(true)
          return 100
        }
        return next
      })
    }, 120)
    uploadIntervalRef.current = id
    return () => {
      if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current)
    }
  }, [uploadStatusRowId, uploadStatusFileNames.length, uploadPaused, uploadCompleteAwaitingDismiss])

  useEffect(() => {
    if (!uploadStatusDismissing) return
    const t = window.setTimeout(() => {
      setUploadStatusRowId(null)
      setUploadStatusFileNames([])
      setUploadProgress(0)
      setUploadPaused(false)
      setUploadCompleteAwaitingDismiss(false)
      setUploadStatusDismissing(false)
    }, 280)
    return () => window.clearTimeout(t)
  }, [uploadStatusDismissing])

  // Overkill: animate progress 0 → 100 over ~2s
  useEffect(() => {
    if (!overkillOverlayVisible || overkillPhase !== 'progress') return
    const start = Date.now()
    const durationMs = 2000
    const tick = () => {
      const elapsed = Date.now() - start
      const p = Math.min(100, (elapsed / durationMs) * 100)
      setOverkillProgress(p)
      if (p < 100) requestAnimationFrame(tick)
    }
    const id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [overkillOverlayVisible, overkillPhase])

  // Overkill: when progress hits 100, switch to confetti and run for 7s (once per overlay).
  // Don't include overkillPhase in deps so the interval isn't cleared when we set phase to 'confetti'.
  useEffect(() => {
    if (!overkillOverlayVisible || overkillProgress < 100) return
    if (overkillConfettiStartedRef.current) return
    overkillConfettiStartedRef.current = true
    setOverkillPhase('confetti')
    setOverkillSubtextVisible(false)
    const subtextTimer = window.setTimeout(() => setOverkillSubtextVisible(true), 1000)
    const rowId = overkillRowIdRef.current
    const count = overkillCountRef.current
    if (rowId && count > 0) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === rowId ? { ...p, attachments: p.attachments + count } : p
        )
      )
      overkillRowIdRef.current = null
      overkillCountRef.current = 0
    }
    const canvas = overkillCanvasRef.current
    const fire = canvas ? confetti.create(canvas) : confetti
    const confettiDurationMs = 7000
    const confettiEnd = Date.now() + confettiDurationMs
    const fadeOutDurationMs = 400
    const interval = setInterval(() => {
      if (Date.now() > confettiEnd) {
        clearInterval(interval)
        window.clearTimeout(subtextTimer)
        setOverkillOverlayExiting(true)
        window.setTimeout(() => {
          overkillConfettiStartedRef.current = false
          setOverkillOverlayVisible(false)
          setOverkillOverlayExiting(false)
          setOverkillProgress(0)
          setOverkillPhase('progress')
          setOverkillSubtextVisible(false)
        }, fadeOutDurationMs)
        return
      }
      fire({ particleCount: 8, spread: 70, origin: { y: 0.6 } })
      fire({ particleCount: 8, angle: 60, spread: 55, origin: { x: 0 } })
      fire({ particleCount: 8, angle: 120, spread: 55, origin: { x: 1 } })
    }, 200)
    return () => {
      clearInterval(interval)
      window.clearTimeout(subtextTimer)
    }
  }, [overkillOverlayVisible, overkillProgress])

  const openAddFiles = (rowId: string) => {
    setMenuOpenRowId(null)
    setUploadTargetRowId(rowId)
    setFilePickerOpen(true)
  }

  const dismissToast = useCallback((id: string) => {
    if (dismissTimeoutsRef.current[id]) {
      window.clearTimeout(dismissTimeoutsRef.current[id])
      dismissTimeoutsRef.current[id] = undefined
    }
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)))
    const exitTimeout = window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
      dismissTimeoutsRef.current[id] = undefined
    }, 300)
    dismissTimeoutsRef.current[id] = exitTimeout
  }, [])

  const addToasts = useCallback(
    (count: number, message: string) => {
      for (let i = 0; i < count; i++) {
        const delay = i * 380
        window.setTimeout(() => {
          toastIdRef.current += 1
          const id = `toast-${toastIdRef.current}`
          const newToast: ToastItem = { id, message, exiting: false }
          setToasts((prev) => [...prev, newToast])
          const dismissTimeout = window.setTimeout(() => dismissToast(id), 10000)
          dismissTimeoutsRef.current[id] = dismissTimeout
        }, delay)
      }
    },
    [dismissToast]
  )

  const addToastsFromFileNames = useCallback(
    (fileNames: string[]) => {
      fileNames.forEach((fileName, i) => {
        const delay = i * 380
        window.setTimeout(() => {
          toastIdRef.current += 1
          const id = `toast-${toastIdRef.current}`
          const message = (
            <>
              <strong>{fileName}</strong> uploaded successfully
            </>
          )
          const newToast: ToastItem = { id, message, exiting: false }
          setToasts((prev) => [...prev, newToast])
          const dismissTimeout = window.setTimeout(() => dismissToast(id), 10000)
          dismissTimeoutsRef.current[id] = dismissTimeout
        }, delay)
      })
    },
    [dismissToast]
  )

  const handleChooseUpload = (selectedCount: number, selectedFileNames: string[] = []) => {
    const rowId = uploadTargetRowId
    setFilePickerOpen(false)
    setUploadTargetRowId(null)

    if (!rowId || selectedCount <= 0) return

    const is2Star = successVariant === '2-star'
    const is3Star = successVariant === '3-star'
    const isOverkill = successVariant === 'overkill'

    if (isOverkill) {
      overkillRowIdRef.current = rowId
      overkillCountRef.current = selectedCount
      overkillConfettiStartedRef.current = false
      setOverkillSubtextVisible(false)
      setOverkillOverlayExiting(false)
      setOverkillOverlayVisible(true)
      setOverkillProgress(0)
      setOverkillPhase('progress')
      return
    }

    if (is3Star) {
      const fileNames = selectedFileNames.length > 0 ? selectedFileNames : Array(selectedCount).fill('File')
      uploadCompletionRef.current = { rowId, fileCount: selectedCount }
      setUploadStatusRowId(rowId)
      setUploadStatusFileNames(fileNames)
      setUploadProgress(0)
      setUploadPaused(false)
    } else if (is2Star) {
      setUploadingRowId(rowId)
      window.setTimeout(() => {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === rowId ? { ...p, attachments: p.attachments + selectedCount } : p
          )
        )
        addToastsFromFileNames(selectedFileNames.length > 0 ? selectedFileNames : Array(selectedCount).fill('File'))
        setUploadingRowId(null)
      }, 1800)
    } else {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === rowId ? { ...p, attachments: p.attachments + selectedCount } : p
        )
      )
      if (successVariant === '1-star') {
        addToasts(selectedCount, 'Task successfully completed')
      }
    }
  }

  return (
    <div className={styles.root}>
      {/* Toasts - 1-star: one per file, green, 10s, smooth transition */}
      {toasts.length > 0 && (
        <div className={styles.toastContainer} role="status" aria-live="polite">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`${styles.toast} ${t.exiting ? styles.toastExiting : ''}`}
            >
              <span className={styles.toastMessage}>{t.message}</span>
              <button
                type="button"
                className={styles.toastClose}
                onClick={() => dismissToast(t.id)}
                aria-label="Dismiss"
              >
                <X size={18} weight="bold" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Primary nav - dark blue #293A71 */}
      <nav className={styles.primaryNav} aria-label="Primary navigation">
        <div className={styles.primaryNavLeft}>
          <a href="#projects" className={`${styles.primaryNavLink} ${styles.primaryNavLinkActive}`}>
            Projects
          </a>
          <a href="#timeline" className={styles.primaryNavLink}>
            Timeline
          </a>
          <a href="#archive" className={styles.primaryNavLink}>
            Archive
          </a>
        </div>
        <div className={styles.primaryNavRight}>
          <div className={styles.avatar} aria-hidden="true">
            <UserCircle size={29} weight="fill" />
          </div>
          <span className={styles.userName}>Alan Turing</span>
          <CaretDown size={18} weight="bold" aria-hidden="true" />
          <Question size={20} weight="regular" aria-label="Help" style={{ cursor: 'pointer' }} />
        </div>
      </nav>

      {/* Secondary nav - periwinkle */}
      <div className={styles.secondaryNav} role="tablist" aria-label="Project filter">
        <div className={styles.secondaryNavTabs}>
          <button
            type="button"
            className={`${styles.secondaryNavTab} ${styles.secondaryNavTabActive}`}
            role="tab"
            aria-selected="true"
          >
            ACTIVE
          </button>
          <button
            type="button"
            className={styles.secondaryNavTab}
            role="tab"
            aria-selected="false"
          >
            ARCHIVED
          </button>
        </div>
        <button type="button" className={styles.newProjectBtn}>
          NEW PROJECT
        </button>
      </div>

      {/* Main content - table on E2E6F1 background */}
      <main className={styles.main}>
        <div className={styles.panel}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      aria-label="Select all rows"
                    />
                  </th>
                  <th>
                    NAME
                    <CaretUpDown size={14} weight="bold" className={styles.sortIcon} aria-hidden="true" />
                  </th>
                  <th>
                    STATUS
                    <CaretUpDown size={14} weight="bold" className={styles.sortIcon} aria-hidden="true" />
                  </th>
                  <th>
                    ATTACHMENTS
                    <CaretUpDown size={14} weight="bold" className={styles.sortIcon} aria-hidden="true" />
                  </th>
                  <th>
                    DATE CREATED
                    <CaretUpDown size={14} weight="bold" className={styles.sortIcon} aria-hidden="true" />
                  </th>
                  <th>
                    OWNER
                    <CaretUpDown size={14} weight="bold" className={styles.sortIcon} aria-hidden="true" />
                  </th>
                  <th>
                    DUE DATE
                    <CaretUpDown size={14} weight="bold" className={styles.sortIcon} aria-hidden="true" />
                  </th>
                  <th>
                    <Funnel size={16} weight="regular" className={styles.filterIcon} aria-label="Filter columns" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE).map((row) => {
                  const showStatusRow = successVariant === '3-star' && uploadStatusRowId === row.id
                  const uploadCurrentIndex = uploadStatusFileNames.length === 0
                    ? 0
                    : Math.min(uploadStatusFileNames.length - 1, Math.floor((uploadProgress / 100) * uploadStatusFileNames.length))
                  const currentFileName = uploadStatusFileNames[uploadCurrentIndex] ?? ''
                  const isCompleteAwaitingDismiss = showStatusRow && uploadCompleteAwaitingDismiss
                  const isDismissing = showStatusRow && uploadStatusDismissing
                  return (
                    <React.Fragment key={row.id}>
                      <tr className={showStatusRow ? styles.dataRowAboveStatus : undefined}>
                        <td>
                          <input
                            type="checkbox"
                            className={styles.checkbox}
                            aria-label={`Select ${row.name}`}
                          />
                        </td>
                        <td>{row.name}</td>
                        <td>
                          <span className={styles.statusPill}>{row.status}</span>
                        </td>
                        <td>
                          <span className={styles.attachments}>
                            {uploadingRowId === row.id && successVariant !== '3-star' ? (
                              <>
                                <CircleNotch size={18} weight="bold" className={styles.attachmentsSpinner} aria-hidden="true" />
                                Uploading…
                              </>
                            ) : (
                              <>
                                <File size={18} weight="regular" aria-hidden="true" />
                                {row.attachments} attached files
                              </>
                            )}
                          </span>
                        </td>
                        <td>{row.dateCreated}</td>
                        <td>{row.owner}</td>
                        <td>{row.dueDate}</td>
                        <td>
                          <div className={styles.rowMenuWrap} ref={menuOpenRowId === row.id ? menuRef : undefined}>
                            <button
                              type="button"
                              className={styles.ellipsis}
                              aria-label={`Actions for ${row.name}`}
                              aria-expanded={menuOpenRowId === row.id}
                              aria-haspopup="true"
                              onClick={() => setMenuOpenRowId(menuOpenRowId === row.id ? null : row.id)}
                            >
                              <DotsThree size={20} weight="bold" />
                            </button>
                            {menuOpenRowId === row.id && (
                              <div className={styles.rowMenuDropdown} role="menu">
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => openAddFiles(row.id)}
                                >
                                  <FilePlus size={18} weight="regular" />
                                  Add files
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                      {showStatusRow && (
                        <tr key={`${row.id}-upload-status`}>
                          <td colSpan={8} className={`${styles.uploadStatusCell} ${isDismissing ? styles.uploadStatusCellDismissing : ''}`}>
                            <div className={`${styles.uploadStatusContainer} ${isDismissing ? styles.uploadStatusContainerDismissing : ''}`}>
                              {isCompleteAwaitingDismiss ? (
                                <CheckCircle size={18} weight="fill" className={styles.uploadStatusCheck} aria-hidden="true" />
                              ) : (
                                <CircleNotch size={18} weight="bold" className={styles.uploadStatusSpinner} aria-hidden="true" />
                              )}
                              <span className={styles.uploadStatusLabel}>
                                {isCompleteAwaitingDismiss ? 'Upload complete' : 'Uploading'}
                              </span>
                              {!isCompleteAwaitingDismiss && (
                                <span className={styles.uploadStatusFilename}>{currentFileName}</span>
                              )}
                              <span className={styles.uploadStatusQueue}>
                                {uploadCurrentIndex + 1} of {uploadStatusFileNames.length}
                              </span>
                              <div className={styles.uploadProgressTrack}>
                                <div className={styles.uploadProgressFill} style={{ width: `${uploadProgress}%` }} />
                              </div>
                              <button
                                type="button"
                                className={styles.uploadPauseBtn}
                                onClick={() => {
                                  if (uploadCompleteAwaitingDismiss) {
                                    setUploadStatusDismissing(true)
                                  } else {
                                    setUploadPaused((p) => !p)
                                  }
                                }}
                                aria-label={uploadCompleteAwaitingDismiss ? 'Close' : uploadPaused ? 'Resume upload' : 'Pause upload'}
                              >
                                {uploadCompleteAwaitingDismiss ? (
                                  <X size={16} weight="bold" />
                                ) : (
                                  <Pause size={16} weight="bold" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className={styles.pagination}>
            <button
              type="button"
              className={styles.paginationBtn}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <CaretLeft size={18} weight="bold" />
            </button>
            {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={`${styles.paginationBtn} ${styles.paginationNum} ${currentPage === page ? styles.paginationNumActive : ''}`}
                onClick={() => setCurrentPage(page)}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              className={styles.paginationBtn}
              onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
              disabled={currentPage === TOTAL_PAGES}
              aria-label="Next page"
            >
              <CaretRight size={18} weight="bold" />
            </button>
          </div>
        </div>
      </main>

      {filePickerOpen && (
        <FinderStyleFilePicker
          onChoose={(count, fileNames) => handleChooseUpload(count, fileNames)}
          onCancel={() => {
            setFilePickerOpen(false)
            setUploadTargetRowId(null)
          }}
        />
      )}

      {successVariant === 'overkill' && overkillOverlayVisible && (
        <div
          className={`${styles.overkillOverlay} ${overkillOverlayExiting ? styles.overkillOverlayExiting : ''}`}
          role="status"
          aria-live="polite"
          aria-label="Upload in progress"
        >
          <canvas
            ref={overkillCanvasRef}
            className={styles.overkillCanvas}
            width={typeof window !== 'undefined' ? window.innerWidth : 800}
            height={typeof window !== 'undefined' ? window.innerHeight : 600}
            aria-hidden="true"
          />
          <div className={styles.overkillContent}>
            {overkillPhase === 'progress' ? (
              <>
                <div className={styles.overkillLabel}>Uploading files…</div>
                <div className={styles.overkillProgressTrack}>
                  <div
                    className={styles.overkillProgressFill}
                    style={{ width: `${overkillProgress}%` }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className={styles.overkillConfettiLabel}>Upload complete!</div>
                {overkillSubtextVisible && (
                  <div className={styles.overkillSubtext}>Amazing job buddy!</div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
