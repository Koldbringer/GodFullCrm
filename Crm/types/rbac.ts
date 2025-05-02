// types/rbac.ts
// Type definitions for Role-Based Access Control

export type Permission = 
  | 'customers:read'
  | 'customers:write'
  | 'customers:delete'
  | 'service_orders:read'
  | 'service_orders:write'
  | 'service_orders:delete'
  | 'devices:read'
  | 'devices:write'
  | 'devices:delete'
  | 'sites:read'
  | 'sites:write'
  | 'sites:delete'
  | 'inventory:read'
  | 'inventory:write'
  | 'inventory:delete'
  | 'technicians:read'
  | 'technicians:write'
  | 'technicians:delete'
  | 'reports:read'
  | 'reports:write'
  | 'admin:access'
  | 'settings:read'
  | 'settings:write';

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

// Predefined roles
export const PREDEFINED_ROLES: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'admin',
    description: 'Full system access',
    permissions: [
      'customers:read', 'customers:write', 'customers:delete',
      'service_orders:read', 'service_orders:write', 'service_orders:delete',
      'devices:read', 'devices:write', 'devices:delete',
      'sites:read', 'sites:write', 'sites:delete',
      'inventory:read', 'inventory:write', 'inventory:delete',
      'technicians:read', 'technicians:write', 'technicians:delete',
      'reports:read', 'reports:write',
      'admin:access',
      'settings:read', 'settings:write'
    ]
  },
  {
    name: 'manager',
    description: 'Manage operations but cannot delete records or access admin settings',
    permissions: [
      'customers:read', 'customers:write',
      'service_orders:read', 'service_orders:write',
      'devices:read', 'devices:write',
      'sites:read', 'sites:write',
      'inventory:read', 'inventory:write',
      'technicians:read', 'technicians:write',
      'reports:read', 'reports:write',
      'settings:read'
    ]
  },
  {
    name: 'technician',
    description: 'Field technician with limited access',
    permissions: [
      'customers:read',
      'service_orders:read', 'service_orders:write',
      'devices:read',
      'sites:read',
      'inventory:read'
    ]
  },
  {
    name: 'office',
    description: 'Office staff for customer management and scheduling',
    permissions: [
      'customers:read', 'customers:write',
      'service_orders:read', 'service_orders:write',
      'devices:read',
      'sites:read', 'sites:write',
      'technicians:read',
      'reports:read'
    ]
  },
  {
    name: 'readonly',
    description: 'Read-only access to all data',
    permissions: [
      'customers:read',
      'service_orders:read',
      'devices:read',
      'sites:read',
      'inventory:read',
      'technicians:read',
      'reports:read',
      'settings:read'
    ]
  }
];