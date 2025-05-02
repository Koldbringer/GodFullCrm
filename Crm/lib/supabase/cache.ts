/**
 * Simple in-memory cache for Supabase data
 * This helps reduce database calls for frequently accessed data
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

interface CacheOptions {
  /**
   * Time to live in milliseconds (default: 5 minutes)
   */
  ttl?: number
  
  /**
   * Whether to refresh the cache in the background when accessed (default: true)
   */
  backgroundRefresh?: boolean
}

class SupabaseCache {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private refreshCallbacks: Map<string, () => Promise<any>> = new Map()
  private refreshing: Set<string> = new Set()
  
  /**
   * Default cache options
   */
  private defaultOptions: Required<CacheOptions> = {
    ttl: 5 * 60 * 1000, // 5 minutes
    backgroundRefresh: true,
  }
  
  /**
   * Gets a value from the cache
   * 
   * @param key The cache key
   * @returns The cached value or undefined if not found
   */
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return undefined
    }
    
    const now = Date.now()
    
    // Check if entry is expired
    if (now > entry.expiresAt) {
      // If we have a refresh callback and we're not already refreshing,
      // refresh the cache in the background
      if (this.refreshCallbacks.has(key) && !this.refreshing.has(key)) {
        this.refreshEntry(key)
      }
      
      // Remove expired entry
      this.cache.delete(key)
      return undefined
    }
    
    // If entry is more than halfway through its TTL and we have a refresh callback,
    // refresh the cache in the background
    const options = this.getOptions(key)
    if (
      options.backgroundRefresh &&
      now > entry.timestamp + (entry.expiresAt - entry.timestamp) / 2 &&
      this.refreshCallbacks.has(key) &&
      !this.refreshing.has(key)
    ) {
      this.refreshEntry(key)
    }
    
    return entry.data
  }
  
  /**
   * Sets a value in the cache
   * 
   * @param key The cache key
   * @param data The data to cache
   * @param options Cache options
   */
  set<T>(key: string, data: T, options?: CacheOptions): void {
    const { ttl } = { ...this.defaultOptions, ...options }
    const now = Date.now()
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    })
  }
  
  /**
   * Registers a refresh callback for a cache key
   * 
   * @param key The cache key
   * @param callback The callback function to refresh the data
   */
  registerRefreshCallback<T>(key: string, callback: () => Promise<T>): void {
    this.refreshCallbacks.set(key, callback)
  }
  
  /**
   * Refreshes a cache entry in the background
   * 
   * @param key The cache key to refresh
   */
  private async refreshEntry(key: string): Promise<void> {
    const callback = this.refreshCallbacks.get(key)
    
    if (!callback) {
      return
    }
    
    this.refreshing.add(key)
    
    try {
      const data = await callback()
      const options = this.getOptions(key)
      this.set(key, data, options)
    } catch (error) {
      console.error(`Error refreshing cache for key "${key}":`, error)
    } finally {
      this.refreshing.delete(key)
    }
  }
  
  /**
   * Gets the cache options for a key
   * 
   * @param key The cache key
   * @returns The cache options
   */
  private getOptions(key: string): Required<CacheOptions> {
    // In a more advanced implementation, we could store options per key
    return this.defaultOptions
  }
  
  /**
   * Removes a value from the cache
   * 
   * @param key The cache key
   */
  remove(key: string): void {
    this.cache.delete(key)
  }
  
  /**
   * Clears all values from the cache
   */
  clear(): void {
    this.cache.clear()
  }
  
  /**
   * Gets or sets a value in the cache
   * 
   * @param key The cache key
   * @param fetchFn Function to fetch the data if not in cache
   * @param options Cache options
   * @returns The cached or fetched data
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    // Check if data is in cache
    const cachedData = this.get<T>(key)
    
    if (cachedData !== undefined) {
      return cachedData
    }
    
    // Register refresh callback
    this.registerRefreshCallback(key, fetchFn)
    
    // Fetch data
    const data = await fetchFn()
    
    // Cache data
    this.set(key, data, options)
    
    return data
  }
}

// Export a singleton instance
export const supabaseCache = new SupabaseCache()
