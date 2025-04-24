"use client"

import { useState, useEffect } from "react"
import { getNotifications, getUnreadNotificationsCount, markNotificationAsRead, markAllNotificationsAsRead, toggleNotificationStar, deleteNotification as apiDeleteNotification } from "@/lib/api"
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  Settings,
  Clock,
  Filter,
  RefreshCw,
  MoreHorizontal,
  ChevronRight
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Interfejs dla powiadomień z API
interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  source: string
  created_at: string
  is_read: boolean
  is_starred: boolean
  link?: string
}

// Interfejs dla powiadomień wyświetlanych w UI
interface UINotification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  source: string
  timestamp: string
  isRead: boolean
  isStarred: boolean
  link?: string
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<UINotification[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)

  // Funkcja formatująca czas
  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Przed chwilą'
    if (diffMins < 60) return `${diffMins} min temu`
    if (diffHours < 24) return `${diffHours} godz. temu`
    if (diffDays < 7) return `${diffDays} dni temu`

    return date.toLocaleDateString('pl-PL')
  }

  // Konwersja powiadomień z API do formatu UI
  const convertToUINotifications = (apiNotifications: any[]): UINotification[] => {
    return apiNotifications.map(notification => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type as "info" | "warning" | "success" | "error",
      source: notification.source,
      timestamp: formatTimestamp(notification.created_at),
      isRead: notification.is_read,
      isStarred: notification.is_starred,
      link: notification.link
    }))
  }

  // Pobieranie powiadomień z API
  const fetchNotifications = async () => {
    try {
      const data = await getNotifications()
      const uiNotifications = convertToUINotifications(data)
      setNotifications(uiNotifications)
      const unreadCount = await getUnreadNotificationsCount()
      setNotificationCount(unreadCount)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  // Inicjalizacja powiadomień
  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchNotifications()
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id)
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      )
      setNotificationCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      )
      setNotificationCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const toggleStar = async (id: string) => {
    try {
      const notification = notifications.find(n => n.id === id)
      if (notification) {
        const newStarredState = !notification.isStarred
        await toggleNotificationStar(id, newStarredState)
        setNotifications(prev =>
          prev.map(n =>
            n.id === id
              ? { ...n, isStarred: newStarredState }
              : n
          )
        )
      }
    } catch (error) {
      console.error(`Error toggling star for notification ${id}:`, error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const notification = notifications.find(n => n.id === id)
      if (notification && !notification.isRead) {
        setNotificationCount(prev => prev - 1)
      }
      await apiDeleteNotification(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (error) {
      console.error(`Error deleting notification ${id}:`, error)
    }
  }

  // Funkcja zwracająca ikonę dla typu powiadomienia
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {notificationCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[380px] p-0" align="end">
          <div className="flex items-center justify-between p-4 pb-2">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <h3 className="font-medium">Powiadomienia</h3>
              {notificationCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {notificationCount} nowe
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filtruj powiadomienia</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>Informacje</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked>Ostrzeżenia</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked>Błędy</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked>Sukcesy</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ustawienia powiadomień</DialogTitle>
                    <DialogDescription>
                      Dostosuj preferencje powiadomień
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Powiadomienia systemowe</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify-orders">Zlecenia</Label>
                          <Switch id="notify-orders" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify-devices">Urządzenia</Label>
                          <Switch id="notify-devices" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify-customers">Klienci</Label>
                          <Switch id="notify-customers" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify-inventory">Magazyn</Label>
                          <Switch id="notify-inventory" defaultChecked />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Preferencje</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="desktop-notifications">Powiadomienia na pulpicie</Label>
                          <Switch id="desktop-notifications" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-notifications">Powiadomienia email</Label>
                          <Switch id="email-notifications" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sound-notifications">Dźwięk powiadomień</Label>
                          <Switch id="sound-notifications" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button>Zapisz ustawienia</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <div className="px-4">
              <TabsList className="grid w-full grid-cols-3 h-9">
                <TabsTrigger value="all">Wszystkie</TabsTrigger>
                <TabsTrigger value="unread">Nieprzeczytane</TabsTrigger>
                <TabsTrigger value="starred">Oznaczone</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <Bell className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
                  <h3 className="font-medium">Brak powiadomień</h3>
                  <p className="text-sm text-muted-foreground">
                    Nie masz żadnych powiadomień w tym momencie.
                  </p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`relative p-4 border-b last:border-0 ${!notification.isRead ? 'bg-muted/50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => toggleStar(notification.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill={notification.isStarred ? "currentColor" : "none"}
                                  stroke="currentColor"
                                  className={`h-4 w-4 ${notification.isStarred ? 'text-amber-500' : 'text-muted-foreground'}`}
                                  strokeWidth="2"
                                >
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                    Oznacz jako przeczytane
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toggleStar(notification.id)}>
                                    {notification.isStarred ? 'Usuń oznaczenie' : 'Oznacz gwiazdką'}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => deleteNotification(notification.id)}>
                                    Usuń powiadomienie
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <p className="text-sm">{notification.message}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{notification.source}</span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {notification.timestamp}
                            </span>
                          </div>
                          {notification.link && (
                            <Button variant="link" className="h-auto p-0 text-xs" onClick={() => setIsOpen(false)}>
                              <span>Szczegóły</span>
                              <ChevronRight className="ml-1 h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="unread" className="max-h-[400px] overflow-y-auto">
              {notifications.filter(n => !n.isRead).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <CheckCircle2 className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
                  <h3 className="font-medium">Brak nieprzeczytanych powiadomień</h3>
                  <p className="text-sm text-muted-foreground">
                    Wszystkie powiadomienia zostały przeczytane.
                  </p>
                </div>
              ) : (
                <div>
                  {notifications.filter(n => !n.isRead).map((notification) => (
                    <div
                      key={notification.id}
                      className="relative p-4 border-b last:border-0 bg-muted/50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => toggleStar(notification.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill={notification.isStarred ? "currentColor" : "none"}
                                  stroke="currentColor"
                                  className={`h-4 w-4 ${notification.isStarred ? 'text-amber-500' : 'text-muted-foreground'}`}
                                  strokeWidth="2"
                                >
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => markAsRead(notification.id)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm">{notification.message}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{notification.source}</span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {notification.timestamp}
                            </span>
                          </div>
                          {notification.link && (
                            <Button variant="link" className="h-auto p-0 text-xs" onClick={() => setIsOpen(false)}>
                              <span>Szczegóły</span>
                              <ChevronRight className="ml-1 h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="starred" className="max-h-[400px] overflow-y-auto">
              {notifications.filter(n => n.isStarred).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-10 w-10 text-muted-foreground mb-2 opacity-20"
                    strokeWidth="2"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <h3 className="font-medium">Brak oznaczonych powiadomień</h3>
                  <p className="text-sm text-muted-foreground">
                    Nie masz żadnych powiadomień oznaczonych gwiazdką.
                  </p>
                </div>
              ) : (
                <div>
                  {notifications.filter(n => n.isStarred).map((notification) => (
                    <div
                      key={notification.id}
                      className={`relative p-4 border-b last:border-0 ${!notification.isRead ? 'bg-muted/50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => toggleStar(notification.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  stroke="currentColor"
                                  className="h-4 w-4 text-amber-500"
                                  strokeWidth="2"
                                >
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {!notification.isRead && (
                                    <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                      Oznacz jako przeczytane
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => toggleStar(notification.id)}>
                                    Usuń oznaczenie
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => deleteNotification(notification.id)}>
                                    Usuń powiadomienie
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <p className="text-sm">{notification.message}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{notification.source}</span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {notification.timestamp}
                            </span>
                          </div>
                          {notification.link && (
                            <Button variant="link" className="h-auto p-0 text-xs" onClick={() => setIsOpen(false)}>
                              <span>Szczegóły</span>
                              <ChevronRight className="ml-1 h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="p-2 border-t">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={notificationCount === 0}>
                Oznacz wszystkie jako przeczytane
              </Button>
              <Button variant="link" size="sm" onClick={() => setIsOpen(false)}>
                Zobacz wszystkie
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
