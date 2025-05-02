"use client"

import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface DataLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the data is currently loading
   */
  isLoading?: boolean;
  
  /**
   * Whether the data is being refreshed (different visual state than initial loading)
   */
  isRefreshing?: boolean;
  
  /**
   * Error message to display if there was an error loading the data
   */
  error?: string | null;
  
  /**
   * Function to retry loading the data if there was an error
   */
  onRetry?: () => void;
  
  /**
   * Function to refresh the data
   */
  onRefresh?: () => void;
  
  /**
   * Message to display if there is no data
   */
  emptyMessage?: string;
  
  /**
   * Whether there is data to display
   */
  isEmpty?: boolean;
  
  /**
   * Content to display when there is no data
   */
  emptyContent?: React.ReactNode;
  
  /**
   * Content to display when data is loaded successfully
   */
  children: React.ReactNode;
  
  /**
   * Custom loading skeleton to display
   */
  loadingSkeleton?: React.ReactNode;
}

/**
 * DataLoader component for handling loading, error, and empty states
 * 
 * @example
 * ```tsx
 * <DataLoader
 *   isLoading={isLoading}
 *   error={error}
 *   onRetry={fetchData}
 *   isEmpty={data.length === 0}
 *   emptyMessage="No data found"
 * >
 *   <DataTable data={data} columns={columns} />
 * </DataLoader>
 * ```
 */
export function DataLoader({
  isLoading = false,
  isRefreshing = false,
  error = null,
  onRetry,
  onRefresh,
  emptyMessage = "No data found",
  isEmpty = false,
  emptyContent,
  children,
  loadingSkeleton,
  className,
  ...props
}: DataLoaderProps) {
  // If there's an error, show error message with retry button
  if (error) {
    return (
      <div className={cn("space-y-4", className)} {...props}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        {onRetry && (
          <Button 
            onClick={(e) => {
              // Prevent event propagation to parent elements (like interactive cards)
              e.stopPropagation();
              onRetry();
            }} 
            variant="outline"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  // If data is loading (initial load), show skeleton
  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)} {...props}>
        {loadingSkeleton || (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}
      </div>
    );
  }

  // If data is empty, show empty message
  if (isEmpty) {
    return (
      <div className={cn("space-y-4", className)} {...props}>
        {emptyContent || (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">{emptyMessage}</p>
            {onRefresh && (
              <Button 
                onClick={(e) => {
                  // Prevent event propagation to parent elements (like interactive cards)
                  e.stopPropagation();
                  onRefresh();
                }} 
                variant="outline" 
                className="mt-4"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  // If data is refreshing, show refresh indicator with content
  if (isRefreshing) {
    return (
      <div className={cn("space-y-4 relative", className)} {...props}>
        <div className="absolute top-0 right-0 p-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        </div>
        <div className="opacity-70 transition-opacity">{children}</div>
      </div>
    );
  }

  // Otherwise, show the children
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {children}
    </div>
  );
}