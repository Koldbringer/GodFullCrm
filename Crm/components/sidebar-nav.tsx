"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Package,
  Calendar,
  MapPin,
  Boxes,
  UserCog,
  TicketCheck,
  FileText,
  Car,
  Activity,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Settings,
  HelpCircle,
  ScrollText,
  Map,
  Bot
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface SidebarNavProps {
  className?: string
  collapsed?: boolean
}

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  badge?: string | number
  submenu?: NavItem[]
}

export function SidebarNav({ className, collapsed = false }: SidebarNavProps) {
  const pathname = usePathname()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      title: "Klienci",
      href: "/customers",
      icon: <Users className="h-5 w-5" />,
      badge: 12
    },
    {
      title: "Zlecenia",
      href: "/service-orders",
      icon: <ClipboardList className="h-5 w-5" />,
      badge: 5
    },
    {
      title: "Urządzenia",
      href: "/devices",
      icon: <Package className="h-5 w-5" />
    },
    {
      title: "Kalendarz",
      href: "/calendar",
      icon: <Calendar className="h-5 w-5" />
    },
    {
      title: "Lokalizacje",
      href: "/sites",
      icon: <MapPin className="h-5 w-5" />
    },
    {
      title: "Mapa",
      href: "/map",
      icon: <Map className="h-5 w-5" />
    },
    {
      title: "Magazyn",
      href: "/inventory",
      icon: <Boxes className="h-5 w-5" />
    },
    {
      title: "Pracownicy",
      href: "/employees",
      icon: <UserCog className="h-5 w-5" />
    },
    {
      title: "Zgłoszenia",
      href: "/tickets",
      icon: <TicketCheck className="h-5 w-5" />,
      badge: 3
    },
    {
      title: "Automatyzacja",
      href: "/automation",
      icon: <Bot className="h-5 w-5" />
    },
    {
      title: "Dokumenty",
      icon: <FileText className="h-5 w-5" />,
      href: "#",
      submenu: [
        {
          title: "Oferty",
          href: "/quotes",
          icon: <FileText className="h-4 w-4" />
        },
        {
          title: "Umowy",
          href: "/contracts",
          icon: <ScrollText className="h-4 w-4" />
        },
        {
          title: "Faktury",
          href: "/invoices",
          icon: <FileText className="h-4 w-4" />
        }
      ]
    },
    {
      title: "Flota",
      href: "/fleet",
      icon: <Car className="h-5 w-5" />
    },
    {
      title: "Monitoring",
      href: "/monitoring",
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: "Raporty",
      href: "/reports",
      icon: <BarChart3 className="h-5 w-5" />
    }
  ]

  const renderNavItem = (item: NavItem) => {
    const isActive = item.submenu
      ? item.submenu.some(subItem => pathname === subItem.href || pathname?.startsWith(subItem.href + '/'))
      : pathname === item.href || pathname?.startsWith(item.href + '/')

    const navItemContent = (
      <>
        <span className="flex items-center">
          <span className={cn(
            "mr-2 flex items-center justify-center",
            isActive ? "text-primary" : "text-muted-foreground"
          )}>
            {item.icon}
          </span>
          {!collapsed && (
            <span className={cn(
              "text-sm font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}>
              {item.title}
            </span>
          )}
        </span>
        {!collapsed && item.badge && (
          <Badge variant="secondary" className="ml-auto">
            {item.badge}
          </Badge>
        )}
        {collapsed && item.badge && (
          <Badge variant="secondary" className="absolute -right-2 -top-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
            {item.badge}
          </Badge>
        )}
        {!collapsed && item.submenu && (
          <span className="ml-auto">
            {openGroups[item.title] ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        )}
      </>
    )

    if (item.submenu) {
      return (
        <Collapsible
          key={item.title}
          open={openGroups[item.title]}
          onOpenChange={() => !collapsed && toggleGroup(item.title)}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            {collapsed ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "relative w-full justify-center py-6",
                        isActive && "bg-accent text-accent-foreground"
                      )}
                    >
                      {item.icon}
                      {item.badge && (
                        <Badge variant="secondary" className="absolute -right-2 -top-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start py-2",
                  isActive && "bg-accent text-accent-foreground"
                )}
              >
                {navItemContent}
              </Button>
            )}
          </CollapsibleTrigger>
          {!collapsed && (
            <CollapsibleContent className="pl-6 pt-1">
              <div className="flex flex-col space-y-1">
                {item.submenu.map((subItem) => {
                  const isSubActive = pathname === subItem.href || pathname?.startsWith(subItem.href + '/')
                  return (
                    <Link key={subItem.href} href={subItem.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start py-1.5",
                          isSubActive && "bg-accent text-accent-foreground"
                        )}
                      >
                        <span className={cn(
                          "mr-2 flex items-center justify-center",
                          isSubActive ? "text-primary" : "text-muted-foreground"
                        )}>
                          {subItem.icon}
                        </span>
                        <span className={cn(
                          "text-sm font-medium transition-colors",
                          isSubActive ? "text-primary" : "text-muted-foreground"
                        )}>
                          {subItem.title}
                        </span>
                      </Button>
                    </Link>
                  )
                })}
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      )
    }

    return (
      <Link key={item.href} href={item.href}>
        {collapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "relative w-full justify-center py-6",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  {item.icon}
                  {item.badge && (
                    <Badge variant="secondary" className="absolute -right-2 -top-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start py-2",
              isActive && "bg-accent text-accent-foreground"
            )}
          >
            {navItemContent}
          </Button>
        )}
      </Link>
    )
  }

  return (
    <div className={cn("flex flex-col space-y-1 py-2", className)}>
      {navItems.map(renderNavItem)}
      <div className="mt-auto pt-4">
        <Link href="/settings">
          {collapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-center py-6"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Ustawienia</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start py-2"
            >
              <Settings className="mr-2 h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Ustawienia
              </span>
            </Button>
          )}
        </Link>
        <Link href="/help">
          {collapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-center py-6"
                  >
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Pomoc</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start py-2"
            >
              <HelpCircle className="mr-2 h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Pomoc
              </span>
            </Button>
          )}
        </Link>
      </div>
    </div>
  )
}
