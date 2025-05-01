"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { Loader2, Camera, Upload, CheckSquare, Square, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Form schema for validation
const formSchema = z.object({
  serviceDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  deviceId: z.string().min(1, "Wybierz urządzenie"),
  serviceType: z.enum(["maintenance", "repair", "installation", "inspection"]),
  checklist: z.array(z.string()),
  issues: z.array(z.object({
    description: z.string().min(1, "Opis problemu jest wymagany"),
    resolved: z.boolean().default(false),
  })).optional(),
  partsUsed: z.array(z.object({
    name: z.string().min(1, "Nazwa części jest wymagana"),
    quantity: z.number().min(1, "Ilość musi być większa od 0"),
  })).optional(),
  notes: z.string().optional(),
  customerSignature: z.boolean().default(false),
  images: z.array(z.string()).optional(),
})

type FormData = z.infer<typeof formSchema>

interface ServiceReportFormProps {
  serviceOrderId: string
  initialData?: Partial<FormData>
  onSuccess?: () => void
}

// Mock data for the form
const mockDevices = [
  { id: "dev1", name: "Klimatyzator Mitsubishi MSZ-AP25VG", location: "Salon" },
  { id: "dev2", name: "Klimatyzator Daikin FTXM35N", location: "Sypialnia" },
  { id: "dev3", name: "Klimatyzator LG ARTCOOL", location: "Kuchnia" },
]

const maintenanceChecklistItems = [
  "Czyszczenie filtrów powietrza",
  "Sprawdzenie ciśnienia czynnika chłodniczego",
  "Czyszczenie wymiennika ciepła jednostki wewnętrznej",
  "Czyszczenie wymiennika ciepła jednostki zewnętrznej",
  "Sprawdzenie szczelności instalacji",
  "Sprawdzenie odpływu skroplin",
  "Sprawdzenie mocowań jednostek",
  "Sprawdzenie stanu izolacji przewodów",
  "Sprawdzenie poprawności działania sterownika",
  "Sprawdzenie temperatury nawiewu",
]

export function ServiceReportForm({ serviceOrderId, initialData, onSuccess }: ServiceReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceDate: initialData?.serviceDate || new Date().toISOString().split('T')[0],
      startTime: initialData?.startTime || new Date().toTimeString().split(' ')[0].substring(0, 5),
      endTime: initialData?.endTime || "",
      deviceId: initialData?.deviceId || "",
      serviceType: initialData?.serviceType || "maintenance",
      checklist: initialData?.checklist || [],
      issues: initialData?.issues || [],
      partsUsed: initialData?.partsUsed || [],
      notes: initialData?.notes || "",
      customerSignature: initialData?.customerSignature || false,
      images: initialData?.images || [],
    }
  })
  
  const watchServiceType = form.watch("serviceType")
  
  const handleChecklistItem = (item: string, checked: boolean) => {
    const currentChecklist = form.getValues("checklist") || []
    
    if (checked) {
      form.setValue("checklist", [...currentChecklist, item])
    } else {
      form.setValue("checklist", currentChecklist.filter(i => i !== item))
    }
  }
  
  const addIssue = () => {
    const currentIssues = form.getValues("issues") || []
    form.setValue("issues", [...currentIssues, { description: "", resolved: false }])
  }
  
  const removeIssue = (index: number) => {
    const currentIssues = form.getValues("issues") || []
    form.setValue("issues", currentIssues.filter((_, i) => i !== index))
  }
  
  const addPart = () => {
    const currentParts = form.getValues("partsUsed") || []
    form.setValue("partsUsed", [...currentParts, { name: "", quantity: 1 }])
  }
  
  const removePart = (index: number) => {
    const currentParts = form.getValues("partsUsed") || []
    form.setValue("partsUsed", currentParts.filter((_, i) => i !== index))
  }
  
  const captureImage = () => {
    // In a real implementation, this would use the device camera
    // For now, we'll just add a placeholder image URL
    const newImage = `https://picsum.photos/400/300?random=${Math.random()}`
    setCapturedImages([...capturedImages, newImage])
    form.setValue("images", [...capturedImages, newImage])
  }
  
  const removeImage = (index: number) => {
    const newImages = capturedImages.filter((_, i) => i !== index)
    setCapturedImages(newImages)
    form.setValue("images", newImages)
  }
  
  async function onSubmit(data: FormData) {
    setIsSubmitting(true)
    try {
      // TODO: Replace with actual API call
      console.log("Submitting service report:", data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success("Raport serwisowy został zapisany!")
      onSuccess?.()
    } catch (error) {
      console.error("Error submitting service report:", error)
      toast.error("Wystąpił błąd podczas zapisywania raportu")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Raport serwisowy</CardTitle>
          <CardDescription>
            Wypełnij raport z wykonanej usługi serwisowej
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 h-auto">
                  <TabsTrigger value="basic">Podstawowe</TabsTrigger>
                  <TabsTrigger value="checklist">Czynności</TabsTrigger>
                  <TabsTrigger value="issues">Problemy</TabsTrigger>
                  <TabsTrigger value="photos">Zdjęcia</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="serviceDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Od</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Do</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="deviceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Urządzenie</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="">Wybierz urządzenie</option>
                            {mockDevices.map(device => (
                              <option key={device.id} value={device.id}>
                                {device.name} ({device.location})
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Typ usługi</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="maintenance">Konserwacja</option>
                            <option value="repair">Naprawa</option>
                            <option value="installation">Instalacja</option>
                            <option value="inspection">Przegląd</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Uwagi</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Dodatkowe uwagi..." 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="checklist" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Lista czynności</h3>
                    
                    {watchServiceType === "maintenance" && (
                      <div className="space-y-2">
                        {maintenanceChecklistItems.map((item, index) => {
                          const isChecked = form.getValues("checklist")?.includes(item) || false
                          
                          return (
                            <div key={index} className="flex items-center space-x-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleChecklistItem(item, !isChecked)}
                              >
                                {isChecked ? (
                                  <CheckSquare className="h-5 w-5" />
                                ) : (
                                  <Square className="h-5 w-5" />
                                )}
                              </Button>
                              <span className={isChecked ? "line-through text-muted-foreground" : ""}>
                                {item}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <h3 className="font-medium mb-2">Użyte części</h3>
                      
                      <div className="space-y-3">
                        {(form.getValues("partsUsed") || []).map((part, index) => (
                          <div key={index} className="flex items-end space-x-2">
                            <div className="flex-1">
                              <FormField
                                control={form.control}
                                name={`partsUsed.${index}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs">Nazwa części</FormLabel>
                                    <FormControl>
                                      <Input placeholder="np. Filtr powietrza" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="w-20">
                              <FormField
                                control={form.control}
                                name={`partsUsed.${index}.quantity`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs">Ilość</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        min={1} 
                                        {...field} 
                                        onChange={e => field.onChange(parseInt(e.target.value))}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10"
                              onClick={() => removePart(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addPart}
                          className="w-full"
                        >
                          Dodaj część
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="issues" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <h3 className="font-medium">Problemy i usterki</h3>
                    
                    {(form.getValues("issues") || []).map((issue, index) => (
                      <div key={index} className="space-y-2 border rounded-md p-3">
                        <div className="flex justify-between">
                          <FormField
                            control={form.control}
                            name={`issues.${index}.description`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel className="text-xs">Opis problemu</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Opisz problem..." 
                                    className="resize-none" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 mt-5"
                            onClick={() => removeIssue(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`issues.${index}.resolved`}
                          render={({ field }) => (
                            <div className="flex items-center space-x-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => field.onChange(!field.value)}
                              >
                                {field.value ? (
                                  <CheckSquare className="h-5 w-5" />
                                ) : (
                                  <Square className="h-5 w-5" />
                                )}
                              </Button>
                              <span>Problem rozwiązany</span>
                            </div>
                          )}
                        />
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addIssue}
                      className="w-full"
                    >
                      Dodaj problem
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="photos" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <h3 className="font-medium">Zdjęcia</h3>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {capturedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={image} 
                            alt={`Zdjęcie ${index + 1}`} 
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-6 w-6 absolute top-1 right-1"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={captureImage}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Zrób zdjęcie
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={captureImage} // In a real app, this would open a file picker
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Dodaj zdjęcie
                      </Button>
                    </div>
                    
                    <div className="pt-4">
                      <FormField
                        control={form.control}
                        name="customerSignature"
                        render={({ field }) => (
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => field.onChange(!field.value)}
                            >
                              {field.value ? (
                                <CheckSquare className="h-5 w-5" />
                              ) : (
                                <Square className="h-5 w-5" />
                              )}
                            </Button>
                            <span>Podpis klienta uzyskany</span>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Zapisywanie...
                  </>
                ) : (
                  "Zapisz raport"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
