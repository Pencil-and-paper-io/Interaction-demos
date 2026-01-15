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
    // Load state from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return initialState
      }
    }
    return initialState
  })

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
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
    localStorage.removeItem(STORAGE_KEY)
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
  localStorage.removeItem(STORAGE_KEY)
}
