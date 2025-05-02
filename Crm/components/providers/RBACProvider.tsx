'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthProvider'
import { Permission, Role, UserRole } from '@/types/rbac'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

type RBACContextType = {
  userRoles: UserRole[];
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  hasRole: (roleName: string) => boolean;
  isLoading: boolean;
  error: string | null;
  refreshPermissions: () => Promise<void>;
}

const RBACContext = createContext<RBACContextType>({
  userRoles: [],
  permissions: [],
  hasPermission: () => false,
  hasRole: () => false,
  isLoading: true,
  error: null,
  refreshPermissions: async () => {},
})

export const useRBAC = () => useContext(RBACContext)

export function RBACProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth()
  const [userRoles, setUserRoles] = useState<UserRole[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const fetchUserRoles = async () => {
    if (!user) {
      setUserRoles([])
      setPermissions([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Fetch user roles with their permissions
      const { data, error: rolesError } = await supabase
        .from('user_role_assignments')
        .select(`
          id,
          user_id,
          role_id,
          created_at,
          updated_at,
          user_roles (
            id,
            name,
            description,
            permissions,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id)

      if (rolesError) {
        throw rolesError
      }

      // Transform the data to match our types
      const transformedRoles: UserRole[] = data.map(item => ({
        id: item.id,
        userId: item.user_id,
        roleId: item.role_id,
        role: {
          id: item.user_roles.id,
          name: item.user_roles.name,
          description: item.user_roles.description,
          permissions: item.user_roles.permissions,
          createdAt: item.user_roles.created_at,
          updatedAt: item.user_roles.updated_at
        },
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }))

      setUserRoles(transformedRoles)

      // Extract all unique permissions from the roles
      const allPermissions = transformedRoles.flatMap(role => role.role.permissions)
      const uniquePermissions = [...new Set(allPermissions)] as Permission[]
      setPermissions(uniquePermissions)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user roles'
      setError(errorMessage)
      console.error('RBACProvider: Error fetching user roles:', err)
      toast.error('Failed to load user permissions')
    } finally {
      setIsLoading(false)
    }
  }

  // Check if user has a specific permission
  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission)
  }

  // Check if user has a specific role
  const hasRole = (roleName: string): boolean => {
    return userRoles.some(userRole => userRole.role.name === roleName)
  }

  // Refresh permissions
  const refreshPermissions = async (): Promise<void> => {
    await fetchUserRoles()
  }

  // Fetch roles when user changes
  useEffect(() => {
    if (!authLoading) {
      fetchUserRoles()
    }
  }, [user, authLoading])

  const value = {
    userRoles,
    permissions,
    hasPermission,
    hasRole,
    isLoading,
    error,
    refreshPermissions
  }

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>
}