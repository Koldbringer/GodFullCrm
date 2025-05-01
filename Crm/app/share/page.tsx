import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { DynamicLinkGenerator } from '@/components/share/dynamic-link-generator';
import { DynamicLinksList } from '@/components/share/dynamic-links-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function SharePage() {
  const supabase = createClient(cookies());
  
  // Fetch all dynamic links
  const { data: links, error } = await supabase
    .from('dynamic_links')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching dynamic links:', error);
  }
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Zarządzanie linkami</h1>
      
      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator">Generator linków</TabsTrigger>
          <TabsTrigger value="manage">Zarządzanie linkami</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="space-y-4">
          <DynamicLinkGenerator />
        </TabsContent>
        
        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wszystkie linki</CardTitle>
              <CardDescription>
                Zarządzaj wszystkimi wygenerowanymi linkami
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DynamicLinksList links={links || []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
