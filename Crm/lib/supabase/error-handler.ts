import { PostgrestError } from '@supabase/supabase-js'

/**
 * Error types for Supabase operations
 */
export type SupabaseErrorType = 
  | 'auth'
  | 'database'
  | 'storage'
  | 'realtime'
  | 'connection'
  | 'unknown'

/**
 * Structured error response
 */
export interface StructuredError {
  type: SupabaseErrorType
  message: string
  code?: string
  details?: string
  originalError?: any
}

/**
 * Handles Supabase errors and returns a structured error object
 * 
 * @param error The error to handle
 * @param context Optional context information
 * @returns A structured error object
 */
export function handleSupabaseError(
  error: unknown,
  context?: string
): StructuredError {
  // Default error structure
  const defaultError: StructuredError = {
    type: 'unknown',
    message: 'An unknown error occurred',
  }

  // If no error, return default
  if (!error) {
    return defaultError
  }

  // Handle PostgrestError (database errors)
  if (isPostgrestError(error)) {
    return {
      type: 'database',
      message: error.message || 'Database operation failed',
      code: error.code,
      details: error.details || error.hint,
      originalError: error,
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    // Try to determine error type from message
    const errorType = determineErrorType(error.message)
    
    return {
      type: errorType,
      message: error.message,
      originalError: error,
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    const errorType = determineErrorType(error)
    
    return {
      type: errorType,
      message: error,
    }
  }

  // Handle object errors
  if (typeof error === 'object') {
    const errorObj = error as any
    
    return {
      type: determineErrorType(errorObj.message || errorObj.error || ''),
      message: errorObj.message || errorObj.error || 'Unknown error',
      code: errorObj.code || errorObj.statusCode,
      details: errorObj.details || errorObj.hint,
      originalError: error,
    }
  }

  // Add context if provided
  if (context) {
    defaultError.message = `${defaultError.message} (${context})`
  }

  return defaultError
}

/**
 * Logs a Supabase error to the console
 * 
 * @param error The error to log
 * @param context Optional context information
 */
export function logSupabaseError(error: unknown, context?: string): void {
  const structuredError = handleSupabaseError(error, context)
  
  console.error(
    `Supabase ${structuredError.type} error:`,
    structuredError.message,
    {
      code: structuredError.code,
      details: structuredError.details,
      context,
    }
  )
}

/**
 * Type guard for PostgrestError
 */
function isPostgrestError(error: any): error is PostgrestError {
  return (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    'message' in error &&
    'details' in error
  )
}

/**
 * Determines the error type based on the error message
 */
function determineErrorType(message: string): SupabaseErrorType {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('auth') || lowerMessage.includes('session') || lowerMessage.includes('token')) {
    return 'auth'
  }
  
  if (lowerMessage.includes('database') || lowerMessage.includes('query') || lowerMessage.includes('sql')) {
    return 'database'
  }
  
  if (lowerMessage.includes('storage') || lowerMessage.includes('bucket') || lowerMessage.includes('file')) {
    return 'storage'
  }
  
  if (lowerMessage.includes('realtime') || lowerMessage.includes('subscription') || lowerMessage.includes('channel')) {
    return 'realtime'
  }
  
  if (lowerMessage.includes('connection') || lowerMessage.includes('network') || lowerMessage.includes('offline')) {
    return 'connection'
  }
  
  return 'unknown'
}

/**
 * Creates a fallback data handler for Supabase operations
 * 
 * @param fallbackData The fallback data to return
 * @param context Optional context information
 * @returns A function that handles errors and returns fallback data
 */
export function withFallback<T>(fallbackData: T, context?: string) {
  return (error: unknown): T => {
    logSupabaseError(error, context)
    return fallbackData
  }
}
