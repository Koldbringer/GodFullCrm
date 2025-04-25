"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, MapPin } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

export function GeocodeAddressesButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [total, setTotal] = useState(0)
  const [processed, setProcessed] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const { toast } = useToast()

  const handleGeocodeAddresses = async () => {
    setIsLoading(true)
    setProgress(0)
    setProcessed(0)
    setIsDialogOpen(true)
    
    try {
      let skip = 0
      const limit = 10
      let hasMore = true
      let totalProcessed = 0
      
      while (hasMore) {
        const response = await fetch(`/api/geocode?limit=${limit}&skip=${skip}`)
        const data = await response.json()
        
        if (!data.success) {
          toast({
            title: "Błąd",
            description: `Nie udało się zakodować adresów: ${data.error}`,
            variant: "destructive",
          })
          break
        }
        
        totalProcessed += data.processed
        setProcessed(totalProcessed)
        setRemaining(data.remaining)
        setProgress(Math.min(100, (totalProcessed / (totalProcessed + data.remaining)) * 100))
        
        // If no addresses were processed or no more remaining, we're done
        if (data.processed === 0 || data.remaining === 0) {
          hasMore = false
        } else {
          skip += limit
        }
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      toast({
        title: "Sukces!",
        description: `Zakodowano ${totalProcessed} adresów.`,
        variant: "default",
      })
      
      // Reload the page to show the new data if any addresses were processed
      if (totalProcessed > 0) {
        window.location.reload()
      }
    } catch (error) {
      console.error("Error geocoding addresses:", error)
      toast({
        title: "Błąd",
        description: "Wystąpił problem podczas kodowania adresów.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button 
        variant="outline" 
        onClick={handleGeocodeAddresses}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Kodowanie...
          </>
        ) : (
          <>
            <MapPin className="mr-2 h-4 w-4" />
            Koduj adresy
          </>
        )}
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kodowanie adresów</DialogTitle>
            <DialogDescription>
              Trwa kodowanie adresów na współrzędne geograficzne. To może potrwać kilka minut.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Przetworzono: {processed}</span>
              <span>Pozostało: {remaining}</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Zamknij
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
