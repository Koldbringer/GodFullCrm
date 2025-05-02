'use client'

import { useState, useEffect } from 'react'
import { useRealtime } from '@/components/providers/RealtimeProvider'
import { toast } from '@/components/ui/use-toast'
import { supabaseCache } from '@/lib/supabase/cache'
import { logSupabaseError } from '@/lib/supabase/error-handler'

type FetchFn<T> = () => Promise<T>
type FilterFn<T> = (data: T) => boolean
type ProcessFn<T> = (data: T) => T

interface UseRealtimeDataOptions<T> {
  // The table to subscribe to
  table: string
  
  // Function to fetch data
  fetchData: FetchFn<T>
  
  // Optional filter function
  filterFn?: FilterFn<T>
  
  // Optional processing function
  processFn?: ProcessFn<T>
  
  // Optional filter for the subscription
  filter?: string
  
  // Optional event type to listen for
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  
  // Optional cache key
  cacheKey?: string
  
  // Whether to use caching
  useCache?: boolean
  
  // Whether to show toast notifications
  showNotifications?: boolean
  
  // Custom notification messages
  notifications?: {
    onInsert?: (data: any) => string
    onUpdate?: (data: any) => string
    onDelete?: (data: any) => string
    onError?: (error: any) => string
  }
  
  // Dependencies array for the useEffect hook
  deps?: any[]
}

/**
 * Hook for fetching and subscribing to real-time data updates
 */
export function useRealtimeData<T extends any[] | null>({
  table,
  fetchData,
  filterFn,
  processFn,
  filter,
  event = '*',
  cacheKey,
  useCache = true,
  showNotifications = false,
  notifications,
  deps = []
}: UseRealtimeDataOptions<T>) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { isRealtimeAvailable, subscribeToTable } = useRealtime()
  
  // Generate a cache key if not provided
  const cacheKeyToUse = cacheKey || `${table}:${filter || 'all'}`
  
  // Function to load data
  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Check cache first if enabled
      if (useCache) {
        const cachedData = supabaseCache.get<T>(cacheKeyToUse)
        if (cachedData) {
          setData(cachedData)
          setIsLoading(false)
          return
        }
      }
      
      // Fetch fresh data
      let fetchedData = await fetchData()
      
      // Apply filter if provided
      if (filterFn && fetchedData) {
        fetchedData = Array.isArray(fetchedData) 
          ? fetchedData.filter(filterFn) as T
          : fetchedData
      }
      
      // Apply processing if provided
      if (processFn && fetchedData) {
        fetchedData = processFn(fetchedData)
      }
      
      // Cache the result if enabled
      if (useCache && fetchedData) {
        supabaseCache.set(cacheKeyToUse, fetchedData)
      }
      
      setData(fetchedData)
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      setError(err)
      logSupabaseError(error, `useRealtimeData(${table})`)
      
      if (showNotifications) {
        const errorMessage = notifications?.onError 
          ? notifications.onError(error)
          : `Error loading ${table} data`
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive'
        })
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  // Load data on mount and when dependencies change
  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  
  // Set up real-time subscription
  useEffect(() => {
    if (!isRealtimeAvailable) return
    
    const channelId = subscribeToTable(
      table,
      async (payload) => {
        console.log(`Change in ${table}:`, payload)
        
        try {
          // Refresh data
          await loadData()
          
          // Show notifications if enabled
          if (showNotifications) {
            const eventType = payload.eventType
            
            if (eventType === 'INSERT' && notifications?.onInsert) {
              toast.success(notifications.onInsert(payload.new))
            } else if (eventType === 'UPDATE' && notifications?.onUpdate) {
              toast.info(notifications.onUpdate(payload.new))
            } else if (eventType === 'DELETE' && notifications?.onDelete) {
              toast.info(notifications.onDelete(payload.old))
            }
          }
        } catch (error) {
          console.error(`Error refreshing ${table} data:`, error)
        }
      },
      { event, filter }
    )
    
    // No cleanup needed as the RealtimeProvider handles it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, isRealtimeAvailable, ...deps])
  
  // Function to manually refresh data
  const refresh = async () => {
    await loadData()
  }
  
  return {
    data,
    isLoading,
    error,
    refresh
  }
}
