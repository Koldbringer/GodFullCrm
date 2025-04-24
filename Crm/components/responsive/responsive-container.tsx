"use client"

import React, { ReactNode } from "react"
import { cn } from "@/lib/utils"

type BreakpointVariant = "sm" | "md" | "lg" | "xl" | "2xl"

interface ResponsiveContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: BreakpointVariant | "full" | "none"
  padding?: "none" | "sm" | "md" | "lg"
  centered?: boolean
}

/**
 * A responsive container component that adapts to different screen sizes.
 * 
 * @param children - The content to render inside the container
 * @param className - Additional CSS classes to apply
 * @param maxWidth - Maximum width of the container (sm, md, lg, xl, 2xl, full, none)
 * @param padding - Padding size (none, sm, md, lg)
 * @param centered - Whether to center the container horizontally
 */
export function ResponsiveContainer({
  children,
  className,
  maxWidth = "xl",
  padding = "md",
  centered = true,
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full",
    none: "",
  }

  const paddingClasses = {
    none: "px-0",
    sm: "px-2 sm:px-4",
    md: "px-4 sm:px-6",
    lg: "px-6 sm:px-8",
  }

  return (
    <div
      className={cn(
        "w-full",
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        centered && "mx-auto",
        className
      )}
    >
      {children}
    </div>
  )
}
