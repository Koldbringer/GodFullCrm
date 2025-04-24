"use client"

import React, { ReactNode } from "react"
import { cn } from "@/lib/utils"

type ColumnCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

interface ResponsiveGridProps {
  children: ReactNode
  className?: string
  cols?: {
    xs?: ColumnCount
    sm?: ColumnCount
    md?: ColumnCount
    lg?: ColumnCount
    xl?: ColumnCount
    "2xl"?: ColumnCount
  }
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl"
}

/**
 * A responsive grid component that adapts to different screen sizes.
 * 
 * @param children - The content to render inside the grid
 * @param className - Additional CSS classes to apply
 * @param cols - Number of columns at different breakpoints
 * @param gap - Gap size between grid items
 */
export function ResponsiveGrid({
  children,
  className,
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = "md",
}: ResponsiveGridProps) {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
    9: "grid-cols-9",
    10: "grid-cols-10",
    11: "grid-cols-11",
    12: "grid-cols-12",
  }

  const gapClasses = {
    none: "gap-0",
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  }

  const gridClasses = [
    "grid",
    cols.xs && colClasses[cols.xs],
    cols.sm && `sm:${colClasses[cols.sm]}`,
    cols.md && `md:${colClasses[cols.md]}`,
    cols.lg && `lg:${colClasses[cols.lg]}`,
    cols.xl && `xl:${colClasses[cols.xl]}`,
    cols["2xl"] && `2xl:${colClasses[cols["2xl"]]}`,
    gapClasses[gap],
  ]

  return (
    <div className={cn(gridClasses, className)}>
      {children}
    </div>
  )
}
