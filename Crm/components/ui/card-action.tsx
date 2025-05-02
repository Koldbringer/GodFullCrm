"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * CardAction component to prevent event propagation for interactive elements inside cards
 * 
 * @example
 * ```tsx
 * <Card onClick={() => console.log("Card clicked")}>
 *   <CardContent>
 *     <CardAction>
 *       <Button onClick={() => console.log("Button clicked")}>Click me</Button>
 *     </CardAction>
 *   </CardContent>
 * </Card>
 * ```
 */
export interface CardActionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardAction({ 
  children, 
  className,
  onClick,
  ...props 
}: CardActionProps) {
  return (
    <div
      className={cn("", className)}
      onClick={(e) => {
        // Prevent event propagation to parent elements (like interactive cards)
        e.stopPropagation()
        // Call the original onClick handler if provided
        onClick?.(e)
      }}
      {...props}
    >
      {children}
    </div>
  )
}