"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Copy, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { toast } from "sonner";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Offer = {
  id: string;
  title: string;
  status: string;
  created_at: string;
  valid_until: string;
  token: string;
  customers: {
    name: string;
  };
};

export default function OffersList() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [mdxOffers, setMdxOffers] = useState<string[]>([]);

  useEffect(() => {
    const fetchOffers = async () => {
      setIsLoading(true);
      try {
        const supabase = createClient();

        // Fetch offers from Supabase with customer data
        const { data, error } = await supabase
          .from('offers')
          .select(`
            id,
            title,
            status,
            created_at,
            valid_until,
            token,
            customers (
              id,
              name
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setOffers(data || []);

        // Fetch MDX offers from Supabase storage
        const { data: mdxData, error: mdxError } = await supabase
          .storage
          .from('offer-templates')
          .list('', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (mdxError) {
          console.error("Error fetching MDX offers:", mdxError);
          // Continue anyway - this is not critical
        } else {
          // Filter only MDX files
          const mdxFiles = mdxData
            ?.filter(file => file.name.endsWith('.mdx'))
            .map(file => file.name) || [];

          setMdxOffers(mdxFiles);
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
        toast.error("Nie udało się pobrać listy ofert");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const filteredOffers = offers.filter(
    (offer) =>
      offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.token?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (token: string) => {
    const url = `${window.location.origin}/offers/${token}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopiedToken(token);
        toast.success("Link skopiowany do schowka!");
        setTimeout(() => setCopiedToken(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast.error("Nie udało się skopiować linku");
      });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Oczekująca</Badge>;
      case "approved":
        return <Badge className="bg-green-600">Zatwierdzona</Badge>;
      case "rejected":
        return <Badge variant="destructive">Odrzucona</Badge>;
      case "expired":
        return <Badge variant="secondary">Wygasła</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy", { locale: pl });
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Ładowanie ofert...</span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista ofert</CardTitle>
        <CardDescription>Przeglądaj i zarządzaj ofertami dla klientów</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Szukaj ofert..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="database">
          <TabsList className="mb-4">
            <TabsTrigger value="database">Oferty w bazie danych</TabsTrigger>
            <TabsTrigger value="mdx">Oferty MDX</TabsTrigger>
          </TabsList>

          <TabsContent value="database">
            {filteredOffers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "Nie znaleziono ofert pasujących do wyszukiwania" : "Brak ofert w bazie danych"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tytuł</TableHead>
                      <TableHead>Klient</TableHead>
                      <TableHead>Data utworzenia</TableHead>
                      <TableHead>Ważna do</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOffers.map((offer) => (
                      <TableRow key={offer.id}>
                        <TableCell className="font-medium">{offer.title}</TableCell>
                        <TableCell>{offer.customers?.name}</TableCell>
                        <TableCell>{formatDate(offer.created_at)}</TableCell>
                        <TableCell>{formatDate(offer.valid_until)}</TableCell>
                        <TableCell>{getStatusBadge(offer.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => copyToClipboard(offer.token)}
                              title="Kopiuj link"
                            >
                              <Copy
                                className={`h-4 w-4 ${
                                  copiedToken === offer.token ? "text-green-500" : ""
                                }`}
                              />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              asChild
                              title="Otwórz ofertę"
                            >
                              <Link href={`/offers/${offer.token}`} target="_blank">
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="mdx">
            <div className="bg-white dark:bg-neutral-900 rounded p-4">
              <h2 className="text-lg font-bold mb-2">Lista wygenerowanych ofert MDX</h2>
              {mdxOffers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  Brak wygenerowanych ofert MDX
                </div>
              ) : (
                <ul className="list-disc pl-6">
                  {mdxOffers.map(file => (
                    <li key={file} className="mb-2">
                      <a
                        className="text-blue-700 hover:underline dark:text-blue-300"
                        href={`/docs/${file.replace(/\.mdx$/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {file.replace(/_/g, ' ').replace(/\.mdx$/, '')}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
