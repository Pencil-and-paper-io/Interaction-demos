// Types for Prototype 1
export interface FlowState {
  currentStep: number
  formData: Record<string, unknown>
  isComplete: boolean
}

export interface FlowContextType {
  state: FlowState
  updateFormData: (key: string, value: unknown) => void
  nextStep: () => void
  prevStep: () => void
  resetFlow: () => void
}
