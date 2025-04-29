"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight, Menu } from "lucide-react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/use-media-query"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  // Close mobile sidebar when route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Reset collapsed state when screen size changes
  useEffect(() => {
    if (!isDesktop) {
      setCollapsed(false)
    }
  }, [isDesktop])

  // Save collapsed state to localStorage
  useEffect(() => {
    if (isDesktop) {
      localStorage.setItem("sidebar-collapsed", String(collapsed))
    }
  }, [collapsed, isDesktop])

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed")
    if (savedState !== null && isDesktop) {
      setCollapsed(savedState === "true")
    }
  }, [isDesktop])

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  // Mobile sidebar
  if (!isDesktop) {
    return (
      <>
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden fixed left-4 top-4 z-40"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="p-0 w-[240px]">
            <div className="h-16 flex items-center px-4 border-b">
              <h2 className="text-lg font-semibold">GodLike HVAC CRM</h2>
            </div>
            <SidebarNav className="px-2" />
          </SheetContent>
        </Sheet>
      </>
    )
  }

  // Desktop sidebar
  return (
    <div
      className={cn(
        "relative h-screen border-r bg-background transition-all duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[240px]",
        className
      )}
    >
      <div className="h-16 flex items-center px-4 border-b">
        {!collapsed && <h2 className="text-lg font-semibold">GodLike HVAC CRM</h2>}
      </div>
      <SidebarNav collapsed={collapsed} className="px-2" />
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-sm"
        onClick={toggleCollapsed}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
        <span className="sr-only">
          {collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        </span>
      </Button>
    </div>
  )
}
