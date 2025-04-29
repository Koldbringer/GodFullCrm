"use client"

import { useTranslation } from "@/components/i18n/i18n-provider"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface SkipLinkProps {
  className?: string
  label?: string
  targetId: string
}

export function SkipLink({ className, label, targetId }: SkipLinkProps) {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  
  // Default label is "Skip to content"
  const skipLabel = label || t('accessibility.skip_to_content', 'Przejdź do treści')
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !e.shiftKey && !isVisible) {
        setIsVisible(true)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isVisible])
  
  const handleClick = () => {
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.focus()
      targetElement.scrollIntoView({ behavior: 'smooth' })
    }
    setIsVisible(false)
  }
  
  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      onBlur={() => setIsVisible(false)}
      className={cn(
        "fixed top-0 left-0 z-50 p-2 bg-primary text-primary-foreground",
        "transform -translate-y-full focus:translate-y-0 transition-transform",
        "outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        isVisible ? "translate-y-0" : "-translate-y-full",
        className
      )}
    >
      {skipLabel}
    </a>
  )
}
