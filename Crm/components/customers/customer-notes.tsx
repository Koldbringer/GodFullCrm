"use client"

import { useState } from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { FileText, MoreHorizontal, Plus, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Przykładowe dane notatek
const notesData = [
  {
    id: "NOTE001",
    customer_id: "c1",
    title: "Notatka z rozmowy telefonicznej",
    content:
      "Klient zadzwonił z informacją, że jest zainteresowany wymianą klimatyzatora w sali konferencyjnej. Prosi o przygotowanie oferty na urządzenie o wyższej mocy chłodniczej.",
    created_at: "2023-10-20T11:30:00Z",
    updated_at: "2023-10-20T11:30:00Z",
    author: "Jan Kowalski",
    category: "Sprzedaż",
    tags: ["oferta", "wymiana"],
    priority: "medium",
  },
  {
    id: "NOTE002",
    customer_id: "c1",
    title: "Preferencje klienta",
    content:
      "Klient preferuje kontakt mailowy. Najlepiej kontaktować się w godzinach 9-12. Zainteresowany rozbudową systemu klimatyzacji w biurze.",
    created_at: "2023-01-15T10:15:00Z",
    updated_at: "2023-01-15T10:15:00Z",
    author: "Anna Wiśniewska",
    category: "Obsługa klienta",
    tags: ["preferencje", "kontakt"],
    priority: "low",
  },
  {
    id: "NOTE003",
    customer_id: "c1",
    title: "Uwagi po przeglądzie",
    content:
      "Podczas przeglądu zauważono, że filtry w klimatyzatorze w biurze głównym wymagają częstszej wymiany ze względu na specyfikę pomieszczenia. Zalecono wymianę co 3 miesiące zamiast standardowych 6 miesięcy.",
    created_at: "2023-09-15T15:30:00Z",
    updated_at: "2023-09-15T15:30:00Z",
    author: "Piotr Nowak",
    category: "Serwis",
    tags: ["przegląd", "filtry", "zalecenia"],
    priority: "high",
  },
]

// Przykładowe dane dokumentów
const documentsData = [
  {
    id: "DOC001",
    customer_id: "c1",
    name: "Umowa serwisowa.pdf",
    type: "application/pdf",
    size: "1.2 MB",
    created_at: "2023-01-15T11:00:00Z",
    author: "Jan Kowalski",
    category: "Umowy",
    tags: ["umowa", "serwis"],
  },
  {
    id: "DOC002",
    customer_id: "c1",
    name: "Specyfikacja_klimatyzator_Mitsubishi.pdf",
    type: "application/pdf",
    size: "3.5 MB",
    created_at: "2023-05-10T10:00:00Z",
    author: "System",
    category: "Dokumentacja techniczna",
    tags: ["specyfikacja", "klimatyzator"],
  },
  {
    id: "DOC003",
    customer_id: "c1",
    name: "Protokół_instalacji.pdf",
    type: "application/pdf",
    size: "0.8 MB",
    created_at: "2023-06-05T16:30:00Z",
    author: "Anna Wiśniewska",
    category: "Protokoły",
    tags: ["protokół", "instalacja"],
  },
]

interface CustomerNotesProps {
  customerId: string
}

export function CustomerNotes({ customerId }: CustomerNotesProps) {
  // Filtrowanie notatek i dokumentów dla danego klienta
  const customerNotes = notesData.filter((note) => note.customer_id === customerId)
  const customerDocuments = documentsData.filter((doc) => doc.customer_id === customerId)

  const [newNote, setNewNote] = useState("")

  // Funkcja do określania koloru priorytetu
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <Tabs defaultValue="notes" className="space-y-4">
      <TabsList>
        <TabsTrigger value="notes">Notatki</TabsTrigger>
        <TabsTrigger value="documents">Dokumenty</TabsTrigger>
        <TabsTrigger value="add">Dodaj notatkę</TabsTrigger>
      </TabsList>

      <TabsContent value="notes" className="space-y-4">
        {customerNotes.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="mb-4 text-muted-foreground">Brak notatek dla tego klienta.</p>
              <Button>Dodaj pierwszą notatkę</Button>
            </CardContent>
          </Card>
        ) : (
          customerNotes
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((note) => (
              <Card key={note.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Otwórz menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                        <DropdownMenuItem>Edytuj notatkę</DropdownMenuItem>
                        <DropdownMenuItem>Udostępnij</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Usuń notatkę</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                      <AvatarFallback>
                        {note.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{note.author}</span>
                    <span>•</span>
                    <span>{format(new Date(note.created_at), "d MMMM yyyy, HH:mm", { locale: pl })}</span>
                    <span>•</span>
                    <Badge variant="outline" className={getPriorityColor(note.priority)}>
                      {note.priority === "high" ? "Wysoki" : note.priority === "medium" ? "Średni" : "Niski"} priorytet
                    </Badge>
                  </div>

                  <p className="whitespace-pre-line">{note.content}</p>

                  {note.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {note.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
        )}
      </TabsContent>

      <TabsContent value="documents" className="space-y-4">
        {customerDocuments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="mb-4 text-muted-foreground">Brak dokumentów dla tego klienta.</p>
              <Button>Dodaj pierwszy dokument</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customerDocuments
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((doc) => (
                <Card key={doc.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-muted rounded-md p-2">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium truncate">{doc.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{format(new Date(doc.created_at), "d MMM yyyy", { locale: pl })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <User className="h-3 w-3" />
                          <span>{doc.author}</span>
                          <span>•</span>
                          <span>{doc.category}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {doc.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button size="sm" variant="outline">
                        Pobierz
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="add">
        <Card>
          <CardHeader>
            <CardTitle>Dodaj nową notatkę</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="note-title" className="text-sm font-medium">
                  Tytuł
                </label>
                <input
                  id="note-title"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  placeholder="Wprowadź tytuł notatki"
                />
              </div>
              <div>
                <label htmlFor="note-content" className="text-sm font-medium">
                  Treść
                </label>
                <Textarea
                  id="note-content"
                  className="min-h-[150px] mt-1"
                  placeholder="Wprowadź treść notatki"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="note-category" className="text-sm font-medium">
                    Kategoria
                  </label>
                  <select
                    id="note-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  >
                    <option value="Obsługa klienta">Obsługa klienta</option>
                    <option value="Sprzedaż">Sprzedaż</option>
                    <option value="Serwis">Serwis</option>
                    <option value="Inne">Inne</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="note-priority" className="text-sm font-medium">
                    Priorytet
                  </label>
                  <select
                    id="note-priority"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  >
                    <option value="low">Niski</option>
                    <option value="medium">Średni</option>
                    <option value="high">Wysoki</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="note-tags" className="text-sm font-medium">
                  Tagi (oddzielone przecinkami)
                </label>
                <input
                  id="note-tags"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  placeholder="np. ważne, do-followup, oferta"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Anuluj</Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Dodaj notatkę
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
