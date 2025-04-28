import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import BigCalendar from "@/components/calendar/BigCalendar"

export default function CalendarPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nowe wydarzenie
          </Button>
        </div>
      </div>
      <BigCalendar />
    </div>
  )
}
