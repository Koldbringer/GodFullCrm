"use client"

import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { ArrowDown, ArrowUp, FileText, Mail, MessageSquare, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

// Przykładowe dane komunikacji
const communicationData = [
  {
    id: "COM001",
    customer_id: "c1",
    type: "email",
    direction: "incoming",
    subject: "Pytanie o przegląd klimatyzacji",
    content:
      "Dzień dobry, chciałbym zapytać o możliwość umówienia przeglądu klimatyzacji w moim biurze. Kiedy byłby najbliższy możliwy termin? Pozdrawiam, Adam Bielecki",
    date: "2023-10-10T14:30:00Z",
    sender: "adam.bielecki@example.com",
    recipient: "serwis@hvac-crm.pl",
    status: "answered",
    related_to: null,
    attachments: [],
    tags: ["przegląd", "zapytanie"],
  },
  {
    id: "COM002",
    customer_id: "c1",
    type: "email",
    direction: "outgoing",
    subject: "Re: Pytanie o przegląd klimatyzacji",
    content:
      "Dzień dobry Panie Adamie, dziękujemy za wiadomość. Najbliższy możliwy termin przeglądu to 15 października o godzinie 10:00. Czy ten termin Panu odpowiada? Pozdrawiamy, Zespół HVAC CRM",
    date: "2023-10-10T15:45:00Z",
    sender: "serwis@hvac-crm.pl",
    recipient: "adam.bielecki@example.com",
    status: "sent",
    related_to: "COM001",
    attachments: [],
    tags: ["przegląd", "odpowiedź"],
  },
  {
    id: "COM003",
    customer_id: "c1",
    type: "email",
    direction: "incoming",
    subject: "Re: Re: Pytanie o przegląd klimatyzacji",
    content: "Dzień dobry, tak, ten termin mi odpowiada. Proszę o potwierdzenie. Pozdrawiam, Adam Bielecki",
    date: "2023-10-11T09:15:00Z",
    sender: "adam.bielecki@example.com",
    recipient: "serwis@hvac-crm.pl",
    status: "answered",
    related_to: "COM002",
    attachments: [],
    tags: ["przegląd", "potwierdzenie"],
  },
  {
    id: "COM004",
    customer_id: "c1",
    type: "email",
    direction: "outgoing",
    subject: "Potwierdzenie przeglądu klimatyzacji",
    content:
      "Dzień dobry Panie Adamie, potwierdzamy wizytę serwisową w dniu 15 października o godzinie 10:00. Nasz technik, Pan Piotr Nowak, będzie u Pana o umówionej godzinie. W załączniku przesyłamy informacje dotyczące przeglądu. Pozdrawiamy, Zespół HVAC CRM",
    date: "2023-10-11T10:30:00Z",
    sender: "serwis@hvac-crm.pl",
    recipient: "adam.bielecki@example.com",
    status: "sent",
    related_to: "COM003",
    attachments: [
      {
        name: "Informacje_o_przegladzie.pdf",
        size: "245 KB",
        type: "application/pdf",
      },
    ],
    tags: ["przegląd", "potwierdzenie"],
  },
  {
    id: "COM005",
    customer_id: "c1",
    type: "phone",
    direction: "incoming",
    subject: "Pytanie o fakturę",
    content:
      "Klient zadzwonił z pytaniem o fakturę za ostatni przegląd. Wyjaśniono, że faktura została wysłana mailem i powinna dotrzeć w ciągu najbliższych godzin.",
    date: "2023-10-16T13:20:00Z",
    sender: "+48 123 456 789",
    recipient: "+48 987 654 321",
    status: "closed",
    related_to: null,
    attachments: [],
    tags: ["faktura", "zapytanie"],
  },
  {
    id: "COM006",
    customer_id: "c1",
    type: "email",
    direction: "outgoing",
    subject: "Faktura za przegląd klimatyzacji",
    content:
      "Dzień dobry Panie Adamie, w załączniku przesyłamy fakturę za wykonany przegląd klimatyzacji. Termin płatności: 14 dni. Dziękujemy za skorzystanie z naszych usług. Pozdrawiamy, Zespół HVAC CRM",
    date: "2023-10-16T14:00:00Z",
    sender: "faktury@hvac-crm.pl",
    recipient: "adam.bielecki@example.com",
    status: "sent",
    related_to: "COM005",
    attachments: [
      {
        name: "Faktura_FV2023_123.pdf",
        size: "156 KB",
        type: "application/pdf",
      },
    ],
    tags: ["faktura"],
  },
  {
    id: "COM007",
    customer_id: "c1",
    type: "note",
    direction: "internal",
    subject: "Notatka z rozmowy telefonicznej",
    content:
      "Klient zadzwonił z informacją, że jest zainteresowany wymianą klimatyzatora w sali konferencyjnej. Prosi o przygotowanie oferty na urządzenie o wyższej mocy chłodniczej.",
    date: "2023-10-20T11:30:00Z",
    sender: "Jan Kowalski",
    recipient: "Dział handlowy",
    status: "open",
    related_to: null,
    attachments: [],
    tags: ["oferta", "wymiana"],
  },
]

interface CustomerCommunicationProps {
  customerId: string
}

export function CustomerCommunication({ customerId }: CustomerCommunicationProps) {
  // Filtrowanie komunikacji dla danego klienta
  const customerCommunication = communicationData.filter((comm) => comm.customer_id === customerId)

  // Grupowanie komunikacji według typu
  const emails = customerCommunication.filter((comm) => comm.type === "email")
  const calls = customerCommunication.filter((comm) => comm.type === "phone")
  const notes = customerCommunication.filter((comm) => comm.type === "note")

  // Funkcja do określania ikony dla typu komunikacji
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      case "note":
        return <FileText className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  // Funkcja do określania ikony dla kierunku komunikacji
  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case "incoming":
        return <ArrowDown className="h-4 w-4 text-green-500" />
      case "outgoing":
        return <ArrowUp className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList>
        <TabsTrigger value="all">Wszystkie</TabsTrigger>
        <TabsTrigger value="emails">Emaile</TabsTrigger>
        <TabsTrigger value="calls">Rozmowy telefoniczne</TabsTrigger>
        <TabsTrigger value="notes">Notatki</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        {customerCommunication.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Brak historii komunikacji dla tego klienta.</p>
            </CardContent>
          </Card>
        ) : (
          customerCommunication
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((comm) => (
              <Card key={comm.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(comm.type)}
                      <span className="font-medium">{comm.subject}</span>
                      {comm.direction !== "internal" && getDirectionIcon(comm.direction)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{comm.type}</Badge>
                      <Badge variant={comm.status === "open" ? "default" : "secondary"}>{comm.status}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <span>{format(new Date(comm.date), "d MMMM yyyy, HH:mm", { locale: pl })}</span>
                    <span>•</span>
                    <span>
                      {comm.direction === "incoming" ? "Od: " : comm.direction === "outgoing" ? "Do: " : ""}
                      {comm.direction === "incoming"
                        ? comm.sender
                        : comm.direction === "outgoing"
                          ? comm.recipient
                          : ""}
                    </span>
                  </div>

                  <p className="text-sm whitespace-pre-line">{comm.content}</p>

                  {comm.attachments.length > 0 && (
                    <div className="mt-3">
                      <span className="text-sm text-muted-foreground">Załączniki:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {comm.attachments.map((attachment, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {attachment.name} ({attachment.size})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {comm.tags.length > 0 && (
                    <div className="mt-3">
                      <span className="text-sm text-muted-foreground">Tagi:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {comm.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end mt-3">
                    <Button size="sm" variant="outline">
                      Szczegóły
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </TabsContent>

      <TabsContent value="emails" className="space-y-4">
        {emails.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Brak historii emaili dla tego klienta.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-6">
                {emails
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((email, index) => (
                    <div key={email.id} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                            <AvatarFallback>{email.direction === "incoming" ? "AB" : "HC"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {email.direction === "incoming" ? email.sender : "HVAC CRM"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(email.date), "d MMMM yyyy, HH:mm", { locale: pl })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getDirectionIcon(email.direction)}
                          <Badge variant={email.status === "open" ? "default" : "secondary"}>{email.status}</Badge>
                        </div>
                      </div>

                      <div className="ml-11">
                        <div className="font-medium mb-1">{email.subject}</div>
                        <p className="text-sm whitespace-pre-line">{email.content}</p>

                        {email.attachments.length > 0 && (
                          <div className="mt-3">
                            <span className="text-sm text-muted-foreground">Załączniki:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {email.attachments.map((attachment, idx) => (
                                <Badge key={idx} variant="outline" className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  {attachment.name} ({attachment.size})
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end mt-3">
                          <Button size="sm" variant="outline">
                            Odpowiedz
                          </Button>
                        </div>
                      </div>

                      {index < emails.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="calls" className="space-y-4">
        {calls.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Brak historii rozmów telefonicznych dla tego klienta.</p>
            </CardContent>
          </Card>
        ) : (
          calls
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((call) => (
              <Card key={call.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">{call.subject}</span>
                      {getDirectionIcon(call.direction)}
                    </div>
                    <Badge variant={call.status === "open" ? "default" : "secondary"}>{call.status}</Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <span>{format(new Date(call.date), "d MMMM yyyy, HH:mm", { locale: pl })}</span>
                    <span>•</span>
                    <span>
                      {call.direction === "incoming" ? "Od: " : "Do: "}
                      {call.direction === "incoming" ? call.sender : call.recipient}
                    </span>
                  </div>

                  <p className="text-sm">{call.content}</p>

                  {call.tags.length > 0 && (
                    <div className="mt-3">
                      <span className="text-sm text-muted-foreground">Tagi:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {call.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end mt-3">
                    <Button size="sm" variant="outline">
                      Dodaj notatkę
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </TabsContent>

      <TabsContent value="notes" className="space-y-4">
        {notes.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="mb-4 text-muted-foreground">Brak notatek dla tego klienta.</p>
              <Button>Dodaj notatkę</Button>
            </CardContent>
          </Card>
        ) : (
          notes
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((note) => (
              <Card key={note.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">{note.subject}</span>
                    </div>
                    <Badge variant={note.status === "open" ? "default" : "secondary"}>{note.status}</Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <span>{format(new Date(note.date), "d MMMM yyyy, HH:mm", { locale: pl })}</span>
                    <span>•</span>
                    <span>Autor: {note.sender}</span>
                  </div>

                  <p className="text-sm">{note.content}</p>

                  {note.tags.length > 0 && (
                    <div className="mt-3">
                      <span className="text-sm text-muted-foreground">Tagi:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {note.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end mt-3">
                    <Button size="sm" variant="outline">
                      Edytuj notatkę
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </TabsContent>
    </Tabs>
  )
}
