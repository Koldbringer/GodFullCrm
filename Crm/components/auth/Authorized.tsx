'use client'

import { ReactNode } from 'react'
import { useRBAC } from '@/components/providers/RBACProvider'
import { Permission } from '@/types/rbac'

interface AuthorizedProps {
  /**
   * The permission required to render the children
   */
  permission?: Permission
  /**
   * The role required to render the children
   */
  role?: string
  /**
   * Content to render when authorized
   */
  children: ReactNode
  /**
   * Optional content to render when not authorized
   */
  fallback?: ReactNode
}

/**
 * Component that conditionally renders its children based on user permissions or roles
 * 
 * @example
 * // Only render if user has 'customers:read' permission
 * <Authorized permission="customers:read">
 *   <CustomerList />
 * </Authorized>
 * 
 * @example
 * // Only render if user has 'admin' role
 * <Authorized role="admin">
 *   <AdminPanel />
 * </Authorized>
 * 
 * @example
 * // With fallback content
 * <Authorized permission="reports:write" fallback={<ReadOnlyReport />}>
 *   <EditableReport />
 * </Authorized>
 */
export function Authorized({ permission, role, children, fallback = null }: AuthorizedProps) {
  const { hasPermission, hasRole, isLoading } = useRBAC()

  // While loading, don't render anything to prevent flashing content
  if (isLoading) {
    return null
  }

  // Check if user has the required permission or role
  const isAuthorized = 
    (permission && hasPermission(permission)) || 
    (role && hasRole(role)) ||
    (!permission && !role) // If no permission or role specified, authorize by default

  // Render children if authorized, otherwise render fallback
  return isAuthorized ? <>{children}</> : <>{fallback}</>
}