import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ContractsLoading() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[350px]" />
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-auto">
          <TabsTrigger value="list">Lista umów</TabsTrigger>
          <TabsTrigger value="stats">Statystyki</TabsTrigger>
          <TabsTrigger value="calendar">Harmonogram</TabsTrigger>
          <TabsTrigger value="renewal">Odnowienia</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-[250px]" />
              <Skeleton className="h-10 w-[200px]" />
            </div>
            <div className="rounded-md border">
              <Skeleton className="h-[500px] w-full" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
