import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Skeleton className="h-9 w-[200px]" />
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <Skeleton className="h-9 w-[200px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-[400px]" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    </div>
  )
}
