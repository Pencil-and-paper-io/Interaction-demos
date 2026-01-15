import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import LandingPage from './components/LandingPage'
import DocumentationPage from './components/DocumentationPage'
import { Box, Heading } from '@radix-ui/themes'

// Lazy load prototypes
const Prototype1 = lazy(() => import('./prototypes/prototype-1/Prototype1'))
const Prototype2 = lazy(() => import('./prototypes/prototype-2'))

// Loading component
function LoadingFallback() {
  return (
    <Box style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh'
    }}>
      <Heading size="6">Loading...</Heading>
    </Box>
  )
}

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/docs/:prototypeId" element={<DocumentationPage />} />
        <Route path="/prototype-1/*" element={<Prototype1 />} />
        <Route path="/prototype-2" element={<Prototype2 />} />
        {/* Additional prototype routes will be added here by scaffold command */}
      </Routes>
    </Suspense>
  )
}

export default App
