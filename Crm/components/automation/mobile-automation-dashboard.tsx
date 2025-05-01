"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { 
  AlertTriangle, 
  BarChart3, 
  Bot, 
  Check, 
  CheckCircle, 
  ChevronRight, 
  Clock, 
  Edit, 
  FileText, 
  Play, 
  Plus, 
  RefreshCw, 
  Settings, 
  Sparkles, 
  XCircle 
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type WorkflowExecution = {
  execution_id: string;
  workflow_id: string;
  status: 'started' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  error_message?: string;
};

type Workflow = {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  last_execution?: WorkflowExecution;
  execution_count?: number;
  success_rate?: number;
};

type AutomationNotification = {
  id: string;
  workflow_id: string;
  workflow_name: string;
  execution_id: string;
  message: string;
  status: 'info' | 'success' | 'warning' | 'error';
  created_at: string;
  read: boolean;
};

export function MobileAutomationDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('workflows');
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [recentExecutions, setRecentExecutions] = useState<WorkflowExecution[]>([]);
  const [notifications, setNotifications] = useState<AutomationNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setIsRefreshing(true);
    
    try {
      // Fetch workflows
      const workflowsResponse = await fetch('/api/automation/workflows');
      if (!workflowsResponse.ok) {
        throw new Error('Failed to fetch workflows');
      }
      const workflowsData = await workflowsResponse.json();
      
      // Fetch recent executions
      const executionsResponse = await fetch('/api/automation/workflows/executions?limit=10');
      if (!executionsResponse.ok) {
        throw new Error('Failed to fetch executions');
      }
      const executionsData = await executionsResponse.json();
      setRecentExecutions(executionsData);
      
      // Fetch notifications
      const notificationsResponse = await fetch('/api/automation/notifications?limit=10');
      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json();
        setNotifications(notificationsData);
      }
      
      // Enhance workflows with execution data
      const enhancedWorkflows = await Promise.all(
        workflowsData.map(async (workflow: Workflow) => {
          // Get the latest execution for this workflow
          const workflowExecutions = executionsData.filter(
            (execution: WorkflowExecution) => execution.workflow_id === workflow.id
          );
          
          const lastExecution = workflowExecutions[0];
          const executionCount = workflowExecutions.length;
          const successCount = workflowExecutions.filter(
            (execution: WorkflowExecution) => execution.status === 'completed'
          ).length;
          const successRate = executionCount > 0 ? (successCount / executionCount) * 100 : 0;
          
          return {
            ...workflow,
            last_execution: lastExecution,
            execution_count: executionCount,
            success_rate: successRate,
          };
        })
      );
      
      setWorkflows(enhancedWorkflows);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load automation data');
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const handleRunWorkflow = async (workflowId: string) => {
    try {
      const response = await fetch('/api/automation/workflows/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workflowId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to execute workflow');
      }
      
      const result = await response.json();
      
      toast({
        title: 'Workflow Executed',
        description: `Execution ID: ${result.executionId}`,
      });
      
      // Refresh the data
      setTimeout(() => fetchData(), 1000);
    } catch (error) {
      console.error('Error executing workflow:', error);
      toast({
        title: 'Error',
        description: 'Failed to execute workflow',
        variant: 'destructive',
      });
    }
  };
  
  const markNotificationAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/automation/notifications?id=${id}`, {
        method: 'PATCH',
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      // Update the local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Zakończony</Badge>;
      case 'failed':
        return <Badge variant="destructive">Błąd</Badge>;
      case 'started':
        return <Badge className="bg-blue-500">Uruchomiony</Badge>;
      default:
        return <Badge variant="outline">Nieznany</Badge>;
    }
  };
  
  const getNotificationIcon = (status: string) => {
    switch (status) {
      case 'info':
        return <Bot className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bot className="h-4 w-4 text-blue-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const calculateExecutionTime = (execution: WorkflowExecution) => {
    if (!execution.completed_at || !execution.started_at) return 'N/A';
    
    const startTime = new Date(execution.started_at).getTime();
    const endTime = new Date(execution.completed_at).getTime();
    const durationMs = endTime - startTime;
    
    if (durationMs < 1000) {
      return `${durationMs}ms`;
    } else if (durationMs < 60000) {
      return `${(durationMs / 1000).toFixed(2)}s`;
    } else {
      return `${(durationMs / 60000).toFixed(2)}min`;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="workflows">
              Przepływy
            </TabsTrigger>
            <TabsTrigger value="executions">
              Wykonania
            </TabsTrigger>
            <TabsTrigger value="notifications">
              Powiadomienia
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchData}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Odśwież
        </Button>
        
        <Button size="sm" asChild>
          <Link href="/automation/templates">
            <Plus className="h-4 w-4 mr-2" />
            Nowy przepływ
          </Link>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <AlertTriangle className="h-6 w-6 text-destructive mr-2" />
            <p>{error}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <TabsContent value="workflows" className="mt-0 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Przepływy automatyzacji</h2>
              <Badge variant="outline">
                {workflows.filter(w => w.is_active).length} aktywnych
              </Badge>
            </div>
            
            {workflows.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Bot className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Brak przepływów automatyzacji</p>
                  <Button asChild>
                    <Link href="/automation/templates">
                      Utwórz przepływ
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {workflows.map((workflow) => (
                  <AccordionItem key={workflow.id} value={workflow.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${workflow.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span>{workflow.name}</span>
                        </div>
                        <Badge variant={workflow.is_active ? 'default' : 'outline'} className="ml-auto mr-2">
                          {workflow.is_active ? 'Aktywny' : 'Nieaktywny'}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        {workflow.description && (
                          <p className="text-sm text-muted-foreground">{workflow.description}</p>
                        )}
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-muted/50 p-2 rounded">
                            <div className="text-muted-foreground">Wykonania</div>
                            <div className="font-medium">{workflow.execution_count || 0}</div>
                          </div>
                          <div className="bg-muted/50 p-2 rounded">
                            <div className="text-muted-foreground">Skuteczność</div>
                            <div className="font-medium">{Math.round(workflow.success_rate || 0)}%</div>
                          </div>
                          <div className="bg-muted/50 p-2 rounded">
                            <div className="text-muted-foreground">Utworzony</div>
                            <div className="font-medium">{formatDate(workflow.created_at).split(',')[0]}</div>
                          </div>
                          <div className="bg-muted/50 p-2 rounded">
                            <div className="text-muted-foreground">Ostatnie wykonanie</div>
                            <div className="font-medium">
                              {workflow.last_execution 
                                ? formatDate(workflow.last_execution.started_at).split(',')[0]
                                : 'Brak'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => router.push(`/automation?id=${workflow.id}`)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edytuj
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleRunWorkflow(workflow.id)}
                            disabled={!workflow.is_active}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Uruchom
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </TabsContent>
          
          <TabsContent value="executions" className="mt-0 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Historia wykonań</h2>
              <Badge variant="outline">
                {recentExecutions.length} wykonań
              </Badge>
            </div>
            
            {recentExecutions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Brak historii wykonań</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentExecutions.map(execution => {
                  const workflow = workflows.find(w => w.id === execution.workflow_id);
                  return (
                    <Card key={execution.execution_id} className="overflow-hidden">
                      <CardHeader className="p-3 pb-0">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{workflow?.name || 'Nieznany przepływ'}</CardTitle>
                          {getStatusBadge(execution.status)}
                        </div>
                        <CardDescription className="text-xs">
                          ID: {execution.execution_id.substring(0, 12)}...
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-3 pt-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Start:</span>{' '}
                            {formatDate(execution.started_at)}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Czas wykonania:</span>{' '}
                            {calculateExecutionTime(execution)}
                          </div>
                        </div>
                        
                        {execution.status === 'failed' && execution.error_message && (
                          <div className="mt-2 text-xs text-destructive">
                            <span className="font-medium">Błąd:</span> {execution.error_message}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="p-3 pt-0">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-xs"
                          asChild
                        >
                          <Link href={`/automation/monitor?executionId=${execution.execution_id}`}>
                            Szczegóły wykonania
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-0 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Powiadomienia</h2>
              <Badge variant="outline">
                {notifications.filter(n => !n.read).length} nieprzeczytanych
              </Badge>
            </div>
            
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Bot className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Brak powiadomień</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {notifications.map(notification => (
                  <Card 
                    key={notification.id} 
                    className={`overflow-hidden ${!notification.read ? 'border-primary/50' : ''}`}
                  >
                    <CardHeader className="p-3 pb-0">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          {getNotificationIcon(notification.status)}
                          <CardTitle className="text-base ml-2">{notification.workflow_name}</CardTitle>
                        </div>
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <CardDescription className="text-xs">
                        {formatDate(notification.created_at)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 pt-2">
                      <p className="text-sm">{notification.message}</p>
                    </CardContent>
                    {notification.execution_id && (
                      <CardFooter className="p-3 pt-0">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-xs"
                          asChild
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <Link href={`/automation/monitor?executionId=${notification.execution_id}`}>
                            Szczegóły wykonania
                          </Link>
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </>
      )}
      
      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        <Button 
          size="icon" 
          className="rounded-full h-12 w-12 shadow-lg"
          asChild
        >
          <Link href="/automation/templates">
            <Plus className="h-6 w-6" />
          </Link>
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full h-12 w-12 shadow-lg bg-background"
          asChild
        >
          <Link href="/automation/dashboard">
            <BarChart3 className="h-6 w-6" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
