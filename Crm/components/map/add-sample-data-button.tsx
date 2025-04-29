"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Database } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function AddSampleDataButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAddSampleData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/sample-data')
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Sukces!",
          description: data.message === 'Sample data already exists' 
            ? "Przykładowe dane już istnieją w bazie danych." 
            : `Dodano przykładowe dane: ${data.data.sitesCount} lokalizacji, ${data.data.customersCount} klientów, ${data.data.techniciansCount} techników, ${data.data.ordersCount} zleceń.`,
          variant: "default",
        })
        
        // Reload the page to show the new data
        window.location.reload()
      } else {
        toast({
          title: "Błąd",
          description: `Nie udało się dodać przykładowych danych: ${data.error}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding sample data:", error)
      toast({
        title: "Błąd",
        description: "Wystąpił problem podczas dodawania przykładowych danych.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleAddSampleData}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Dodawanie...
        </>
      ) : (
        "Dodaj przykładowe dane"
      )}
    </Button>
  )
}
