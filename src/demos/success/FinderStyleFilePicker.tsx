import { useState, useCallback } from 'react'
import {
  CaretLeft,
  CaretRight,
  CaretUp,
  Folder,
  File,
  FilePdf,
  MagnifyingGlass,
  SquaresFour,
  Star,
  Cloud,
  Globe,
  Monitor,
  DownloadSimple
} from '@phosphor-icons/react'
import styles from './FinderStyleFilePicker.module.css'

const MOCK_FILES = [
  { id: 'f1', name: 'Overview.pdf', type: 'pdf' },
  { id: 'f2', name: 'Contacts_2021.csv', type: 'csv' },
  { id: 'f3', name: 'Project-Scope.pdf', type: 'pdf' },
  { id: 'f4', name: 'Notes.txt', type: 'txt' },
  { id: 'f5', name: 'Budget.xlsx', type: 'xlsx' }
]

type FinderStyleFilePickerProps = {
  onChoose: (selectedCount: number, selectedFileNames: string[]) => void
  onCancel: () => void
}

export function FinderStyleFilePicker({ onChoose, onCancel }: FinderStyleFilePickerProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggleFile = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleChoose = useCallback(() => {
    const selectedFileNames = MOCK_FILES.filter((f) => selectedIds.has(f.id)).map((f) => f.name)
    onChoose(selectedIds.size, selectedFileNames)
  }, [selectedIds, onChoose])

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Choose files for upload"
      onClick={onCancel}
    >
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerNav}>
            <button type="button" className={styles.headerNavBtn} aria-label="Back">
              <CaretLeft size={18} weight="bold" />
            </button>
            <button type="button" className={styles.headerNavBtn} aria-label="Forward">
              <CaretRight size={18} weight="bold" />
            </button>
            <button type="button" className={styles.headerNavBtn} aria-label="View options">
              <SquaresFour size={18} weight="regular" />
            </button>
          </div>
          <div className={styles.headerTitle}>
            <Folder size={20} weight="regular" style={{ color: '#5e7ce2' }} />
            <span>Folder</span>
            <button type="button" className={styles.headerNavBtn} aria-label="Parent folder">
              <CaretUp size={18} weight="bold" />
            </button>
          </div>
          <div className={styles.headerSearch}>
            <MagnifyingGlass size={16} weight="regular" style={{ color: '#6b7280' }} />
            <input type="text" placeholder="Search" defaultValue="" aria-label="Search" />
          </div>
        </div>

        <div className={styles.body}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarSection}>
              <div className={styles.sidebarSectionTitle}>Favorites</div>
              <button type="button" className={`${styles.sidebarItem} ${styles.sidebarItemActive}`}>
                <Star size={18} weight="fill" />
                Applications
              </button>
              <button type="button" className={styles.sidebarItem}>
                <Monitor size={18} weight="regular" />
                Desktop
              </button>
              <button type="button" className={styles.sidebarItem}>
                <Folder size={18} weight="regular" />
                Folder
              </button>
              <button type="button" className={styles.sidebarItem}>
                <Folder size={18} weight="regular" />
                Folder
              </button>
              <button type="button" className={styles.sidebarItem}>
                <File size={18} weight="regular" />
                Documents
              </button>
              <button type="button" className={styles.sidebarItem}>
                <DownloadSimple size={18} weight="regular" />
                Downloads
              </button>
            </div>
            <div className={styles.sidebarSection}>
              <div className={styles.sidebarSectionTitle}>iCloud</div>
              <button type="button" className={styles.sidebarItem}>
                <Cloud size={18} weight="regular" />
                iCloud Drive
              </button>
            </div>
            <div className={styles.sidebarSection}>
              <div className={styles.sidebarSectionTitle}>Locations</div>
              <button type="button" className={styles.sidebarItem}>
                <Globe size={18} weight="regular" />
                Network
              </button>
            </div>
          </aside>

          <div className={styles.content}>
            <div className={styles.foldersColumn}>
              <button type="button" className={`${styles.folderItem} ${styles.folderItemActive}`}>
                <Folder size={20} weight="regular" />
                Folder
              </button>
              <button type="button" className={styles.folderItem}>
                <Folder size={20} weight="regular" />
                Folder
              </button>
              <button type="button" className={styles.folderItem}>
                <Folder size={20} weight="regular" />
                Folder
              </button>
            </div>
            <div className={styles.filesColumn}>
              {MOCK_FILES.map((file) => (
                <button
                  key={file.id}
                  type="button"
                  className={`${styles.fileItem} ${selectedIds.has(file.id) ? styles.fileItemSelected : ''}`}
                  onClick={() => toggleFile(file.id)}
                >
                  {file.type === 'pdf' ? (
                    <FilePdf size={20} weight="regular" />
                  ) : (
                    <File size={20} weight="regular" />
                  )}
                  {file.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" className={`${styles.footerBtn} ${styles.footerBtnSecondary} ${styles.newFolderBtn}`}>
            New Folder
          </button>
          <button type="button" className={`${styles.footerBtn} ${styles.footerBtnSecondary}`} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={`${styles.footerBtn} ${styles.footerBtnPrimary}`}
            onClick={handleChoose}
            disabled={selectedIds.size === 0}
          >
            Choose for upload
          </button>
        </div>
      </div>
    </div>
  )
}
