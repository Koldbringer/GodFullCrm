"use client"

import * as React from "react"
import { useTranslation } from "@/components/i18n/i18n-provider"
import { useA11y } from "@/components/a11y/a11y-context"
import { cn } from "@/lib/utils"

export interface SkipLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  /**
   * Custom label for the skip link
   */
  label?: string
  /**
   * ID of the target element to skip to
   */
  targetId: string
  /**
   * Whether to announce when the link is used
   * @default true
   */
  announce?: boolean
}

/**
 * A skip link component that allows keyboard users to bypass navigation and jump directly to main content.
 * The link is visually hidden until it receives focus, making it accessible only to keyboard users.
 */
export function SkipLink({
  className,
  label,
  targetId,
  announce = true,
  ...props
}: SkipLinkProps) {
  const { t } = useTranslation()
  const { announce: announceToScreenReader } = useA11y()

  // Default label is "Skip to content"
  const skipLabel = label || t('accessibility.skip_to_content', 'Przejdź do treści')

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      // Set focus to the target element
      targetElement.setAttribute('tabindex', '-1')
      targetElement.focus()

      // Scroll to the target element
      targetElement.scrollIntoView({ behavior: 'smooth' })

      // Announce to screen readers
      if (announce) {
        announceToScreenReader(
          t('accessibility.skipped_to_content', 'Przejdź do treści głównej'),
          false
        )
      }

      // Update URL hash
      window.history.pushState(null, '', `#${targetId}`)
    }
  }

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={cn(
        "fixed top-4 left-4 z-[100] p-3 bg-primary text-primary-foreground rounded-md",
        "transform -translate-y-full focus:translate-y-0 transition-transform duration-200",
        "outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "sr-only focus:not-sr-only focus:outline-offset-4",
        className
      )}
      {...props}
    >
      {skipLabel}
    </a>
  )
}
