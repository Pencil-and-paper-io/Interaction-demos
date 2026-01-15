import { IconButton } from '@radix-ui/themes'
import { Moon, Sun } from '@phosphor-icons/react'
import { useTheme } from '../utils/themeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <IconButton
      variant="ghost"
      size="3"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      style={{ cursor: 'pointer' }}
    >
      {theme === 'light' ? (
        <Moon size="20" weight="fill" style={{ width: 'var(--icon-size-md)', height: 'var(--icon-size-md)' }} />
      ) : (
        <Sun size="20" weight="fill" style={{ width: 'var(--icon-size-md)', height: 'var(--icon-size-md)' }} />
      )}
    </IconButton>
  )
}
