'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRBAC } from '@/components/providers/RBACProvider'
import { Role } from '@/types/rbac'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/ui/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Check, Search, Shield, User, UserCog, X } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface User {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  user_metadata: {
    name?: string
    full_name?: string
  }
}

interface UserRole {
  id: string
  user_id: string
  role_id: string
  created_at: string
  updated_at: string
  user_roles: Role
}

export default function UsersPage() {
  const { hasPermission, isLoading: rbacLoading } = useRBAC()
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [userRoles, setUserRoles] = useState<Record<string, UserRole[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>('')

  const supabase = createClient()

  // Fetch users
  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const { data: { users }, error } = await supabase.auth.admin.listUsers()

      if (error) {
        throw error
      }

      setUsers(users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('name')

      if (error) {
        throw error
      }

      // Transform data to match our Role type
      const transformedRoles: Role[] = data.map(role => ({
        id: role.id,
        name: role.name,
        description: role.description || '',
        permissions: role.permissions || [],
        createdAt: role.created_at,
        updatedAt: role.updated_at
      }))

      setRoles(transformedRoles)
    } catch (error) {
      console.error('Error fetching roles:', error)
      toast.error('Failed to load roles')
    }
  }

  // Fetch user roles
  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
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

      if (error) {
        throw error
      }

      // Group by user_id
      const rolesByUser: Record<string, UserRole[]> = {}
      data.forEach(role => {
        if (!rolesByUser[role.user_id]) {
          rolesByUser[role.user_id] = []
        }
        rolesByUser[role.user_id].push(role as UserRole)
      })

      setUserRoles(rolesByUser)
    } catch (error) {
      console.error('Error fetching user roles:', error)
      toast.error('Failed to load user roles')
    }
  }

  // Assign role to user
  const assignRoleToUser = async () => {
    if (!selectedUser || !selectedRole) {
      toast.error('Please select a role')
      return
    }

    try {
      // Check if user already has this role
      const existingRoles = userRoles[selectedUser.id] || []
      if (existingRoles.some(r => r.role_id === selectedRole)) {
        toast.error('User already has this role')
        return
      }

      const { data, error } = await supabase
        .from('user_role_assignments')
        .insert({
          user_id: selectedUser.id,
          role_id: selectedRole
        })
        .select()

      if (error) {
        throw error
      }

      toast.success('Role assigned successfully')
      fetchUserRoles()
      setShowRoleDialog(false)
      setSelectedRole('')
    } catch (error) {
      console.error('Error assigning role:', error)
      toast.error('Failed to assign role')
    }
  }

  // Remove role from user
  const removeRoleFromUser = async (userId: string, roleAssignmentId: string) => {
    try {
      const { error } = await supabase
        .from('user_role_assignments')
        .delete()
        .eq('id', roleAssignmentId)

      if (error) {
        throw error
      }

      toast.success('Role removed successfully')
      fetchUserRoles()
    } catch (error) {
      console.error('Error removing role:', error)
      toast.error('Failed to remove role')
    }
  }

  // Filter users by search query
  const filteredUsers = users.filter(user => {
    const email = user.email?.toLowerCase() || ''
    const name = user.user_metadata?.name?.toLowerCase() || user.user_metadata?.full_name?.toLowerCase() || ''
    const query = searchQuery.toLowerCase()
    
    return email.includes(query) || name.includes(query)
  })

  // Get user display name
  const getUserDisplayName = (user: User) => {
    return user.user_metadata?.name || user.user_metadata?.full_name || user.email
  }

  // Initialize
  useEffect(() => {
    if (!rbacLoading) {
      fetchUsers()
      fetchRoles()
      fetchUserRoles()
    }
  }, [rbacLoading])

  // Check if user has permission to access this page
  if (!rbacLoading && !hasPermission('admin:access')) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access this page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="User Management"
        description="Manage users and their roles"
        icon={<UserCog className="h-6 w-6" />}
      />

      <Card className="mt-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage system users and their roles</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Sign In</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {getUserDisplayName(user)}
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {userRoles[user.id]?.map((userRole) => (
                              <Badge 
                                key={userRole.id} 
                                variant="outline"
                                className="flex items-center gap-1 pr-1"
                              >
                                <Shield className="h-3 w-3 mr-1" />
                                {userRole.user_roles.name}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 rounded-full"
                                  onClick={() => removeRoleFromUser(user.id, userRole.id)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                            {(!userRoles[user.id] || userRoles[user.id].length === 0) && (
                              <span className="text-muted-foreground text-sm">No roles</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {user.last_sign_in_at 
                            ? new Date(user.last_sign_in_at).toLocaleDateString() 
                            : 'Never'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setShowRoleDialog(true)
                            }}
                          >
                            Assign Role
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Assign Role Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role to User</DialogTitle>
            <DialogDescription>
              {selectedUser && `Assign a role to ${getUserDisplayName(selectedUser)}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role">Select Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={assignRoleToUser}>
              <Check className="mr-2 h-4 w-4" />
              Assign Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}