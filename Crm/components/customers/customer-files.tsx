"use client"

import { useState } from "react"
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
  // FilePdf, // Removed as it's not exported
  FileImage,
  FileSpreadsheet,
  FileText as FileTextIcon,
  FileArchive,
  Eye,
  Trash,
  Lock,
  LockOpen
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

// Przykładowe dane plików
const filesData = [
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
  },
  {
    id: "FILE002",
    customer_id: "c1",
    name: "Oferta cenowa - klimatyzatory.xlsx",
    description: "Oferta cenowa na klimatyzatory do biura",
    file_url: "/files/oferta_cenowa.xlsx",
    file_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    file_size: 458000,
    file_category: "Oferty",
    uploaded_by: "Anna Wiśniewska",
    created_at: "2023-03-20T14:30:00Z",
    updated_at: "2023-03-20T14:30:00Z",
    is_private: true,
    tags: ["oferta", "klimatyzacja", "cennik"]
  },
  {
    id: "FILE003",
    customer_id: "c1",
    name: "Zdjęcia z instalacji.zip",
    description: "Zdjęcia z instalacji klimatyzatorów w biurze",
    file_url: "/files/zdjecia_instalacja.zip",
    file_type: "application/zip",
    file_size: 15800000,
    file_category: "Dokumentacja",
    uploaded_by: "Piotr Nowak",
    created_at: "2023-06-05T16:30:00Z",
    updated_at: "2023-06-05T16:30:00Z",
    is_private: false,
    tags: ["zdjęcia", "instalacja", "dokumentacja"]
  },
  {
    id: "FILE004",
    customer_id: "c1",
    name: "Plan pomieszczeń.jpg",
    description: "Plan pomieszczeń biurowych z zaznaczonymi miejscami instalacji",
    file_url: "/files/plan_pomieszczen.jpg",
    file_type: "image/jpeg",
    file_size: 2450000,
    file_category: "Plany",
    uploaded_by: "Jan Kowalski",
    created_at: "2023-02-10T09:15:00Z",
    updated_at: "2023-02-10T09:15:00Z",
    is_private: false,
    tags: ["plan", "pomieszczenia", "instalacja"]
  },
  {
    id: "FILE005",
    customer_id: "c1",
    name: "Protokół odbioru.pdf",
    description: "Protokół odbioru instalacji klimatyzacji",
    file_url: "/files/protokol_odbioru.pdf",
    file_type: "application/pdf",
    file_size: 980000,
    file_category: "Protokoły",
    uploaded_by: "Piotr Nowak",
    created_at: "2023-06-10T15:45:00Z",
    updated_at: "2023-06-10T15:45:00Z",
    is_private: false,
    tags: ["protokół", "odbiór", "instalacja"]
  }
]

interface CustomerFilesProps {
  customerId: string
}

export function CustomerFiles({ customerId }: CustomerFilesProps) {
  // Filtrowanie plików dla danego klienta
  const customerFiles = filesData.filter((file) => file.customer_id === customerId)
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileDescription, setFileDescription] = useState("")
  const [fileCategory, setFileCategory] = useState("Dokumentacja")
  const [fileTags, setFileTags] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  
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
  
  // Obsługa przesyłania pliku
  // The extractTextFromDocument function is now imported from "@/lib/ocr"
  const handleFileUpload = async () => { // Make async
    if (!selectedFile) {
      console.warn("No file selected for upload.");
      // TODO: Show user feedback
      return;
    }

    console.log("Rozpoczynanie przesyłania pliku:", selectedFile.name);
    console.log("Opis:", fileDescription);
    console.log("Kategoria:", fileCategory);
    console.log("Tagi:", fileTags);
    console.log("Prywatny:", isPrivate);

    // TODO: Implement actual file upload to your storage (e.g., Supabase Storage, S3)
    // const storageUrl = await uploadFileToStorage(selectedFile); 
    // if (!storageUrl) {
    //   console.error("File upload to storage failed.");
    //   // TODO: Show error message
    //   return;
    // }
    // console.log("File uploaded to storage:", storageUrl);
    
    // --- Call Unstract OCR ---
    // The API key is handled within the extractTextFromDocument function using environment variables
    const extractedText = await extractTextFromDocument(selectedFile, customerId); // Pass customerId
    
    if (extractedText !== null) { // Check for null explicitly
      console.log("OCR zakończone sukcesem.");
      // TODO: Save file metadata (including storageUrl) and extractedText to your database
      // await saveFileDataToDatabase({
      //   customerId,
      //   name: selectedFile.name,
      //   description: fileDescription,
      //   file_url: storageUrl, 
      //   file_type: selectedFile.type,
      //   file_size: selectedFile.size,
      //   file_category: fileCategory,
      //   uploaded_by: "Current User Name", // Get current user
      //   is_private: isPrivate,
      //   tags: fileTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      //   ocr_text: extractedText // Store the extracted text
      // });
      console.log("File metadata and OCR text ready to be saved.");
    } else {
      console.error("OCR processing failed.");
      // TODO: Handle OCR failure - maybe still save the file without OCR text?
    }
    // --- End Unstract OCR ---

    // Reset formularza (consider resetting only on success)
    setSelectedFile(null);
    setFileDescription("")
    setFileCategory("Dokumentacja")
    setFileTags("")
    setIsPrivate(false)
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
        {customerFiles.length === 0 ? (
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
            <Button variant="outline">Anuluj</Button>
            <Button onClick={handleFileUpload} disabled={!selectedFile}>
              <Upload className="mr-2 h-4 w-4" />
              Prześlij plik
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
