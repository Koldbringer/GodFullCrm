"use client"

import React, { ReactNode, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslation } from "@/components/i18n/i18n-provider"
import { useA11y } from "@/components/a11y/a11y-context"

interface ResponsiveLayoutProps {
  children: ReactNode
  sidebar?: ReactNode
  sidebarWidth?: string
  sidebarPosition?: "left" | "right"
  collapsible?: boolean
  defaultCollapsed?: boolean
  className?: string
  sidebarClassName?: string
  contentClassName?: string
}

/**
 * A responsive layout component with optional sidebar.
 * 
 * @param children - The main content
 * @param sidebar - The sidebar content
 * @param sidebarWidth - Width of the sidebar (CSS value)
 * @param sidebarPosition - Position of the sidebar (left or right)
 * @param collapsible - Whether the sidebar can be collapsed
 * @param defaultCollapsed - Whether the sidebar is collapsed by default
 * @param className - Additional CSS classes for the container
 * @param sidebarClassName - Additional CSS classes for the sidebar
 * @param contentClassName - Additional CSS classes for the content
 */
export function ResponsiveLayout({
  children,
  sidebar,
  sidebarWidth = "16rem",
  sidebarPosition = "left",
  collapsible = true,
  defaultCollapsed = false,
  className,
  sidebarClassName,
  contentClassName,
}: ResponsiveLayoutProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const { t } = useTranslation()
  const { announce } = useA11y()
  
  const toggleSidebar = () => {
    const newState = !collapsed
    setCollapsed(newState)
    
    // Announce to screen readers
    announce(
      newState 
        ? t('accessibility.sidebar_collapsed', 'Sidebar collapsed') 
        : t('accessibility.sidebar_expanded', 'Sidebar expanded'),
      false
    )
  }
  
  return (
    <div 
      className={cn(
        "flex w-full h-full relative",
        sidebarPosition === "right" && "flex-row-reverse",
        className
      )}
    >
      {sidebar && (
        <div
          className={cn(
            "transition-all duration-300 ease-in-out",
            "border-r bg-card",
            collapsed ? "w-0 overflow-hidden" : `w-full md:w-[${sidebarWidth}]`,
            "md:relative absolute z-10 h-full",
            sidebarClassName
          )}
          aria-hidden={collapsed}
          id="sidebar-panel"
        >
          {sidebar}
          
          {collapsible && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute top-4 rounded-full p-1.5 h-8 w-8",
                sidebarPosition === "left" ? "-right-4" : "-left-4",
                "bg-background border shadow-sm",
                "hidden md:flex"
              )}
              onClick={toggleSidebar}
              aria-label={collapsed ? t('accessibility.expand_sidebar') : t('accessibility.collapse_sidebar')}
              aria-expanded={!collapsed}
              aria-controls="sidebar-panel"
            >
              {sidebarPosition === "left" ? (
                collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
              ) : (
                collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      )}
      
      <div className={cn("flex-1 overflow-auto", contentClassName)}>
        {children}
      </div>
    </div>
  )
}
