'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'
import { toast } from '@/components/ui/use-toast'

// Define the context type
interface RealtimeContextType {
  /**
   * Subscribe to a table for real-time updates
   */
  subscribeToTable: (
    table: string,
    callback: (payload: any) => void,
    options?: {
      event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
      filter?: string
      schema?: string
    }
  ) => string | null
  
  /**
   * Unsubscribe from a channel
   */
  unsubscribe: (channelId: string) => void
  
  /**
   * Check if real-time is available
   */
  isRealtimeAvailable: boolean
}

// Create the context
const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

// Provider props
interface RealtimeProviderProps {
  children: ReactNode
}

/**
 * Provider component for Supabase real-time subscriptions
 */
export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [channels, setChannels] = useState<Map<string, RealtimeChannel>>(new Map())
  const [isRealtimeAvailable, setIsRealtimeAvailable] = useState(false)

  // Initialize Supabase client
  useEffect(() => {
    const client = createClient()
    setSupabase(client)
    
    // Check if real-time is available
    try {
      const channel = client.channel('realtime-test')
      if (channel) {
        setIsRealtimeAvailable(true)
        client.removeChannel(channel)
      }
    } catch (error) {
      console.error('Real-time not available:', error)
      setIsRealtimeAvailable(false)
    }
    
    // Cleanup function
    return () => {
      // Remove all channels on unmount
      if (client) {
        channels.forEach((channel) => {
          client.removeChannel(channel)
        })
      }
    }
  }, [])

  /**
   * Subscribe to a table for real-time updates
   */
  const subscribeToTable = (
    table: string,
    callback: (payload: any) => void,
    options: {
      event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
      filter?: string
      schema?: string
    } = {}
  ): string | null => {
    if (!supabase || !isRealtimeAvailable) {
      return null
    }
    
    try {
      // Generate a unique channel ID
      const channelId = `${table}-${options.filter || 'all'}-${Math.random().toString(36).substring(2, 9)}`
      
      // Create and subscribe to the channel
      const channel = supabase
        .channel(channelId)
        .on(
          'postgres_changes',
          {
            event: options.event || '*',
            schema: options.schema || 'public',
            table,
            filter: options.filter,
          },
          (payload) => {
            callback(payload)
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`Subscribed to ${table}`)
          } else if (status === 'CHANNEL_ERROR') {
            console.error(`Error subscribing to ${table}`)
            toast({
              title: 'Subscription Error',
              description: `Could not subscribe to ${table}`,
              variant: 'destructive',
            })
          }
        })
      
      // Store the channel
      setChannels((prev) => {
        const newChannels = new Map(prev)
        newChannels.set(channelId, channel)
        return newChannels
      })
      
      return channelId
    } catch (error) {
      console.error('Error creating subscription:', error)
      toast({
        title: 'Subscription Error',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      })
      return null
    }
  }

  /**
   * Unsubscribe from a channel
   */
  const unsubscribe = (channelId: string) => {
    if (!supabase) {
      return
    }
    
    const channel = channels.get(channelId)
    
    if (channel) {
      supabase.removeChannel(channel)
      
      setChannels((prev) => {
        const newChannels = new Map(prev)
        newChannels.delete(channelId)
        return newChannels
      })
    }
  }

  // Context value
  const value: RealtimeContextType = {
    subscribeToTable,
    unsubscribe,
    isRealtimeAvailable,
  }

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  )
}

/**
 * Hook to use the real-time context
 */
export function useRealtime() {
  const context = useContext(RealtimeContext)
  
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider')
  }
  
  return context
}
