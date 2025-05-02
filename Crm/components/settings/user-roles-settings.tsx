'use client';

import React, { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { ColumnDef } from '@tanstack/react-table'; // Zakładam, że używasz TanStack Table

// Definicja typów dla użytkowników i ról (uproszczona)
interface User {
  id: string;
  email: string;
  // Dodaj inne pola użytkownika z Supabase Auth, jeśli potrzebne
}

interface Role {
  id: string;
  role_name: string;
  permissions: any; // Zmień na bardziej szczegółowy typ, jeśli znasz strukturę
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Do edycji uprawnień jako JSON/tekst
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast'; // Zakładam, że używasz useToast
import { Trash2, Edit } from 'lucide-react'; // Ikony do akcji

export function UserRolesSettings() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Partial<Role> | null>(null);
  const { toast } = useToast(); // Inicjalizacja useToast

  // Definicja kolumn dla tabeli ról (przykładowa)
  const roleColumns: ColumnDef<Role>[] = [
    {
      accessorKey: 'role_name',
      header: 'Nazwa Roli',
    },
    {
      accessorKey: 'permissions',
      header: 'Uprawnienia',
      cell: ({ row }) => {
        // Wyświetlanie uprawnień (można sformatować JSON)
        return <pre className="text-xs">{JSON.stringify(row.original.permissions, null, 2)}</pre>;
      },
    },
    {
      id: 'actions',
      header: 'Akcje',
      cell: ({ row }) => {
        const role = row.original;
        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleEditRole(role)}>
              <Edit className="mr-2 h-4 w-4" /> Edytuj
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDeleteRole(role.id)}>
              <Trash2 className="mr-2 h-4 w-4" /> Usuń
            </Button>
          </div>
        );
      },
    },
  ];

  // Definicja kolumn dla tabeli użytkowników (przykładowa)
  const userColumns: ColumnDef<User>[] = [
    {
      accessorKey: 'email',
      header: 'Email',
    },
    // Dodaj więcej kolumn, np. datę utworzenia, ostatnie logowanie itp.
  ];

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      // Pobieranie listy użytkowników z Supabase Auth (wymaga API route lub Edge Function)
      // Na razie placeholder - w przyszłości zaimplementuj dedykowane API dla użytkowników Supabase Auth
      const usersResponse = await fetch('/api/users'); // Przykładowa ścieżka API dla użytkowników Supabase Auth
      const usersData = usersResponse.ok ? await usersResponse.json() : []; // Zakładamy, że zwraca tablicę użytkowników
      setUsers(usersData);

      // Pobieranie listy ról z API backendu
      const rolesResponse = await fetch('/api/settings/users'); // API route dla ról
      if (!rolesResponse.ok) {
        throw new Error(`Błąd pobierania ról: ${rolesResponse.statusText}`);
      }
      const rolesData: Role[] = await rolesResponse.json(); // Zakładamy, że zwraca tablicę ról
      setRoles(rolesData);

    } catch (err: any) {
      setError(err.message);
      console.error('Błąd pobierania danych:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateRole = () => {
    setCurrentRole({}); // Pusty obiekt dla nowego roli
    setIsRoleModalOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setCurrentRole(role); // Ustawienie roli do edycji
    setIsRoleModalOpen(true);
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę rolę?')) {
      return;
    }
    try {
      const response = await fetch(`/api/settings/users?roleId=${roleId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Błąd usuwania roli: ${response.statusText}`);
      }
      toast({ title: 'Sukces', description: 'Rola została usunięta.' });
      fetchData(); // Odświeżenie listy ról
    } catch (err: any) {
      toast({ title: 'Błąd', description: `Nie udało się usunąć roli: ${err.message}`, variant: 'destructive' });
      console.error('Błąd usuwania roli:', err);
    }
  };

  const handleSaveRole = async () => {
    if (!currentRole || !currentRole.role_name) {
      toast({ title: 'Błąd', description: 'Nazwa roli jest wymagana.', variant: 'destructive' });
      return;
    }

    try {
      const method = currentRole.id ? 'PUT' : 'POST';
      const url = '/api/settings/users'; // To samo API route dla POST i PUT ról

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentRole),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || response.statusText);
      }

      toast({ title: 'Sukces', description: 'Rola została zapisana.' });
      setIsRoleModalOpen(false);
      fetchData(); // Odświeżenie listy ról
    } catch (err: any) {
      toast({ title: 'Błąd', description: `Nie udało się zapisać roli: ${err.message}`, variant: 'destructive' });
      console.error('Błąd zapisywania roli:', err);
    }
  };

  if (loading) {
    return <div>Ładowanie ustawień użytkowników i ról...</div>;
  }

  if (error) {
    return <div className="text-red-500">Błąd: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium">Użytkownicy</h4>
        <p className="text-sm text-muted-foreground">
          Lista użytkowników zarejestrowanych w systemie.
        </p>
        <div className="mt-4">
           {/* Komponent DataTable do wyświetlania listy użytkowników */}
           {/* Wymaga implementacji komponentu DataTable i dostosowania kolumn */}
           {/* <DataTable columns={userColumns} data={users} /> */}
           <p>Tabela użytkowników w budowie...</p>
        </div>
      </div>

      <Separator />

      <div>
        <div className="flex justify-between items-center">
           <h4 className="text-lg font-medium">Role</h4>
           <Button size="sm" onClick={handleCreateRole}>Dodaj nową rolę</Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Zarządzaj definicjami ról i ich uprawnieniami.
        </p>
         <div className="mt-4">
           {/* Komponent DataTable do wyświetlania listy ról */}
           {/* Wymaga implementacji komponentu DataTable i dostosowania kolumn */}
           {/* <DataTable columns={roleColumns} data={roles} /> */}
            <p>Tabela ról w budowie...</p>
         </div>
      </div>

      {/* Modal do tworzenia/edycji ról */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentRole?.id ? 'Edytuj rolę' : 'Dodaj nową rolę'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roleName" className="text-right">
                Nazwa Roli
              </Label>
              <Input
                id="roleName"
                value={currentRole?.role_name || ''}
                onChange={(e) => setCurrentRole({ ...currentRole, role_name: e.target.value })}
                className="col-span-3"
              />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="permissions" className="text-right">
                Uprawnienia (JSON)
              </Label>
              <Textarea
                id="permissions"
                 value={currentRole?.permissions ? JSON.stringify(currentRole.permissions, null, 2) : ''}
                 onChange={(e) => {
                   try {
                     setCurrentRole({ ...currentRole, permissions: JSON.parse(e.target.value) });
                   } catch (error) {
                     // Obsłuż błąd parsowania JSON, np. wyświetl komunikat
                     console.error("Nieprawidłowy format JSON:", error);
                   }
                 }}
                className="col-span-3"
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleModalOpen(false)}>Anuluj</Button>
            <Button onClick={handleSaveRole}>Zapisz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tutaj dodaj interfejs do przypisywania ról użytkownikom i zarządzania logami */}
    </div>
  );
}