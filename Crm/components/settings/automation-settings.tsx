'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Bot, Bell, Send, Loader2 } from 'lucide-react';
import { NotificationTemplateForm } from './notification-template-form';
import { NotificationChannelForm } from './notification-channel-form';

// Main component that manages the tabs
export function AutomationSettings() {
  const [activeTab, setActiveTab] = useState<string>('workflows');

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Automatyzacje
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Szablony powiadomień
          </TabsTrigger>
          <TabsTrigger value="channels" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Kanały powiadomień
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <WorkflowSettings />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <NotificationTemplateSettings />
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <NotificationChannelSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Component for managing automation workflows
function WorkflowSettings() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkflows() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/settings/automation?type=automation');
        if (!response.ok) {
          throw new Error('Nie udało się pobrać automatyzacji');
        }
        const data = await response.json();
        setWorkflows(data);
      } catch (error) {
        console.error('Error fetching workflows:', error);
        toast({
          title: 'Błąd',
          description: 'Nie udało się pobrać automatyzacji',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkflows();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Automatyzacje</h3>
        <Button variant="outline" onClick={() => window.location.href = '/automation/editor'}>
          Nowa automatyzacja
        </Button>
      </div>
      <Separator />

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : workflows.length === 0 ? (
        <EmptyState
          title="Brak automatyzacji"
          description="Nie masz jeszcze żadnych automatyzacji. Kliknij przycisk 'Nowa automatyzacja', aby utworzyć pierwszą."
          type="workflow"
          onAction={() => window.location.href = '/automation/editor'}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {workflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      )}
    </div>
  );
}

// Component for displaying a single workflow
function WorkflowCard({ workflow }: { workflow: any }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Czy na pewno chcesz usunąć tę automatyzację?')) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/settings/automation?id=${workflow.id}&type=automation`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Nie udało się usunąć automatyzacji');
      }

      toast({
        title: 'Sukces',
        description: 'Automatyzacja została usunięta',
      });

      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting workflow:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się usunąć automatyzacji',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{workflow.name}</CardTitle>
        <CardDescription className="line-clamp-2">{workflow.description || 'Brak opisu'}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground">
          Utworzono: {new Date(workflow.created_at).toLocaleDateString('pl-PL')}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => window.location.href = `/automation/editor?id=${workflow.id}`}>
          Edytuj
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Usuń
        </Button>
      </CardFooter>
    </Card>
  );
}

// Component for managing notification templates
function NotificationTemplateSettings() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/settings/automation?type=notifications');
        if (!response.ok) {
          throw new Error('Nie udało się pobrać szablonów powiadomień');
        }
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error('Error fetching templates:', error);
        toast({
          title: 'Błąd',
          description: 'Nie udało się pobrać szablonów powiadomień',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  const handleNewTemplate = () => {
    setSelectedTemplate(null);
    setIsFormOpen(true);
  };

  const handleEditTemplate = (template: any) => {
    setSelectedTemplate(template);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Szablony powiadomień</h3>
        <Button variant="outline" onClick={handleNewTemplate}>Nowy szablon</Button>
      </div>
      <Separator />

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : templates.length === 0 ? (
        <EmptyState
          title="Brak szablonów"
          description="Nie masz jeszcze żadnych szablonów powiadomień. Kliknij przycisk 'Nowy szablon', aby utworzyć pierwszy."
          type="template"
          onAction={handleNewTemplate}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={() => handleEditTemplate(template)}
            />
          ))}
        </div>
      )}

      {isFormOpen && (
        <NotificationTemplateForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          initialData={selectedTemplate}
        />
      )}
    </div>
  );
}

// Component for displaying a single notification template
function TemplateCard({ template, onEdit }: { template: any; onEdit: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Czy na pewno chcesz usunąć ten szablon?')) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/settings/automation?id=${template.id}&type=notifications`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Nie udało się usunąć szablonu');
      }

      toast({
        title: 'Sukces',
        description: 'Szablon został usunięty',
      });

      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się usunąć szablonu',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{template.name}</CardTitle>
        <CardDescription className="line-clamp-2">{template.description || 'Brak opisu'}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground">
          Typ: {template.type || 'Ogólny'}
        </div>
        {template.subject && (
          <div className="text-sm text-muted-foreground mt-1">
            Temat: {template.subject}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onEdit}>Edytuj</Button>
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Usuń
        </Button>
      </CardFooter>
    </Card>
  );
}

// Component for managing notification channels
function NotificationChannelSettings() {
  const [channels, setChannels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);

  useEffect(() => {
    async function fetchChannels() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/settings/automation?type=channels');
        if (!response.ok) {
          throw new Error('Nie udało się pobrać kanałów powiadomień');
        }
        const data = await response.json();
        setChannels(data);
      } catch (error) {
        console.error('Error fetching channels:', error);
        toast({
          title: 'Błąd',
          description: 'Nie udało się pobrać kanałów powiadomień',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchChannels();
  }, []);

  const handleNewChannel = () => {
    setSelectedChannel(null);
    setIsFormOpen(true);
  };

  const handleEditChannel = (channel: any) => {
    setSelectedChannel(channel);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedChannel(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Kanały powiadomień</h3>
        <Button variant="outline" onClick={handleNewChannel}>Nowy kanał</Button>
      </div>
      <Separator />

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : channels.length === 0 ? (
        <EmptyState
          title="Brak kanałów"
          description="Nie masz jeszcze żadnych kanałów powiadomień. Kliknij przycisk 'Nowy kanał', aby utworzyć pierwszy."
          type="channel"
          onAction={handleNewChannel}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {channels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onEdit={() => handleEditChannel(channel)}
            />
          ))}
        </div>
      )}

      {isFormOpen && (
        <NotificationChannelForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          initialData={selectedChannel}
        />
      )}
    </div>
  );
}

// Component for displaying a single notification channel
function ChannelCard({ channel, onEdit }: { channel: any; onEdit: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Czy na pewno chcesz usunąć ten kanał?')) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/settings/automation?id=${channel.id}&type=channels`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Nie udało się usunąć kanału');
      }

      toast({
        title: 'Sukces',
        description: 'Kanał został usunięty',
      });

      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting channel:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się usunąć kanału',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Parse config if it's stored as a JSON string
  let config = {};
  if (channel.config && typeof channel.config === 'string') {
    try {
      config = JSON.parse(channel.config);
    } catch (e) {
      console.error('Error parsing channel config:', e);
    }
  } else if (channel.config && typeof channel.config === 'object') {
    config = channel.config;
  }

  // Get status indicator based on is_active
  const getStatusIndicator = () => {
    return channel.is_active ? (
      <span className="flex items-center text-green-500 text-xs">
        <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
        Aktywny
      </span>
    ) : (
      <span className="flex items-center text-gray-400 text-xs">
        <span className="h-2 w-2 rounded-full bg-gray-400 mr-1"></span>
        Nieaktywny
      </span>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{channel.name}</CardTitle>
          {getStatusIndicator()}
        </div>
        <CardDescription className="line-clamp-2">{channel.description || 'Brak opisu'}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground">
          Typ: {channel.type || 'Email'}
        </div>
        {channel.type === 'email' && config && (
          <div className="text-sm text-muted-foreground mt-1">
            SMTP: {(config as any).smtp_host}
          </div>
        )}
        {channel.type === 'webhook' && config && (
          <div className="text-sm text-muted-foreground mt-1 truncate">
            URL: {(config as any).webhook_url}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onEdit}>Edytuj</Button>
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Usuń
        </Button>
      </CardFooter>
    </Card>
  );
}

// Reusable empty state component
function EmptyState({
  title,
  description,
  type,
  onAction
}: {
  title: string;
  description: string;
  type: string;
  onAction?: () => void;
}) {
  return (
    <Card className="flex flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        {type === 'workflow' && <Bot className="h-6 w-6 text-muted-foreground" />}
        {type === 'template' && <Bell className="h-6 w-6 text-muted-foreground" />}
        {type === 'channel' && <Send className="h-6 w-6 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Button variant="outline" onClick={onAction}>
        {type === 'workflow' && 'Nowa automatyzacja'}
        {type === 'template' && 'Nowy szablon'}
        {type === 'channel' && 'Nowy kanał'}
      </Button>
    </Card>
  );
}