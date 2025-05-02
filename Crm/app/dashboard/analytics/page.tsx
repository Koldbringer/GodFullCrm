import { Metadata } from 'next'
import { AnalyticsDashboard } from '@/components/dashboard/analytics-dashboard'
import { PageHeader } from '@/components/ui/page-header'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'Analytics Dashboard | HVAC CRM',
  description: 'Comprehensive analytics dashboard for your HVAC business',
}

export default function AnalyticsPage({ searchParams }: { searchParams: { embed?: string } }) {
  const isEmbedded = searchParams.embed === 'true'
  
  return (
    <div className={`container mx-auto py-6 space-y-6 ${isEmbedded ? 'p-0' : ''}`}>
      {!isEmbedded && (
        <PageHeader
          title="Analytics Dashboard"
          description="Comprehensive analytics and insights for your business"
        />
      )}
      
      <Suspense 
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        }
      >
        <AnalyticsDashboard />
      </Suspense>
    </div>
  )
}
