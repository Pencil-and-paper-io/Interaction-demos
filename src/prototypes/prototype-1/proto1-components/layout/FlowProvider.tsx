import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { FlowState, FlowContextType } from '../../proto1-types'

const STORAGE_KEY = 'proto1-flow-state'

const initialState: FlowState = {
  currentStep: 0,
  formData: {},
  isComplete: false,
}

const FlowContext = createContext<FlowContextType | undefined>(undefined)

export function FlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FlowState>(() => {
    // Load state from localStorage on mount with error handling
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Validate the structure of parsed data
        if (parsed && typeof parsed === 'object' && 'currentStep' in parsed) {
          return parsed
        }
      }
    } catch (error) {
      // localStorage may be disabled, full, or contain invalid JSON
      console.warn('Failed to load flow state from localStorage:', error)
    }
    return initialState
  })

  // Persist state to localStorage whenever it changes with error handling
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      // localStorage may be full or disabled
      console.warn('Failed to persist flow state to localStorage:', error)
      // Continue without localStorage - app will work but won't persist
    }
  }, [state])

  const updateFormData = (key: string, value: unknown) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [key]: value,
      },
    }))
  }

  const nextStep = () => {
    setState(prev => ({
      ...prev,
      currentStep: prev.currentStep + 1,
    }))
  }

  const prevStep = () => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
    }))
  }

  const resetFlow = () => {
    setState(initialState)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to clear flow state from localStorage:', error)
    }
  }

  return (
    <FlowContext.Provider value={{ state, updateFormData, nextStep, prevStep, resetFlow }}>
      {children}
    </FlowContext.Provider>
  )
}

export function useFlow() {
  const context = useContext(FlowContext)
  if (!context) {
    throw new Error('useFlow must be used within FlowProvider')
  }
  return context
}

// Utility function to clear state - called from landing page
export function clearProto1State() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear proto1 state from localStorage:', error)
  }
}
