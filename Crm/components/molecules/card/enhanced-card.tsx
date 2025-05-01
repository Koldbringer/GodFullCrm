"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

// Card variants
const cardVariants = cva(
  "transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-card",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "bg-transparent border-2",
        ghost: "bg-transparent border-0 shadow-none",
        destructive: "bg-destructive text-destructive-foreground",
      },
      size: {
        sm: "p-2",
        md: "",
        lg: "p-6",
      },
      hover: {
        none: "",
        lift: "hover:-translate-y-1 hover:shadow-md",
        glow: "hover:shadow-[0_0_15px_rgba(0,0,0,0.1)]",
        border: "hover:border-primary",
      },
      interactive: {
        true: "cursor-pointer",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      hover: "none",
      interactive: false,
    },
  }
)

// Header variants
const headerVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "",
        primary: "border-b border-primary/10",
        secondary: "border-b border-secondary/10",
        outline: "border-b",
        ghost: "",
        destructive: "border-b border-destructive/10",
      },
      size: {
        sm: "p-3",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

// Content variants
const contentVariants = cva(
  "",
  {
    variants: {
      size: {
        sm: "p-3 pt-0",
        md: "p-6 pt-0",
        lg: "p-8 pt-0",
      },
      spacing: {
        none: "",
        sm: "space-y-2",
        md: "space-y-4",
        lg: "space-y-6",
      }
    },
    defaultVariants: {
      size: "md",
      spacing: "none",
    },
  }
)

// Footer variants
const footerVariants = cva(
  "flex items-center",
  {
    variants: {
      variant: {
        default: "",
        primary: "border-t border-primary/10",
        secondary: "border-t border-secondary/10",
        outline: "border-t",
        ghost: "",
        destructive: "border-t border-destructive/10",
      },
      size: {
        sm: "p-3 pt-0",
        md: "p-6 pt-0",
        lg: "p-8 pt-0",
      },
      align: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      align: "between",
    },
  }
)

export interface EnhancedCardProps extends 
  React.ComponentPropsWithoutRef<typeof Card>,
  VariantProps<typeof cardVariants> {
  /**
   * Card title
   */
  title?: React.ReactNode
  /**
   * Card description
   */
  description?: React.ReactNode
  /**
   * Card icon
   */
  icon?: LucideIcon
  /**
   * Whether to show a loading state
   */
  isLoading?: boolean
  /**
   * Whether to show the header
   */
  showHeader?: boolean
  /**
   * Whether to show the footer
   */
  showFooter?: boolean
  /**
   * Footer content
   */
  footer?: React.ReactNode
  /**
   * Header className
   */
  headerClassName?: string
  /**
   * Content className
   */
  contentClassName?: string
  /**
   * Footer className
   */
  footerClassName?: string
  /**
   * Content spacing
   */
  contentSpacing?: "none" | "sm" | "md" | "lg"
  /**
   * Footer alignment
   */
  footerAlign?: "start" | "center" | "end" | "between" | "around" | "evenly"
  /**
   * On click handler
   */
  onClick?: () => void
}

/**
 * Enhanced card component with variants, loading state, and more.
 */
export const EnhancedCard = React.forwardRef<
  HTMLDivElement,
  EnhancedCardProps
>(({
  className,
  variant,
  size,
  hover,
  interactive,
  title,
  description,
  icon: Icon,
  isLoading,
  showHeader = true,
  showFooter = false,
  footer,
  headerClassName,
  contentClassName,
  footerClassName,
  contentSpacing,
  footerAlign,
  onClick,
  children,
  ...props
}, ref) => {
  // Determine if the card is interactive
  const isInteractive = interactive || !!onClick

  return (
    <Card
      ref={ref}
      className={cn(
        cardVariants({ variant, size, hover, interactive: isInteractive }),
        className
      )}
      onClick={onClick}
      {...props}
    >
      {showHeader && (title || description || Icon) && (
        <CardHeader className={cn(
          headerVariants({ variant, size }),
          headerClassName
        )}>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
          </div>
        </CardHeader>
      )}
      
      <CardContent className={cn(
        contentVariants({ size, spacing: contentSpacing }),
        contentClassName
      )}>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          children
        )}
      </CardContent>
      
      {showFooter && (
        <CardFooter className={cn(
          footerVariants({ variant, size, align: footerAlign }),
          footerClassName
        )}>
          {footer}
        </CardFooter>
      )}
    </Card>
  )
})

EnhancedCard.displayName = "EnhancedCard"
