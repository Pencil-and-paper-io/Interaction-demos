import { Routes, Route, Navigate } from 'react-router-dom'
import { FlowProvider } from './proto1-components/layout/FlowProvider'
import FlowContainer from './proto1-components/layout/FlowContainer'
import ErrorBoundary from './proto1-components/feedback/ErrorBoundary'
import WelcomePage from './proto1-pages/WelcomePage'
import Step1Page from './proto1-pages/Step1Page'
import Step2Page from './proto1-pages/Step2Page'
import './proto1-styles/theme.css'

export default function Prototype1() {
  return (
    <FlowProvider>
      <ErrorBoundary>
        <FlowContainer>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/step-1" element={<Step1Page />} />
            <Route path="/step-2" element={<Step2Page />} />
            <Route path="*" element={<Navigate to="/prototype-1" replace />} />
          </Routes>
        </FlowContainer>
      </ErrorBoundary>
    </FlowProvider>
  )
}
