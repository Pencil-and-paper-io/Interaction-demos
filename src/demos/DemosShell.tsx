import { Routes, Route, Navigate } from 'react-router-dom'
import { CategoryHub } from './CategoryHub'
import { DemoView } from './DemoView'

/**
 * Router for /demos/:category and /demos/:category/:variant.
 * Renders category hub (base screen + variant list) or demo view (base screen + reaction + embed).
 */
export default function DemosShell() {
  return (
    <Routes>
      <Route path="/:category" element={<CategoryHub />} />
      <Route path="/:category/:variant" element={<DemoView />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
