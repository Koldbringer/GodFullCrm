'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  ExternalLink, 
  EyeOff, 
  MoreHorizontal, 
  RefreshCw, 
  Trash2 
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { DynamicLink } from '@/lib/services/dynamic-links-client';

interface DynamicLinksListProps {
  links: DynamicLink[];
}

export function DynamicLinksList({ links: initialLinks }: DynamicLinksListProps) {
  const [links, setLinks] = useState(initialLinks);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const router = useRouter();

  const filteredLinks = links.filter(
    (link) =>
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (link.description && link.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      link.link_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (token: string) => {
    const url = `${window.location.origin}/share/${token}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopiedToken(token);
        toast.success('Link skopiowany do schowka!');
        setTimeout(() => setCopiedToken(null), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        toast.error('Nie udało się skopiować linku');
      });
  };

  const handleDeactivate = async (token: string) => {
    try {
      // Use API endpoint instead of direct function call
      const response = await fetch(`/api/dynamic-links/${token}/deactivate`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to deactivate link');
      }
      
      setLinks(
        links.map((link) =>
          link.token === token ? { ...link, is_active: false } : link
        )
      );
      toast.success('Link został dezaktywowany');
      router.refresh();
    } catch (error) {
      console.error('Error deactivating link:', error);
      toast.error('Wystąpił błąd podczas dezaktywacji linku');
    }
  };

  const getLinkTypeBadge = (type: string) => {
    switch (type) {
      case 'offer':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Oferta</Badge>;
      case 'contract':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">Umowa</Badge>;
      case 'report':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Raport</Badge>;
      case 'invoice':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Faktura</Badge>;
      case 'form':
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-300">Formularz</Badge>;
      case 'service_order':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">Zlecenie</Badge>;
      case 'customer_portal':
        return <Badge variant="outline" className="bg-teal-100 text-teal-800 border-teal-300">Portal klienta</Badge>;
      case 'document':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Dokument</Badge>;
      default:
        return <Badge variant="outline">Niestandardowy</Badge>;
    }
  };

  const getStatusBadge = (link: DynamicLink) => {
    const now = new Date();
    const expiresAt = new Date(link.expires_at);
    const isExpired = now > expiresAt;

    if (!link.is_active) {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800">Nieaktywny</Badge>;
    }

    if (isExpired) {
      return <Badge variant="outline" className="bg-red-100 text-red-800">Wygasł</Badge>;
    }

    return <Badge variant="outline" className="bg-green-100 text-green-800">Aktywny</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Szukaj linków..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" onClick={() => router.refresh()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Odśwież
        </Button>
      </div>

      {filteredLinks.length === 0 ? (
        <div className="text-center p-4 border rounded-md">
          <p className="text-muted-foreground">Nie znaleziono żadnych linków</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tytuł</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Utworzono</TableHead>
                <TableHead>Wygasa</TableHead>
                <TableHead>Wyświetlenia</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLinks.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="font-medium">
                    <div className="max-w-xs truncate">
                      {link.title}
                      {link.description && (
                        <p className="text-xs text-muted-foreground truncate">{link.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getLinkTypeBadge(link.link_type)}</TableCell>
                  <TableCell>{getStatusBadge(link)}</TableCell>
                  <TableCell>{formatRelativeTime(link.created_at)}</TableCell>
                  <TableCell>{formatDate(link.expires_at, { day: '2-digit', month: '2-digit', year: 'numeric' })}</TableCell>
                  <TableCell>{link.access_count}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Otwórz menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => copyToClipboard(link.token)}>
                          <Copy className={`h-4 w-4 mr-2 ${copiedToken === link.token ? 'text-green-500' : ''}`} />
                          Kopiuj link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(`/share/${link.token}`, '_blank')}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Otwórz link
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {link.is_active && (
                          <DropdownMenuItem onClick={() => handleDeactivate(link.token)}>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Dezaktywuj
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Usuń
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}