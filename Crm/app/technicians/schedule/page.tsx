import { Metadata } from 'next'
import { TechnicianScheduler } from '@/components/technicians/technician-scheduler'
import { PageHeader } from '@/components/ui/page-header'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'Technician Scheduler | HVAC CRM',
  description: 'Schedule and manage technician appointments',
}

export default function TechnicianSchedulePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PageHeader
          title="Technician Scheduler"
          description="Schedule and manage technician appointments"
        />
        
        <Suspense 
          fallback={
            <div className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-10 w-64" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          }
        >
          <TechnicianScheduler />
        </Suspense>
      </div>
    </div>
  )
}
