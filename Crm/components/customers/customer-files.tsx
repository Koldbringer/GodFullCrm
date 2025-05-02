"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import {
  FileText,
  MoreHorizontal,
  Plus,
  User,
  Upload,
  Download,
  File,
  FileImage,
  FileSpreadsheet,
  FileText as FileTextIcon,
  FileArchive,
  Eye,
  Trash,
  Lock,
  LockOpen,
  Loader2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { extractTextFromDocument } from "@/lib/ocr" // Import the OCR utility function
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

// Define the file type
interface CustomerFile {
  id: string
  customer_id: string
  name: string
  description: string
  file_url: string
  file_type: string
  file_size: number
  file_category: string
  uploaded_by: string
  created_at: string
  updated_at: string
  is_private: boolean
  tags: string[]
}

// Fallback files in case of error
const fallbackFiles: CustomerFile[] = [
  {
    id: "FILE001",
    customer_id: "c1",
    name: "Umowa serwisowa.pdf",
    description: "Umowa serwisowa na okres 12 miesięcy",
    file_url: "/files/umowa_serwisowa.pdf",
    file_type: "application/pdf",
    file_size: 1258000,
    file_category: "Umowy",
    uploaded_by: "Jan Kowalski",
    created_at: "2023-01-15T11:00:00Z",
    updated_at: "2023-01-15T11:00:00Z",
    is_private: false,
    tags: ["umowa", "serwis", "ważne"]
  }
]

interface CustomerFilesProps {
  customerId: string
}

export function CustomerFiles({ customerId }: CustomerFilesProps) {
  const [customerFiles, setCustomerFiles] = useState<CustomerFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileDescription, setFileDescription] = useState("")
  const [fileCategory, setFileCategory] = useState("Dokumentacja")
  const [fileTags, setFileTags] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Fetch customer files from Supabase
  useEffect(() => {
    const fetchCustomerFiles = async () => {
      setIsLoading(true)
      try {
        const supabase = createClient()

        // Get files for this customer
        const { data, error } = await supabase
          .from('customer_files')
          .select('*')
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        // Transform the data into customer files
        const formattedFiles: CustomerFile[] = data.map(file => ({
          id: file.id,
          customer_id: file.customer_id,
          name: file.name || "Nieznany plik",
          description: file.description || "",
          file_url: file.file_url || "",
          file_type: file.file_type || "application/octet-stream",
          file_size: file.file_size || 0,
          file_category: file.file_category || "Inne",
          uploaded_by: file.uploaded_by || "System",
          created_at: file.created_at || new Date().toISOString(),
          updated_at: file.updated_at || new Date().toISOString(),
          is_private: file.is_private || false,
          tags: file.tags || []
        }))

        setCustomerFiles(formattedFiles.length > 0 ? formattedFiles : fallbackFiles)
      } catch (error) {
        console.error("Error fetching customer files:", error)
        toast.error("Nie udało się pobrać plików klienta")
        setCustomerFiles(fallbackFiles)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomerFiles()
  }, [customerId])

  // Funkcja do określania ikony pliku na podstawie typu
  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) {
      // Use FileTextIcon for PDF as FilePdf is not available
      return <FileTextIcon className="h-8 w-8 text-red-500" />
    } else if (fileType.includes("image")) {
      return <FileImage className="h-8 w-8 text-blue-500" />
    } else if (fileType.includes("spreadsheet") || fileType.includes("excel") || fileType.includes("xlsx")) {
      return <FileSpreadsheet className="h-8 w-8 text-green-500" />
    } else if (fileType.includes("zip") || fileType.includes("archive") || fileType.includes("compressed")) {
      return <FileArchive className="h-8 w-8 text-yellow-500" />
    } else {
      return <FileTextIcon className="h-8 w-8 text-gray-500" />
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
    } // <-- Added missing closing brace
  }

  // Handle file upload to Supabase
  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Nie wybrano pliku do przesłania")
      return
    }

    setIsUploading(true)

    try {
      const supabase = createClient()

      // Generate a unique file path
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${customerId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('customer-files')
        .upload(fileName, selectedFile)

      if (uploadError) {
        throw new Error(`Error uploading file: ${uploadError.message}`)
      }

      // Get the public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from('customer-files')
        .getPublicUrl(fileName)

      // Process OCR if it's a document
      let extractedText = null
      if (selectedFile.type.includes('pdf') ||
          selectedFile.type.includes('image') ||
          selectedFile.type.includes('document')) {
        try {
          extractedText = await extractTextFromDocument(selectedFile, customerId)
          console.log("OCR completed successfully")
        } catch (ocrError) {
          console.error("OCR processing failed:", ocrError)
          // Continue anyway - OCR is not critical
        }
      }

      // Parse tags from the input
      const parsedTags = fileTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      // Save file metadata to Supabase
      const { data: fileData, error: fileError } = await supabase
        .from('customer_files')
        .insert({
          customer_id: customerId,
          name: selectedFile.name,
          description: fileDescription,
          file_url: publicUrl,
          file_type: selectedFile.type,
          file_size: selectedFile.size,
          file_category: fileCategory,
          uploaded_by: "Current User", // In a real app, get this from auth
          is_private: isPrivate,
          tags: parsedTags,
          ocr_text: extractedText,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()

      if (fileError) {
        throw new Error(`Error saving file metadata: ${fileError.message}`)
      }

      // Add the new file to the list
      setCustomerFiles(prev => [
        {
          id: fileData[0].id,
          customer_id: customerId,
          name: selectedFile.name,
          description: fileDescription,
          file_url: publicUrl,
          file_type: selectedFile.type,
          file_size: selectedFile.size,
          file_category: fileCategory,
          uploaded_by: "Current User", // In a real app, get this from auth
          is_private: isPrivate,
          tags: parsedTags,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        ...prev
      ])

      toast.success("Plik został przesłany pomyślnie")

      // Reset form
      setSelectedFile(null)
      setFileDescription("")
      setFileCategory("Dokumentacja")
      setFileTags("")
      setIsPrivate(false)
    } catch (error) {
      console.error("Error uploading file:", error)
      toast.error("Wystąpił błąd podczas przesyłania pliku")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList>
        <TabsTrigger value="all">Wszystkie pliki</TabsTrigger>
        <TabsTrigger value="documents">Dokumenty</TabsTrigger>
        <TabsTrigger value="images">Zdjęcia</TabsTrigger>
        <TabsTrigger value="upload">Prześlij plik</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-muted-foreground">Ładowanie plików...</p>
            </CardContent>
          </Card>
        ) : customerFiles.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="mb-4 text-muted-foreground">Brak plików dla tego klienta.</p>
              <Button>Dodaj pierwszy plik</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customerFiles
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((file) => (
                <Card key={file.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-muted rounded-md p-2">
                        {getFileIcon(file.file_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium truncate">{file.name}</h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Otwórz menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Pobierz
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Podgląd
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                {file.is_private ? (
                                  <>
                                    <LockOpen className="mr-2 h-4 w-4" />
                                    Ustaw jako publiczny
                                  </>
                                ) : (
                                  <>
                                    <Lock className="mr-2 h-4 w-4" />
                                    Ustaw jako prywatny
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" />
                                Usuń plik
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        {file.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{file.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span>{formatFileSize(file.file_size)}</span>
                          <span>•</span>
                          <span>{format(new Date(file.created_at), "d MMM yyyy", { locale: pl })}</span>
                          {file.is_private && (
                            <>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-800 border-yellow-300">
                                <Lock className="h-3 w-3 mr-1" />
                                Prywatny
                              </Badge>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <User className="h-3 w-3" />
                          <span>{file.uploaded_by}</span>
                          <span>•</span>
                          <span>{file.file_category}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {file.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button size="sm" variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Pobierz
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="documents" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customerFiles
            .filter(file => file.file_type.includes("pdf") || file.file_type.includes("document"))
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((file) => (
              <Card key={file.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-muted rounded-md p-2">
                      {getFileIcon(file.file_type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium truncate">{file.name}</h4>
                      {file.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{file.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{formatFileSize(file.file_size)}</span>
                        <span>•</span>
                        <span>{format(new Date(file.created_at), "d MMM yyyy", { locale: pl })}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {file.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Pobierz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </TabsContent>

      <TabsContent value="images" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customerFiles
            .filter(file => file.file_type.includes("image"))
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((file) => (
              <Card key={file.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-muted rounded-md p-2">
                      {getFileIcon(file.file_type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium truncate">{file.name}</h4>
                      {file.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{file.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{formatFileSize(file.file_size)}</span>
                        <span>•</span>
                        <span>{format(new Date(file.created_at), "d MMM yyyy", { locale: pl })}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {file.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button size="sm" variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      Podgląd
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </TabsContent>

      <TabsContent value="upload">
        <Card>
          <CardHeader>
            <CardTitle>Prześlij nowy plik</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">
                      {selectedFile ? selectedFile.name : "Kliknij, aby wybrać plik lub przeciągnij i upuść"}
                    </p>
                    {/* Add conditional check for selectedFile before accessing properties */}
                    {selectedFile && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatFileSize(selectedFile.size)} • {selectedFile.type}
                      </p>
                    )}
                  </div>
                </Label>
              </div>
              <div>
                <Label htmlFor="file-description" className="text-sm font-medium">
                  Opis pliku
                </Label>
                <Input
                  id="file-description"
                  placeholder="Wprowadź opis pliku"
                  value={fileDescription}
                  onChange={(e) => setFileDescription(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="file-category" className="text-sm font-medium">
                    Kategoria
                  </Label>
                  <Select value={fileCategory} onValueChange={setFileCategory}>
                    <SelectTrigger id="file-category" className="mt-1">
                      <SelectValue placeholder="Wybierz kategorię" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dokumentacja">Dokumentacja</SelectItem>
                      <SelectItem value="Umowy">Umowy</SelectItem>
                      <SelectItem value="Oferty">Oferty</SelectItem>
                      <SelectItem value="Faktury">Faktury</SelectItem>
                      <SelectItem value="Protokoły">Protokoły</SelectItem>
                      <SelectItem value="Zdjęcia">Zdjęcia</SelectItem>
                      <SelectItem value="Plany">Plany</SelectItem>
                      <SelectItem value="Inne">Inne</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="file-tags" className="text-sm font-medium">
                    Tagi (oddzielone przecinkami)
                  </Label>
                  <Input
                    id="file-tags"
                    placeholder="np. umowa, ważne, serwis"
                    value={fileTags}
                    onChange={(e) => setFileTags(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="file-private"
                  checked={isPrivate}
                  onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
                />
                <Label htmlFor="file-private" className="text-sm font-medium">
                  Plik prywatny (widoczny tylko dla uprawnionych użytkowników)
                </Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedFile(null)
                setFileDescription("")
                setFileCategory("Dokumentacja")
                setFileTags("")
                setIsPrivate(false)
              }}
              disabled={isUploading}
            >
              Anuluj
            </Button>
            <Button
              onClick={handleFileUpload}
              disabled={!selectedFile || isUploading}
            >
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
      </TabsContent>
    </Tabs>
  )
}
