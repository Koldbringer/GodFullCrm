"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import {
  FileText,
  MoreHorizontal,
  Mic,
  Play,
  Pause,
  Download,
  Clock,
  Search,
  Tag,
  Calendar,
  User,
  MessageSquare,
  Phone,
  Filter
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Przykładowe dane transkrypcji
const transcriptionsData = [
  {
    id: "TRANS001",
    customer_id: "c1",
    title: "Rozmowa telefoniczna - zapytanie o serwis",
    content: "Klient: Dzień dobry, dzwonię w sprawie serwisu klimatyzacji w moim biurze.\nPracownik: Dzień dobry, oczywiście, mogę pomóc. Kiedy ostatnio był przeprowadzany serwis?\nKlient: Około roku temu, w czerwcu.\nPracownik: Rozumiem. W takim razie rzeczywiście warto zaplanować przegląd. Czy ma Pan preferencje co do terminu?\nKlient: Najlepiej w przyszłym tygodniu, we wtorek lub środę.\nPracownik: Sprawdzę dostępność naszych techników. Czy preferuje Pan godziny poranne czy popołudniowe?\nKlient: Poranne, najlepiej między 9 a 11.\nPracownik: Dobrze, zarezerwuję termin na wtorek na godzinę 10:00. Czy to Panu odpowiada?\nKlient: Tak, idealnie.\nPracownik: Świetnie, zapisałem wizytę. Czy mogę jeszcze w czymś pomóc?\nKlient: Nie, to wszystko. Dziękuję.\nPracownik: Również dziękuję. Do widzenia.",
    source: "phone",
    source_id: "CALL123",
    duration: 245, // w sekundach
    created_at: "2023-10-05T10:15:00Z",
    created_by: "Jan Kowalski",
    audio_url: "/audio/transcription001.mp3",
    status: "completed",
    tags: ["serwis", "klimatyzacja", "umówienie wizyty"],
    sentiment: "positive",
    key_points: [
      "Klient chce umówić serwis klimatyzacji",
      "Ostatni serwis był rok temu",
      "Umówiono wizytę na wtorek na 10:00"
    ]
  },
  {
    id: "TRANS002",
    customer_id: "c1",
    title: "Rozmowa telefoniczna - reklamacja",
    content: "Klient: Dzień dobry, dzwonię w sprawie reklamacji. Klimatyzacja, którą zainstalowaliście w zeszłym miesiącu, nie działa prawidłowo.\nPracownik: Dzień dobry, bardzo przepraszam za problemy. Może Pan opisać, na czym polega usterka?\nKlient: Urządzenie bardzo głośno pracuje i nie chłodzi tak jak powinno.\nPracownik: Rozumiem, to rzeczywiście wymaga interwencji. Czy mogę prosić o numer seryjny urządzenia lub numer zlecenia montażu?\nKlient: Numer zlecenia to ZM-2023-156.\nPracownik: Dziękuję, sprawdzam... Tak, widzę zlecenie. Możemy wysłać technika jutro, aby sprawdził urządzenie. Czy będzie Pan dostępny?\nKlient: Tak, będę w biurze od 8:00 do 16:00.\nPracownik: Świetnie, wyślemy technika około godziny 11:00. Czy to Panu odpowiada?\nKlient: Tak, będę czekał.\nPracownik: Doskonale. Jeszcze raz przepraszam za niedogodności. Technik skontaktuje się z Panem przed wizytą.\nKlient: Dobrze, dziękuję.\nPracownik: Dziękuję za zgłoszenie. Do widzenia.",
    source: "phone",
    source_id: "CALL456",
    duration: 198, // w sekundach
    created_at: "2023-11-10T14:30:00Z",
    created_by: "Anna Wiśniewska",
    audio_url: "/audio/transcription002.mp3",
    status: "completed",
    tags: ["reklamacja", "usterka", "serwis gwarancyjny"],
    sentiment: "negative",
    key_points: [
      "Klient zgłasza reklamację klimatyzacji",
      "Urządzenie jest głośne i nie chłodzi prawidłowo",
      "Umówiono wizytę serwisową na następny dzień"
    ]
  },
  {
    id: "TRANS003",
    customer_id: "c1",
    title: "Notatka głosowa - potencjalna rozbudowa systemu",
    content: "Notatka dotycząca rozmowy z klientem Adam Bielecki w dniu 15 grudnia 2023. Klient wyraził zainteresowanie rozbudową systemu klimatyzacji w swoim biurze. Obecnie mają 5 jednostek, ale planują powiększyć przestrzeń biurową o dodatkowe 150m2. Potrzebują wyceny dla 3 dodatkowych jednostek oraz systemu centralnego sterowania. Klient podkreślił, że zależy mu na energooszczędnych rozwiązaniach. Termin realizacji: drugi kwartał 2024. Budżet: około 50 000 zł. Należy przygotować ofertę do końca stycznia.",
    source: "voice_note",
    source_id: "NOTE789",
    duration: 95, // w sekundach
    created_at: "2023-12-15T16:45:00Z",
    created_by: "Piotr Nowak",
    audio_url: "/audio/transcription003.mp3",
    status: "completed",
    tags: ["rozbudowa", "wycena", "system centralny"],
    sentiment: "positive",
    key_points: [
      "Klient chce rozbudować system o 3 jednostki",
      "Planuje powiększenie biura o 150m2",
      "Potrzebuje systemu centralnego sterowania",
      "Budżet: 50 000 zł"
    ]
  }
]

interface CustomerTranscriptionsProps {
  customerId: string
}

export function CustomerTranscriptions({ customerId }: CustomerTranscriptionsProps) {
  // Filtrowanie transkrypcji dla danego klienta
  const customerTranscriptions = transcriptionsData.filter((trans) => trans.customer_id === customerId)

  // Stan dla odtwarzacza audio
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTranscriptionId, setCurrentTranscriptionId] = useState<string | null>(null)

  // Stan dla filtrowania i wyszukiwania
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null)

  // Efekt do czyszczenia odtwarzacza audio przy odmontowaniu komponentu
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.src = ""
      }
    }
  }, [])

  // Funkcja do formatowania czasu trwania
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Funkcja do odtwarzania/pauzowania audio
  const togglePlayAudio = (audioUrl: string, transcriptionId: string) => {
    if (currentAudio && currentTranscriptionId === transcriptionId) {
      // Jeśli to samo audio jest już załadowane
      if (isPlaying) {
        currentAudio.pause()
        setIsPlaying(false)
      } else {
        currentAudio.play()
        setIsPlaying(true)
      }
    } else {
      // Jeśli to nowe audio
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.src = ""
      }

      const audio = new Audio(audioUrl)
      audio.addEventListener('ended', () => {
        setIsPlaying(false)
      })

      audio.play()
      setCurrentAudio(audio)
      setCurrentTranscriptionId(transcriptionId)
      setIsPlaying(true)
    }
  }

  // Funkcja do filtrowania transkrypcji
  const filteredTranscriptions = customerTranscriptions.filter((trans) => {
    // Filtrowanie po wyszukiwanej frazie
    const matchesSearch = searchQuery === "" ||
      trans.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trans.content.toLowerCase().includes(searchQuery.toLowerCase())

    // Filtrowanie po tagach
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some(tag => trans.tags.includes(tag))

    // Filtrowanie po sentymencie
    const matchesSentiment = !selectedSentiment ||
      trans.sentiment === selectedSentiment

    return matchesSearch && matchesTags && matchesSentiment
  })

  // Wszystkie unikalne tagi ze wszystkich transkrypcji
  const allTags = Array.from(
    new Set(
      customerTranscriptions.flatMap(trans => trans.tags)
    )
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Szukaj w transkrypcjach..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Szukaj w transkrypcjach"
            id="transcription-search"
          />
          <label htmlFor="transcription-search" className="sr-only">Szukaj w transkrypcjach</label>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={selectedSentiment || ""}
            onValueChange={(value) => setSelectedSentiment(value || null)}
            aria-label="Filtruj po sentymencie rozmowy"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtruj po sentymencie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Wszystkie sentymenty</SelectItem>
              <SelectItem value="positive">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  Pozytywny
                </div>
              </SelectItem>
              <SelectItem value="neutral">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
                  Neutralny
                </div>
              </SelectItem>
              <SelectItem value="negative">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                  Negatywny
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-1"
                aria-label="Filtruj po tagach"
              >
                <Tag className="h-4 w-4" />
                <span>Tagi</span>
                {selectedTags.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1 text-xs">
                    {selectedTags.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filtruj po tagach</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[200px] overflow-y-auto p-1">
                {allTags.map((tag) => (
                  <DropdownMenuItem key={tag} className="flex items-center gap-2" onSelect={(e) => e.preventDefault()}>
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="checkbox"
                        id={`tag-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTags([...selectedTags, tag])
                          } else {
                            setSelectedTags(selectedTags.filter(t => t !== tag))
                          }
                        }}
                        className="h-4 w-4"
                        aria-label={`Filtruj po tagu ${tag}`}
                      />
                      <label htmlFor={`tag-${tag}`} className="flex-1 cursor-pointer">{tag}</label>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-primary flex justify-center"
                    onClick={() => setSelectedTags([])}
                  >
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      Wyczyść wszystkie filtry
                    </Button>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {selectedTags.length > 0 || selectedSentiment || searchQuery ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedTags([])
                setSelectedSentiment(null)
                setSearchQuery("")
              }}
              title="Wyczyść filtry"
            >
              <Filter className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-sm text-muted-foreground">Aktywne tagi:</span>
          {selectedTags.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button
                type="button"
                className="ml-1 h-3 w-3 rounded-full"
                onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                aria-label={`Usuń tag ${tag}`}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}

      {filteredTranscriptions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Brak transkrypcji dla tego klienta lub dla wybranych filtrów.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTranscriptions
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((transcription) => (
              <Card key={transcription.id} className="overflow-hidden border-l-4 hover:shadow-md transition-shadow" style={{
                borderLeftColor: transcription.sentiment === "positive" ? "var(--success)" :
                                 transcription.sentiment === "negative" ? "var(--destructive)" :
                                 "var(--border)"
              }}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {transcription.source === "phone" ? (
                          <Phone className="h-4 w-4 text-blue-500" aria-label="Rozmowa telefoniczna" />
                        ) : (
                          <Mic className="h-4 w-4 text-green-500" aria-label="Notatka głosowa" />
                        )}
                        <span>{transcription.title}</span>
                      </CardTitle>
                      <CardDescription>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{format(new Date(transcription.created_at), "d MMMM yyyy, HH:mm", { locale: pl })}</span>
                          </span>
                          <span aria-hidden="true" className="hidden sm:inline">•</span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{formatDuration(transcription.duration)}</span>
                          </span>
                          <span aria-hidden="true" className="hidden sm:inline">•</span>
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            <span>{transcription.created_by}</span>
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          transcription.sentiment === "positive" ? "success" :
                          transcription.sentiment === "negative" ? "destructive" :
                          "secondary"
                        }
                        className="flex items-center gap-1"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        <span>
                          {transcription.sentiment === "positive" ? "Pozytywny" :
                           transcription.sentiment === "negative" ? "Negatywny" :
                           "Neutralny"}
                        </span>
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Opcje transkrypcji">
                            <span className="sr-only">Otwórz menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Pobierz audio
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Eksportuj transkrypcję
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Dodaj notatkę
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => togglePlayAudio(transcription.audio_url, transcription.id)}
                          aria-label={isPlaying && currentTranscriptionId === transcription.id ? "Zatrzymaj odtwarzanie" : "Odtwórz nagranie"}
                        >
                          {isPlaying && currentTranscriptionId === transcription.id ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          {isPlaying && currentTranscriptionId === transcription.id ? "Odtwarzanie..." : "Odtwórz nagranie"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {transcription.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="relative">
                          <div className="max-h-32 overflow-hidden whitespace-pre-line text-sm">
                            {transcription.content}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
                          <Button
                            variant="ghost"
                            className="w-full mt-2 text-xs text-muted-foreground"
                            aria-label={`Pokaż pełną transkrypcję: ${transcription.title}`}
                          >
                            Pokaż pełną transkrypcję
                          </Button>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{transcription.title}</DialogTitle>
                          <DialogDescription>
                            {format(new Date(transcription.created_at), "d MMMM yyyy, HH:mm", { locale: pl })} • {formatDuration(transcription.duration)}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="whitespace-pre-line mt-4 text-sm leading-relaxed">
                          {transcription.content}
                        </div>
                        <div className="mt-6 bg-muted/30 p-4 rounded-md border">
                          <h4 className="text-sm font-medium mb-2 flex items-center">
                            <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                            Kluczowe punkty rozmowy:
                          </h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {transcription.key_points.map((point, index) => (
                              <li key={index} className="text-sm">{point}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-muted-foreground">
                          <span className="flex items-center mr-4">
                            <User className="h-4 w-4 mr-1" />
                            Transkrypcja utworzona przez: {transcription.created_by}
                          </span>
                          {transcription.sentiment && (
                            <span className="flex items-center">
                              <span className="mr-1">Sentyment:</span>
                              <Badge
                                variant={
                                  transcription.sentiment === "positive" ? "success" :
                                  transcription.sentiment === "negative" ? "destructive" :
                                  "secondary"
                                }
                                className="text-xs"
                              >
                                {transcription.sentiment === "positive" ? "Pozytywny" :
                                 transcription.sentiment === "negative" ? "Negatywny" :
                                 "Neutralny"}
                              </Badge>
                            </span>
                          )}
                        </div>
                        <DialogFooter className="mt-6">
                          <Button variant="outline" onClick={() => togglePlayAudio(transcription.audio_url, transcription.id)}>
                            {isPlaying && currentTranscriptionId === transcription.id ? (
                              <>
                                <Pause className="mr-2 h-4 w-4" />
                                Pauza
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                Odtwórz nagranie
                              </>
                            )}
                          </Button>
                          <Button>
                            <Download className="mr-2 h-4 w-4" />
                            Pobierz transkrypcję
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {transcription.key_points && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Kluczowe punkty:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {transcription.key_points.slice(0, 2).map((point, index) => (
                            <li key={index} className="text-sm">{point}</li>
                          ))}
                          {transcription.key_points.length > 2 && (
                            <li className="text-sm text-muted-foreground">
                              ...i {transcription.key_points.length - 2} więcej
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  )
}
