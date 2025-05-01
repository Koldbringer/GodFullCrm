"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type BreakpointVariant = "sm" | "md" | "lg" | "xl" | "2xl"
export type PaddingVariant = "none" | "sm" | "md" | "lg" | "xl"
export type SpacingVariant = "none" | "xs" | "sm" | "md" | "lg" | "xl"

export interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  /**
   * Maximum width of the container
   * @default "xl"
   */
  maxWidth?: BreakpointVariant | "full" | "none"
  /**
   * Horizontal padding size
   * @default "md"
   */
  padding?: PaddingVariant
  /**
   * Vertical padding (top and bottom)
   * @default "none"
   */
  paddingY?: PaddingVariant
  /**
   * Whether to center the container horizontally
   * @default true
   */
  centered?: boolean
  /**
   * Whether to add a border to the container
   * @default false
   */
  bordered?: boolean
  /**
   * Whether to add a shadow to the container
   * @default false
   */
  shadowed?: boolean
  /**
   * Whether to add rounded corners to the container
   * @default false
   */
  rounded?: boolean
}

/**
 * A responsive container component that adapts to different screen sizes.
 * Use this component to create consistent layouts across the application.
 */
export const ResponsiveContainer = React.forwardRef<HTMLDivElement, ResponsiveContainerProps>(
  ({
    children,
    className,
    maxWidth = "xl",
    padding = "md",
    paddingY = "none",
    centered = true,
    bordered = false,
    shadowed = false,
    rounded = false,
    ...props
  }, ref) => {
    const maxWidthClasses = {
      sm: "max-w-screen-sm",
      md: "max-w-screen-md",
      lg: "max-w-screen-lg",
      xl: "max-w-screen-xl",
      "2xl": "max-w-screen-2xl",
      full: "max-w-full",
      none: "",
    }

    const paddingXClasses = {
      none: "px-0",
      xs: "px-1 sm:px-2",
      sm: "px-2 sm:px-4",
      md: "px-4 sm:px-6",
      lg: "px-6 sm:px-8",
      xl: "px-8 sm:px-10",
    }

    const paddingYClasses = {
      none: "py-0",
      xs: "py-1 sm:py-2",
      sm: "py-2 sm:py-4",
      md: "py-4 sm:py-6",
      lg: "py-6 sm:py-8",
      xl: "py-8 sm:py-10",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          maxWidthClasses[maxWidth],
          paddingXClasses[padding as SpacingVariant],
          paddingYClasses[paddingY as SpacingVariant],
          centered && "mx-auto",
          bordered && "border border-border",
          shadowed && "shadow-sm",
          rounded && "rounded-md",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ResponsiveContainer.displayName = "ResponsiveContainer"
