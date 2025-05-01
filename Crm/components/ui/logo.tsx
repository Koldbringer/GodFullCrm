"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/components/i18n/i18n-provider"

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to show the logo text
   * @default true
   */
  showText?: boolean
  /**
   * Whether to link to the home page
   * @default true
   */
  linkToHome?: boolean
  /**
   * Logo size
   * @default "md"
   */
  size?: "sm" | "md" | "lg"
  /**
   * Logo variant
   * @default "default"
   */
  variant?: "default" | "sidebar" | "footer"
}

/**
 * Logo component that displays the application logo with optional text
 */
export function Logo({
  className,
  showText = true,
  linkToHome = true,
  size = "md",
  variant = "default",
  ...props
}: LogoProps) {
  const { t } = useTranslation()
  const appName = t('app_name', 'GodLike HVAC CRM')
  
  // Size mappings
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  }
  
  // Text size mappings
  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }
  
  // Variant mappings
  const variantClasses = {
    default: "text-foreground",
    sidebar: "text-sidebar-foreground",
    footer: "text-muted-foreground",
  }
  
  const logoContent = (
    <div 
      className={cn(
        "flex items-center gap-2",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <div className="relative overflow-hidden rounded-md">
        <Image
          src="/hvac-logo.png"
          alt={appName}
          width={size === "sm" ? 24 : size === "md" ? 32 : 40}
          height={size === "sm" ? 24 : size === "md" ? 32 : 40}
          className={cn(sizeClasses[size])}
          priority
          // Add fallback for missing image
          onError={(e) => {
            // If image fails to load, replace with a fallback
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-logo.png";
          }}
        />
      </div>
      {showText && (
        <span className={cn(
          "font-semibold tracking-tight whitespace-nowrap",
          textSizeClasses[size]
        )}>
          {appName}
        </span>
      )}
    </div>
  )
  
  if (linkToHome) {
    return (
      <Link href="/" className="hover:opacity-90 transition-opacity">
        {logoContent}
      </Link>
    )
  }
  
  return logoContent
}
