import { useState, useCallback } from 'react'
import { Flex, Button, Text } from '@radix-ui/themes'
import { Link, Copy, Code, Check } from '@phosphor-icons/react'
import { getEmbedUrl, getEmbedSnippet } from './embedUtils'

type CopyEmbedButtonProps = {
  pathname?: string
  title: string
  size?: '1' | '2' | '3'
  variant?: 'solid' | 'soft' | 'ghost' | 'outline'
  /** When true, render only the embed button with Code icon and tooltip. */
  iconOnly?: boolean
  /** Optional class for the icon-only button (e.g. header or floating styles). */
  className?: string
  /** Tooltip text for icon-only button (default: "Copy embed code"). */
  tooltip?: string
  /** When true, show "Copied!" text next to check icon after copy (icon-only). */
  showCopiedLabel?: boolean
}

export function CopyEmbedButton({
  pathname,
  title,
  size = '2',
  variant = 'soft',
  iconOnly = false,
  className,
  tooltip = 'Copy embed code',
  showCopiedLabel = false
}: CopyEmbedButtonProps) {
  const [copyFeedback, setCopyFeedback] = useState<'link' | 'embed' | null>(null)

  const handleCopyLink = useCallback(async () => {
    const url = getEmbedUrl(pathname)
    try {
      await navigator.clipboard.writeText(url)
      setCopyFeedback('link')
      setTimeout(() => setCopyFeedback(null), 2000)
    } catch {
      setCopyFeedback(null)
    }
  }, [pathname])

  const handleCopyEmbed = useCallback(async () => {
    const url = getEmbedUrl(pathname)
    const snippet = getEmbedSnippet(url, title)
    try {
      await navigator.clipboard.writeText(snippet)
      setCopyFeedback('embed')
      setTimeout(() => setCopyFeedback(null), 2000)
    } catch {
      setCopyFeedback(null)
    }
  }, [pathname, title])

  if (iconOnly) {
    const showSuccess = copyFeedback === 'embed'
    return (
      <button
        type="button"
        className={className}
        title={tooltip}
        onClick={handleCopyEmbed}
        aria-label={tooltip}
        aria-live="polite"
      >
        {showSuccess ? (
          <>
            <Check size={18} weight="bold" aria-hidden="true" />
            {showCopiedLabel && <span style={{ marginLeft: '6px', whiteSpace: 'nowrap' }}>Copied!</span>}
          </>
        ) : (
          <Code size={18} weight="regular" />
        )}
      </button>
    )
  }

  return (
    <Flex gap="2" align="center" wrap="wrap">
      <Button
        size={size}
        variant={variant}
        onClick={handleCopyLink}
        style={{ gap: 'var(--space-2)' }}
      >
        <Link size={16} weight="regular" />
        {copyFeedback === 'link' ? 'Copied!' : 'Copy link'}
      </Button>
      <Button
        size={size}
        variant={variant}
        onClick={handleCopyEmbed}
        style={{ gap: 'var(--space-2)' }}
      >
        <Copy size={16} weight="regular" />
        {copyFeedback === 'embed' ? 'Copied!' : 'Copy embed code'}
      </Button>
      {copyFeedback && (
        <Text size="2" style={{ color: 'var(--gray-10)' }}>
          {copyFeedback === 'link' ? 'Link copied to clipboard' : 'Embed code copied to clipboard'}
        </Text>
      )}
    </Flex>
  )
}
