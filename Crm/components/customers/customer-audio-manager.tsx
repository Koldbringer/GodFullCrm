"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { 
  FileAudio, 
  Upload, 
  Mic, 
  Play, 
  Pause, 
  Download, 
  Trash2,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

import { AudioService } from "@/lib/services/audio-service"
import { TranscriptionService } from "@/lib/services/transcription-service"

interface CustomerAudioManagerProps {
  customerId: string
}

export function CustomerAudioManager({ customerId }: CustomerAudioManagerProps) {
  const [audioFiles, setAudioFiles] = useState<any[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null)
  const [isTranscribing, setIsTranscribing] = useState<Record<string, boolean>>({})
  const [transcriptions, setTranscriptions] = useState<any[]>([])
  
  // Pobierz pliki audio i transkrypcje przy pierwszym renderowaniu
  useEffect(() => {
    loadAudioFiles()
    loadTranscriptions()
  }, [customerId])
  
  // Zatrzymaj odtwarzanie audio przy odmontowaniu komponentu
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.src = ""
      }
    }
  }, [])
  
  // Funkcja do ładowania plików audio
  const loadAudioFiles = async () => {
    const files = await AudioService.getAudioFilesByCustomerId(customerId)
    setAudioFiles(files)
  }
  
  // Funkcja do ładowania transkrypcji
  const loadTranscriptions = async () => {
    const transcripts = await TranscriptionService.getTranscriptionsByCustomerId(customerId)
    setTranscriptions(transcripts)
  }
  
  // Funkcja do odtwarzania/pauzowania audio
  const togglePlayAudio = (audioUrl: string, audioId: string) => {
    if (currentAudio && currentAudioId === audioId) {
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
      setCurrentAudioId(audioId)
      setIsPlaying(true)
    }
  }
  
  // Funkcja do formatowania rozmiaru pliku
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return bytes + " B"
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB"
    } else if (bytes < 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + " MB"
    } else {
      return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB"
    }
  }
  
  // Funkcja do przesyłania pliku audio
  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Nie wybrano pliku do przesłania")
      return
    }
    
    setIsUploading(true)
    
    try {
      const result = await AudioService.saveAudioFile(
        customerId,
        selectedFile.name,
        selectedFile,
        'upload'
      )
      
      if (result) {
        toast.success("Plik audio został przesłany")
        setSelectedFile(null)
        loadAudioFiles()
      } else {
        toast.error("Nie udało się przesłać pliku audio")
      }
    } catch (error) {
      console.error("Błąd podczas przesyłania pliku:", error)
      toast.error("Wystąpił błąd podczas przesyłania pliku")
    } finally {
      setIsUploading(false)
    }
  }
  
  // Funkcja do usuwania pliku audio
  const handleDeleteAudioFile = async (fileId: string) => {
    try {
      const success = await AudioService.deleteAudioFile(fileId)
      
      if (success) {
        toast.success("Plik audio został usunięty")
        loadAudioFiles()
        
        // Jeśli usuwany plik jest aktualnie odtwarzany, zatrzymaj odtwarzanie
        if (currentAudioId === fileId && currentAudio) {
          currentAudio.pause()
          currentAudio.src = ""
          setCurrentAudio(null)
          setCurrentAudioId(null)
          setIsPlaying(false)
        }
      } else {
        toast.error("Nie udało się usunąć pliku audio")
      }
    } catch (error) {
      console.error("Błąd podczas usuwania pliku:", error)
      toast.error("Wystąpił błąd podczas usuwania pliku")
    }
  }
  
  // Funkcja do transkrypcji pliku audio
  const handleTranscribeAudio = async (audioFile: any) => {
    // Ustaw stan transkrypcji dla tego pliku
    setIsTranscribing(prev => ({ ...prev, [audioFile.id]: true }))
    
    try {
      // Sprawdź, czy transkrypcja już istnieje
      const existingTranscription = transcriptions.find(
        t => t.audio_file_id === audioFile.id
      )
      
      if (existingTranscription) {
        toast.info("Transkrypcja dla tego pliku już istnieje")
        setIsTranscribing(prev => ({ ...prev, [audioFile.id]: false }))
        return
      }
      
      // Wykonaj transkrypcję
      const transcriptionText = await TranscriptionService.transcribeAudio(audioFile.file_url)
      
      if (!transcriptionText) {
        toast.error("Nie udało się wykonać transkrypcji")
        setIsTranscribing(prev => ({ ...prev, [audioFile.id]: false }))
        return
      }
      
      // Analizuj transkrypcję
      const analysis = await TranscriptionService.analyzeTranscription(transcriptionText)
      
      // Zapisz transkrypcję w bazie danych
      const result = await TranscriptionService.saveTranscription(
        customerId,
        audioFile.id,
        transcriptionText,
        analysis
      )
      
      if (result) {
        toast.success("Transkrypcja została wykonana i zapisana")
        loadTranscriptions()
      } else {
        toast.error("Nie udało się zapisać transkrypcji")
      }
    } catch (error) {
      console.error("Błąd podczas transkrypcji:", error)
      toast.error("Wystąpił błąd podczas transkrypcji")
    } finally {
      setIsTranscribing(prev => ({ ...prev, [audioFile.id]: false }))
    }
  }
  
  // Funkcja do usuwania transkrypcji
  const handleDeleteTranscription = async (transcriptionId: string) => {
    try {
      const success = await TranscriptionService.deleteTranscription(transcriptionId)
      
      if (success) {
        toast.success("Transkrypcja została usunięta")
        loadTranscriptions()
      } else {
        toast.error("Nie udało się usunąć transkrypcji")
      }
    } catch (error) {
      console.error("Błąd podczas usuwania transkrypcji:", error)
      toast.error("Wystąpił błąd podczas usuwania transkrypcji")
    }
  }
  
  // Sprawdź, czy plik ma już transkrypcję
  const hasTranscription = (audioFileId: string) => {
    return transcriptions.some(t => t.audio_file_id === audioFileId)
  }
  
  // Pobierz transkrypcję dla pliku audio
  const getTranscriptionForAudioFile = (audioFileId: string) => {
    return transcriptions.find(t => t.audio_file_id === audioFileId)
  }
  
  return (
    <div className="space-y-6">
      {/* Sekcja przesyłania plików */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Prześlij nowy plik audio</CardTitle>
          <CardDescription>
            Prześlij plik audio, który zostanie powiązany z tym klientem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Input
                type="file"
                id="audio-upload"
                className="hidden"
                accept="audio/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <Label htmlFor="audio-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">
                    {selectedFile ? selectedFile.name : "Kliknij, aby wybrać plik audio lub przeciągnij i upuść"}
                  </p>
                  {selectedFile && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  )}
                </div>
              </Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setSelectedFile(null)} disabled={!selectedFile || isUploading}>
            Anuluj
          </Button>
          <Button onClick={handleFileUpload} disabled={!selectedFile || isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Przesyłanie...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Prześlij plik
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Lista plików audio */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Pliki audio klienta</h3>
        
        {audioFiles.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Brak plików audio dla tego klienta.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {audioFiles.map((audioFile) => {
              const transcription = getTranscriptionForAudioFile(audioFile.id);
              const isCurrentlyTranscribing = isTranscribing[audioFile.id] || false;
              
              return (
                <Card key={audioFile.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileAudio className="h-4 w-4 text-blue-500" />
                          {audioFile.file_name}
                        </CardTitle>
                        <CardDescription>
                          <div className="flex items-center gap-2 mt-1">
                            <span>Dodano: {format(new Date(audioFile.created_at), "d MMMM yyyy, HH:mm", { locale: pl })}</span>
                            <span>•</span>
                            <span>Rozmiar: {formatFileSize(audioFile.file_size)}</span>
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {transcription ? (
                          <Badge variant="success" className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>Transkrypcja dostępna</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            <span>Brak transkrypcji</span>
                          </Badge>
                        )}
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
                            onClick={() => togglePlayAudio(audioFile.file_url, audioFile.id)}
                            aria-label={isPlaying && currentAudioId === audioFile.id ? "Zatrzymaj odtwarzanie" : "Odtwórz nagranie"}
                          >
                            {isPlaying && currentAudioId === audioFile.id ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            {isPlaying && currentAudioId === audioFile.id ? "Odtwarzanie..." : "Odtwórz nagranie"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {!transcription && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleTranscribeAudio(audioFile)}
                              disabled={isCurrentlyTranscribing}
                            >
                              {isCurrentlyTranscribing ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Transkrybowanie...
                                </>
                              ) : (
                                <>
                                  <Mic className="mr-2 h-4 w-4" />
                                  Transkrybuj
                                </>
                              )}
                            </Button>
                          )}
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(audioFile.file_url, '_blank')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Pobierz
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Usuń
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Czy na pewno chcesz usunąć ten plik?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Ta akcja jest nieodwracalna. Plik zostanie trwale usunięty z systemu.
                                  {transcription && (
                                    <p className="mt-2 text-destructive">
                                      Uwaga: Usunięcie pliku spowoduje również usunięcie powiązanej transkrypcji.
                                    </p>
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Anuluj</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteAudioFile(audioFile.id)}>
                                  Usuń
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      
                      {/* Wyświetl transkrypcję, jeśli jest dostępna */}
                      {transcription && (
                        <div className="mt-4">
                          <Separator className="my-2" />
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-primary" />
                              Transkrypcja
                            </h4>
                            <div className="flex items-center gap-2">
                              {transcription.sentiment && (
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
                              )}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    Pokaż pełną transkrypcję
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Transkrypcja: {audioFile.file_name}</DialogTitle>
                                    <DialogDescription>
                                      Utworzono: {format(new Date(transcription.created_at), "d MMMM yyyy, HH:mm", { locale: pl })}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="whitespace-pre-line mt-4 text-sm leading-relaxed">
                                    {transcription.content}
                                  </div>
                                  {transcription.key_points && transcription.key_points.length > 0 && (
                                    <div className="mt-6 bg-muted/30 p-4 rounded-md border">
                                      <h4 className="text-sm font-medium mb-2 flex items-center">
                                        <FileText className="h-4 w-4 mr-2 text-primary" />
                                        Kluczowe punkty rozmowy:
                                      </h4>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {transcription.key_points.map((point: string, index: number) => (
                                          <li key={index} className="text-sm">{point}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {transcription.action_items && transcription.action_items.length > 0 && (
                                    <div className="mt-4 bg-muted/30 p-4 rounded-md border">
                                      <h4 className="text-sm font-medium mb-2">Sugerowane działania:</h4>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {transcription.action_items.map((item: string, index: number) => (
                                          <li key={index} className="text-sm">{item}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  <DialogFooter className="mt-6">
                                    <Button variant="outline" onClick={() => togglePlayAudio(audioFile.file_url, audioFile.id)}>
                                      {isPlaying && currentAudioId === audioFile.id ? (
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
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="destructive">
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Usuń transkrypcję
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Czy na pewno chcesz usunąć tę transkrypcję?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Ta akcja jest nieodwracalna. Transkrypcja zostanie trwale usunięta z systemu.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Anuluj</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDeleteTranscription(transcription.id)}>
                                            Usuń
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                          <div className="max-h-20 overflow-hidden relative">
                            <p className="text-sm text-muted-foreground">
                              {transcription.content.substring(0, 200)}
                              {transcription.content.length > 200 && "..."}
                            </p>
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent"></div>
                          </div>
                          {transcription.key_points && transcription.key_points.length > 0 && (
                            <div className="mt-2">
                              <h5 className="text-xs font-medium text-muted-foreground">Kluczowe punkty:</h5>
                              <ul className="list-disc pl-5 mt-1">
                                {transcription.key_points.slice(0, 2).map((point: string, index: number) => (
                                  <li key={index} className="text-xs text-muted-foreground">{point}</li>
                                ))}
                                {transcription.key_points.length > 2 && (
                                  <li className="text-xs text-muted-foreground">...</li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}
