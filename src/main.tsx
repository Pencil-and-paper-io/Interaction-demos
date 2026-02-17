import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Theme } from '@radix-ui/themes'
import { ThemeProvider, useTheme } from './utils/themeContext'
import App from './App.tsx'
import './index.css'
import '@radix-ui/themes/styles.css'

function ThemedApp() {
  const { theme } = useTheme()

  return (
    <Theme
      appearance={theme}
      accentColor="blue"
      grayColor="slate"
      radius="medium"
      scaling="100%"
    >
      <BrowserRouter basename={import.meta.env.BASE_URL === '/' || import.meta.env.BASE_URL === '' ? undefined : import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </Theme>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  </StrictMode>
)
