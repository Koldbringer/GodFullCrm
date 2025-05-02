'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRBAC } from '@/components/providers/RBACProvider'
import { PREDEFINED_ROLES, Permission, Role } from '@/types/rbac'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader } from '@/components/ui/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Plus, Save, Trash2, UserCog } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function RolesPage() {
  const { hasPermission, isLoading: rbacLoading } = useRBAC()
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [editedRole, setEditedRole] = useState<Partial<Role>>({})
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newRole, setNewRole] = useState<Omit<Role, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    permissions: []
  })

  const supabase = createClient()

  // Group permissions by category
  const permissionCategories = {
    customers: ['customers:read', 'customers:write', 'customers:delete'],
    service_orders: ['service_orders:read', 'service_orders:write', 'service_orders:delete'],
    devices: ['devices:read', 'devices:write', 'devices:delete'],
    sites: ['sites:read', 'sites:write', 'sites:delete'],
    inventory: ['inventory:read', 'inventory:write', 'inventory:delete'],
    technicians: ['technicians:read', 'technicians:write', 'technicians:delete'],
    reports: ['reports:read', 'reports:write'],
    admin: ['admin:access'],
    settings: ['settings:read', 'settings:write']
  }

  // Fetch roles
  const fetchRoles = async () => {
    try {
      setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  }

  // Save role
  const saveRole = async () => {
    if (!selectedRole) return

    try {
      const { error } = await supabase
        .from('user_roles')
        .update({
          name: editedRole.name,
          description: editedRole.description,
          permissions: editedRole.permissions,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedRole.id)

      if (error) {
        throw error
      }

      toast.success('Role updated successfully')
      fetchRoles()
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating role:', error)
      toast.error('Failed to update role')
    }
  }

  // Create new role
  const createRole = async () => {
    try {
      if (!newRole.name) {
        toast.error('Role name is required')
        return
      }

      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          name: newRole.name,
          description: newRole.description,
          permissions: newRole.permissions
        })
        .select()

      if (error) {
        throw error
      }

      toast.success('Role created successfully')
      fetchRoles()
      setShowCreateDialog(false)
      setNewRole({
        name: '',
        description: '',
        permissions: []
      })
    } catch (error) {
      console.error('Error creating role:', error)
      toast.error('Failed to create role')
    }
  }

  // Delete role
  const deleteRole = async (roleId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId)

      if (error) {
        throw error
      }

      toast.success('Role deleted successfully')
      fetchRoles()
      setSelectedRole(null)
    } catch (error) {
      console.error('Error deleting role:', error)
      toast.error('Failed to delete role')
    }
  }

  // Create predefined roles
  const createPredefinedRoles = async () => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert(PREDEFINED_ROLES)

      if (error) {
        throw error
      }

      toast.success('Predefined roles created successfully')
      fetchRoles()
    } catch (error) {
      console.error('Error creating predefined roles:', error)
      toast.error('Failed to create predefined roles')
    }
  }

  // Toggle permission in edited role
  const togglePermission = (permission: Permission) => {
    if (!editedRole.permissions) return

    const newPermissions = [...editedRole.permissions]
    const index = newPermissions.indexOf(permission)

    if (index === -1) {
      newPermissions.push(permission)
    } else {
      newPermissions.splice(index, 1)
    }

    setEditedRole({
      ...editedRole,
      permissions: newPermissions
    })
  }

  // Toggle permission in new role
  const toggleNewRolePermission = (permission: Permission) => {
    const newPermissions = [...newRole.permissions]
    const index = newPermissions.indexOf(permission)

    if (index === -1) {
      newPermissions.push(permission)
    } else {
      newPermissions.splice(index, 1)
    }

    setNewRole({
      ...newRole,
      permissions: newPermissions
    })
  }

  // Select a role for editing
  const selectRole = (role: Role) => {
    setSelectedRole(role)
    setEditedRole({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions]
    })
    setIsEditing(false)
  }

  // Initialize
  useEffect(() => {
    if (!rbacLoading) {
      fetchRoles()
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
        title="Role Management"
        description="Manage user roles and permissions"
        icon={<UserCog className="h-6 w-6" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Roles List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>Manage system roles</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {roles.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No roles found</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={createPredefinedRoles}
                    >
                      Create Predefined Roles
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {roles.map((role) => (
                      <Button
                        key={role.id}
                        variant={selectedRole?.id === role.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => selectRole(role)}
                      >
                        {role.name}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Role
            </Button>
          </CardFooter>
        </Card>

        {/* Role Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedRole ? (isEditing ? 'Edit Role' : 'Role Details') : 'Select a Role'}
            </CardTitle>
            <CardDescription>
              {selectedRole 
                ? `Viewing details for ${selectedRole.name} role` 
                : 'Select a role from the list to view details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedRole ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editedRole.name || ''}
                    onChange={(e) => setEditedRole({ ...editedRole, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editedRole.description || ''}
                    onChange={(e) => setEditedRole({ ...editedRole, description: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <ScrollArea className="h-[300px] rounded-md border p-4">
                    <div className="space-y-6">
                      {Object.entries(permissionCategories).map(([category, perms]) => (
                        <div key={category} className="space-y-2">
                          <h3 className="text-sm font-medium capitalize">{category.replace('_', ' ')}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {perms.map((perm) => (
                              <div key={perm} className="flex items-center space-x-2">
                                <Checkbox
                                  id={perm}
                                  checked={editedRole.permissions?.includes(perm as Permission)}
                                  onCheckedChange={() => togglePermission(perm as Permission)}
                                  disabled={!isEditing}
                                />
                                <Label htmlFor={perm} className="text-sm">
                                  {perm.split(':')[1]}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Select a role to view details</p>
              </div>
            )}
          </CardContent>
          {selectedRole && (
            <CardFooter className="flex justify-between">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveRole}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="destructive" 
                    onClick={() => deleteRole(selectedRole.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Role
                  </Button>
                </>
              )}
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Create Role Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Define a new role with specific permissions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Role Name</Label>
                <Input
                  id="new-name"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  placeholder="e.g., Support Staff"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-description">Description</Label>
                <Input
                  id="new-description"
                  value={newRole.description || ''}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  placeholder="Brief description of this role"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Permissions</Label>
              <ScrollArea className="h-[300px] rounded-md border p-4">
                <div className="space-y-6">
                  {Object.entries(permissionCategories).map(([category, perms]) => (
                    <div key={category} className="space-y-2">
                      <h3 className="text-sm font-medium capitalize">{category.replace('_', ' ')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {perms.map((perm) => (
                          <div key={perm} className="flex items-center space-x-2">
                            <Checkbox
                              id={`new-${perm}`}
                              checked={newRole.permissions.includes(perm as Permission)}
                              onCheckedChange={() => toggleNewRolePermission(perm as Permission)}
                            />
                            <Label htmlFor={`new-${perm}`} className="text-sm">
                              {perm.split(':')[1]}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createRole}>
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}