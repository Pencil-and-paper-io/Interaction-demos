import { useState, useRef, useEffect, useCallback } from 'react'
import { Envelope, Phone, DeviceMobile, X, Check, ArrowLeft } from '@phosphor-icons/react'
import type { OrgChartPerson } from './orgChartData'
import styles from './ErrorBaseScreen.module.css'

type OrgChartDrawerProps = {
  person: OrgChartPerson
  onClose: () => void
  onUpdateSuccess?: (personId: string) => void
  errorVariant?: string
}

type DrawerSelectProps = {
  id: string
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
}

function DrawerSelect({ id, label, options, value, onChange, onBlur }: DrawerSelectProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div className={styles.drawerField}>
      <label className={styles.drawerFieldLabel} htmlFor={id}>
        {label}
      </label>
      <div className={styles.drawerSelectWrap} ref={wrapRef}>
        <button
          ref={triggerRef}
          type="button"
          id={id}
          className={styles.drawerSelectTrigger}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={label}
          onClick={() => setOpen((o) => !o)}
          onBlur={onBlur}
        >
          {value}
        </button>
        {open && (
          <div className={styles.drawerSelectList} role="listbox" aria-label={label}>
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                role="option"
                aria-selected={opt === value}
                className={`${styles.drawerSelectOption} ${opt === value ? styles.drawerSelectOptionSelected : ''}`}
                onClick={() => {
                  onChange(opt)
                  setOpen(false)
                  triggerRef.current?.focus()
                }}
              >
                <span className={styles.drawerSelectOptionCheck} aria-hidden>
                  {opt === value ? <Check size={14} weight="bold" /> : null}
                </span>
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function getInitialFormValues(person: OrgChartPerson) {
  return {
    seniorityLevel: person.seniorityLevel,
    jobTitle: person.jobTitle,
    level: 'Level 2',
    department: person.department,
    location: person.location
  }
}

const initialLevelsAllowed = { level1: true, level2: true, level3: false }

export function OrgChartDrawer({ person, onClose, onUpdateSuccess, errorVariant }: OrgChartDrawerProps) {
  const [formValues, setFormValues] = useState(() => getInitialFormValues(person))
  const [drawerView, setDrawerView] = useState<'form' | 'config'>('form')
  const [levelsAllowed, setLevelsAllowed] = useState(initialLevelsAllowed)
  const [savedLevelsAllowed, setSavedLevelsAllowed] = useState(initialLevelsAllowed)
  const [saveButtonState, setSaveButtonState] = useState<'idle' | 'saved'>('idle')
  const [updateButtonReady, setUpdateButtonReady] = useState(true)
  const [updateButtonEnableAt, setUpdateButtonEnableAt] = useState<number | null>(null)
  const [updateFeedbackState, setUpdateFeedbackState] = useState<'idle' | 'updated'>('idle')
  const initialValues = getInitialFormValues(person)

  useEffect(() => {
    setFormValues(getInitialFormValues(person))
    setDrawerView('form')
    setLevelsAllowed(initialLevelsAllowed)
    setSavedLevelsAllowed(initialLevelsAllowed)
    setSaveButtonState('idle')
    setUpdateButtonReady(true)
    setUpdateButtonEnableAt(null)
    setUpdateFeedbackState('idle')
  }, [person])

  useEffect(() => {
    if (updateButtonEnableAt === null) return
    const t = setTimeout(() => setUpdateButtonReady(true), 600)
    return () => clearTimeout(t)
  }, [updateButtonEnableAt])

  const isOneStar = errorVariant === '1-star'
  const isTwoStar = errorVariant === '2-star'
  const isThreeStar = errorVariant === '3-star'

  const handleBackFromConfig = useCallback(() => {
    setDrawerView('form')
    setUpdateButtonReady(false)
    setUpdateButtonEnableAt(Date.now())
    if (isThreeStar) {
      setFormValues((prev) => ({ ...prev, level: 'Level 2' }))
    }
  }, [isThreeStar])
  const levelIsInvalid =
    formValues.level === 'Level 3' && (isOneStar || isTwoStar || (isThreeStar && !levelsAllowed.level3))
  const levelCountsAsDirty = formValues.level !== initialValues.level && !levelIsInvalid
  const showLevelInlineError = (isOneStar || isTwoStar || isThreeStar) && formValues.level === 'Level 3' && !levelsAllowed.level3
  const levelInlineErrorText = isTwoStar || isThreeStar ? 'Level is not allowed' : 'value not allowed'
  const showConfigBanner = (isTwoStar || isThreeStar) && formValues.level === 'Level 3' && !levelsAllowed.level3

  const isDirty =
    formValues.seniorityLevel !== initialValues.seniorityLevel ||
    formValues.jobTitle !== initialValues.jobTitle ||
    levelCountsAsDirty ||
    formValues.department !== initialValues.department ||
    formValues.location !== initialValues.location

  const configIsDirty =
    levelsAllowed.level1 !== savedLevelsAllowed.level1 ||
    levelsAllowed.level2 !== savedLevelsAllowed.level2 ||
    levelsAllowed.level3 !== savedLevelsAllowed.level3

  if (drawerView === 'config') {
    return (
      <>
        <div className={styles.drawerBackdrop} onClick={onClose} aria-hidden="true" />
        <div className={styles.drawer} role="dialog" aria-labelledby="drawer-config-title" aria-modal="true">
          <button
            type="button"
            className={styles.drawerClose}
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X size={20} weight="bold" />
          </button>
          <div className={styles.drawerConfigHeader}>
            <button
              type="button"
              className={styles.drawerBackBtn}
              onClick={handleBackFromConfig}
              aria-label="Back to form"
            >
              <ArrowLeft size={20} weight="bold" />
            </button>
            <h2 id="drawer-config-title" className={styles.drawerConfigTitle}>
              Role configuration
            </h2>
          </div>
          <div className={styles.drawerBody}>
            <div className={styles.drawerField}>
              <label className={styles.drawerFieldLabel}>Role name</label>
              <input type="text" className={styles.drawerFieldInput} defaultValue={person.jobTitle} readOnly />
            </div>
            <div className={styles.drawerField}>
              <label className={styles.drawerFieldLabel}>Role ID</label>
              <input type="text" className={styles.drawerFieldInput} defaultValue={person.jobRoleId} readOnly />
            </div>
            <div className={styles.drawerField}>
              <label className={styles.drawerFieldLabel}>Department</label>
              <input type="text" className={styles.drawerFieldInput} defaultValue={person.department} readOnly />
            </div>
            <div className={styles.drawerField}>
              <label className={styles.drawerFieldLabel}>Default seniority</label>
              <input type="text" className={styles.drawerFieldInput} defaultValue="Intermediate" readOnly />
            </div>
            <div className={styles.drawerField}>
              <label className={styles.drawerFieldLabel}>Reporting structure</label>
              <input type="text" className={styles.drawerFieldInput} defaultValue="Standard" readOnly />
            </div>
            <div className={styles.drawerField}>
              <label className={styles.drawerFieldLabel}>Levels allowed for this role</label>
              <div className={styles.drawerCheckboxList}>
                <label className={styles.drawerCheckboxRow}>
                  <input
                    type="checkbox"
                    checked={levelsAllowed.level1}
                    onChange={(e) => setLevelsAllowed((p) => ({ ...p, level1: e.target.checked }))}
                  />
                  <span>Level 1</span>
                </label>
                <label className={styles.drawerCheckboxRow}>
                  <input
                    type="checkbox"
                    checked={levelsAllowed.level2}
                    onChange={(e) => setLevelsAllowed((p) => ({ ...p, level2: e.target.checked }))}
                  />
                  <span>Level 2</span>
                </label>
                <label className={styles.drawerCheckboxRow}>
                  <input
                    type="checkbox"
                    checked={levelsAllowed.level3}
                    onChange={(e) => setLevelsAllowed((p) => ({ ...p, level3: e.target.checked }))}
                  />
                  <span>Level 3</span>
                </label>
              </div>
            </div>
            {levelsAllowed.level3 && (
              <p className={styles.drawerConfigApplyMessage}>
                This will apply to all people with this job role across the organization.
              </p>
            )}
          </div>
          <div className={styles.drawerFooter}>
            <button
              type="button"
              className={styles.drawerUpdateBtn}
              disabled={saveButtonState === 'saved' || !configIsDirty}
              aria-disabled={saveButtonState === 'saved' || !configIsDirty}
              onClick={() => {
                setSavedLevelsAllowed(levelsAllowed)
                setSaveButtonState('saved')
                setTimeout(() => setSaveButtonState('idle'), 2000)
              }}
            >
              {saveButtonState === 'saved' ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className={styles.drawerBackdrop} onClick={onClose} aria-hidden="true" />
      <div className={styles.drawer} role="dialog" aria-labelledby="drawer-title" aria-modal="true">
        <button
          type="button"
          className={styles.drawerClose}
          onClick={onClose}
          aria-label="Close drawer"
        >
          <X size={20} weight="bold" />
        </button>
        <div className={styles.drawerHeader}>
          <h2 id="drawer-title" className={styles.drawerTitle}>
            {person.name}
          </h2>
          <p className={styles.drawerSubtitle}>
            {person.jobTitle} ({person.jobRoleId})
          </p>
          <div className={styles.drawerContact}>
            <div className={styles.drawerContactRow}>
              <Envelope size={18} weight="regular" />
              <span>{person.email}</span>
            </div>
            <div className={styles.drawerContactRow}>
              <Phone size={18} weight="regular" />
              <span>{person.phone}</span>
            </div>
            <div className={styles.drawerContactRow}>
              <DeviceMobile size={18} weight="regular" />
              <span>{person.mobile}</span>
            </div>
          </div>
        </div>
        <div className={styles.drawerBody}>
          {showConfigBanner && (
            <div className={styles.drawerErrorBanner} role="alert">
              Level cannot be adjusted due
              <br />
              to role configuration
              {isThreeStar && (
                <button
                  type="button"
                  className={styles.drawerBannerEditBtn}
                  onClick={() => setDrawerView('config')}
                >
                  Edit Settings
                </button>
              )}
            </div>
          )}
          <DrawerSelect
            id="drawer-seniority"
            label="Seniority level"
            options={['Intermediate - Level 2', 'Senior - Level 3', 'Principal', 'Executive']}
            value={formValues.seniorityLevel}
            onChange={(v) => setFormValues((prev) => ({ ...prev, seniorityLevel: v }))}
          />
          <DrawerSelect
            id="drawer-role"
            label="Job role"
            options={['Network Engineer', 'Team lead technical', 'R&D Head', 'Mathematician', 'CTO']}
            value={formValues.jobTitle}
            onChange={(v) => setFormValues((prev) => ({ ...prev, jobTitle: v }))}
          />
          <>
            <DrawerSelect
              id="drawer-level"
              label="Level"
              options={['Level 1', 'Level 2', 'Level 3']}
              value={formValues.level}
              onChange={(v) => setFormValues((prev) => ({ ...prev, level: v }))}
              onBlur={
                isOneStar || isTwoStar || isThreeStar
                  ? undefined
                  : () => {
                      if (formValues.level === 'Level 3') {
                        setFormValues((prev) => ({ ...prev, level: 'Level 2' }))
                      }
                    }
              }
            />
            {showLevelInlineError && (
              <span className={styles.drawerFieldError} role="alert">
                {levelInlineErrorText}
              </span>
            )}
          </>
          <DrawerSelect
            id="drawer-dept"
            label="Department"
            options={['IT & Technology', 'R&D', 'Technology']}
            value={formValues.department}
            onChange={(v) => setFormValues((prev) => ({ ...prev, department: v }))}
          />
          <DrawerSelect
            id="drawer-location"
            label="Location"
            options={[
              'New York, United States',
              'Chicago, United States',
              'Boston, United States',
              'San Francisco, United States',
              'Princeton, United States'
            ]}
            value={formValues.location}
            onChange={(v) => setFormValues((prev) => ({ ...prev, location: v }))}
          />
          <div className={styles.drawerField}>
            <label className={styles.drawerFieldLabel} htmlFor="drawer-start">
              Start Date
            </label>
            <input
              id="drawer-start"
              type="text"
              className={styles.drawerFieldInput}
              defaultValue={person.startDate}
              readOnly
            />
          </div>
        </div>
        <div className={styles.drawerFooter}>
          <button
            type="button"
            className={`${styles.drawerUpdateBtn} ${updateFeedbackState === 'updated' ? styles.drawerUpdateBtnUpdated : ''}`}
            disabled={!isDirty || !updateButtonReady || updateFeedbackState === 'updated'}
            aria-disabled={!isDirty || !updateButtonReady || updateFeedbackState === 'updated'}
            onClick={() => {
              if (updateFeedbackState === 'updated') return
              setUpdateFeedbackState('updated')
              setTimeout(() => {
                onUpdateSuccess?.(person.id)
                onClose()
              }, 1200)
            }}
          >
            {updateFeedbackState === 'updated' ? (
              <>
                <Check size={16} weight="bold" className={styles.drawerUpdateBtnCheck} aria-hidden />
                Updated
              </>
            ) : (
              'UPDATE'
            )}
          </button>
        </div>
      </div>
    </>
  )
}
