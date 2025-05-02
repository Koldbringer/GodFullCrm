'use client'

import { useEffect, useState } from 'react'
import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'
import { toast } from '@/components/ui/use-toast'

type PostgresChangesPayload = {
  new: any
  old: any
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
}

type SubscriptionOptions = {
  /**
   * The table to subscribe to
   */
  table: string
  
  /**
   * The schema to subscribe to (default: 'public')
   */
  schema?: string
  
  /**
   * The event to subscribe to (default: '*' for all events)
   */
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  
  /**
   * Optional filter string for the subscription
   * Example: "user_id=eq.123"
   */
  filter?: string
  
  /**
   * Callback function to handle changes
   */
  onChange: (payload: PostgresChangesPayload) => void
  
  /**
   * Custom channel name (optional)
   * If not provided, a name will be generated based on the table and filter
   */
  channelName?: string
}

/**
 * Hook for subscribing to real-time changes in Supabase
 * 
 * @param options Subscription options
 * @returns Object containing subscription status and error
 */
export function useRealtimeSubscription(options: SubscriptionOptions) {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  useEffect(() => {
    // Create Supabase client
    const client = createClient()
    setSupabase(client)

    // Generate channel name if not provided
    const channelName = options.channelName || 
      `${options.table}-${options.filter || 'all'}-${Math.random().toString(36).substring(2, 9)}`

    try {
      // Create and subscribe to channel
      const newChannel = client
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: options.event || '*',
            schema: options.schema || 'public',
            table: options.table,
            filter: options.filter,
          },
          (payload) => {
            // Transform payload to expected format
            const transformedPayload = {
              new: payload.new,
              old: payload.old,
              eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
            }
            
            // Call onChange callback
            options.onChange(transformedPayload)
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsSubscribed(true)
          } else {
            setIsSubscribed(false)
          }
        })

      setChannel(newChannel)

      // Cleanup function
      return () => {
        if (client && newChannel) {
          client.removeChannel(newChannel)
          setChannel(null)
          setIsSubscribed(false)
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error in subscription')
      console.error('Subscription error:', error)
      setError(error)
      toast({
        title: 'Subscription Error',
        description: error.message,
        variant: 'destructive',
      })
      return () => {}
    }
  }, [
    options.table,
    options.schema,
    options.event,
    options.filter,
    options.channelName,
  ])

  // Function to manually unsubscribe
  const unsubscribe = () => {
    if (supabase && channel) {
      supabase.removeChannel(channel)
      setChannel(null)
      setIsSubscribed(false)
    }
  }

  return {
    isSubscribed,
    error,
    unsubscribe,
  }
}
