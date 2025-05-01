"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface ColorSwatchProps {
  name: string
  variable: string
  className?: string
}

export function ColorSwatch({ name, variable, className }: ColorSwatchProps) {
  const { toast } = useToast()
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`hsl(var(--${variable}))`).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `hsl(var(--${variable}))`,
        duration: 2000,
      })
    })
  }
  
  return (
    <div className="flex flex-col space-y-1.5">
      <div 
        className={cn(
          "h-16 w-full rounded-md border flex items-center justify-center relative group",
          className
        )}
        style={{ backgroundColor: `hsl(var(--${variable}))` }}
      >
        <Button 
          variant="secondary" 
          size="icon" 
          className="opacity-0 group-hover:opacity-100 transition-opacity absolute"
          onClick={copyToClipboard}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-xs text-muted-foreground">var(--{variable})</span>
      </div>
    </div>
  )
}

interface ColorGroupProps {
  title: string
  colors: Array<{ name: string; variable: string; className?: string }>
  className?: string
}

export function ColorGroup({ title, colors, className }: ColorGroupProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {colors.map((color) => (
          <ColorSwatch
            key={color.variable}
            name={color.name}
            variable={color.variable}
            className={color.className}
          />
        ))}
      </div>
    </div>
  )
}

export function ColorSystem() {
  const { theme } = useTheme()
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Color System</h2>
        <div className="text-sm text-muted-foreground">
          Current theme: <span className="font-medium">{theme}</span>
        </div>
      </div>
      
      <ColorGroup
        title="Base Colors"
        colors={[
          { name: "Background", variable: "background" },
          { name: "Foreground", variable: "foreground" },
          { name: "Card", variable: "card" },
          { name: "Card Foreground", variable: "card-foreground" },
          { name: "Popover", variable: "popover" },
          { name: "Popover Foreground", variable: "popover-foreground" },
          { name: "Primary", variable: "primary" },
          { name: "Primary Foreground", variable: "primary-foreground" },
          { name: "Secondary", variable: "secondary" },
          { name: "Secondary Foreground", variable: "secondary-foreground" },
        ]}
      />
      
      <ColorGroup
        title="UI Colors"
        colors={[
          { name: "Muted", variable: "muted" },
          { name: "Muted Foreground", variable: "muted-foreground" },
          { name: "Accent", variable: "accent" },
          { name: "Accent Foreground", variable: "accent-foreground" },
          { name: "Destructive", variable: "destructive" },
          { name: "Destructive Foreground", variable: "destructive-foreground" },
          { name: "Border", variable: "border" },
          { name: "Input", variable: "input" },
          { name: "Ring", variable: "ring" },
        ]}
      />
      
      <ColorGroup
        title="Chart Colors"
        colors={[
          { name: "Chart 1", variable: "chart-1" },
          { name: "Chart 2", variable: "chart-2" },
          { name: "Chart 3", variable: "chart-3" },
          { name: "Chart 4", variable: "chart-4" },
          { name: "Chart 5", variable: "chart-5" },
        ]}
      />
      
      <ColorGroup
        title="Sidebar Colors"
        colors={[
          { name: "Sidebar Background", variable: "sidebar-background" },
          { name: "Sidebar Foreground", variable: "sidebar-foreground" },
          { name: "Sidebar Primary", variable: "sidebar-primary" },
          { name: "Sidebar Primary Foreground", variable: "sidebar-primary-foreground" },
          { name: "Sidebar Accent", variable: "sidebar-accent" },
          { name: "Sidebar Accent Foreground", variable: "sidebar-accent-foreground" },
          { name: "Sidebar Border", variable: "sidebar-border" },
          { name: "Sidebar Ring", variable: "sidebar-ring" },
        ]}
      />
    </div>
  )
}
