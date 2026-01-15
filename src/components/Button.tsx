import { CSSProperties, ReactNode, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'soft' | 'ghost'
  size?: '2' | '3'
  children: ReactNode
  style?: CSSProperties
}

export default function Button({
  variant = 'solid',
  size = '3',
  className = '',
  children,
  style: customStyle,
  ...props
}: ButtonProps) {
  const baseStyles: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-3)',
    fontSize: size === '2' ? 'var(--font-size-2)' : 'var(--font-size-3)',
    fontWeight: 'var(--font-weight-medium)',
    padding: size === '2' ? 'var(--space-2) var(--space-3)' : 'var(--space-3) var(--space-4)',
    cursor: 'pointer',
    border: 'none',
    transition: 'all var(--duration-normal) ease',
    fontFamily: 'var(--default-font-family)',
    width: '100%',
  }

  const variantStyles: Record<string, CSSProperties> = {
    solid: {
      backgroundColor: 'var(--accent-9)',
      color: 'white',
    },
    soft: {
      backgroundColor: 'var(--accent-3)',
      color: 'var(--accent-11)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--gray-11)',
    },
  }

  const combinedStyles = { ...baseStyles, ...variantStyles[variant], ...customStyle }

  return (
    <button
      className={className}
      style={combinedStyles}
      {...props}
    >
      {children}
    </button>
  )
}
