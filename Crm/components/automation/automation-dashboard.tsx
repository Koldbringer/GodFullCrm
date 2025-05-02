"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { 
  BarChart3, 
  Bot, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Cog, 
  Edit, 
  LineChart, 
  Play, 
  Plus, 
  RefreshCw, 
  Sparkles, 
  Zap, 
  XCircle,
  AlertTriangle
} from 'lucide-react';

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

type AiAnalysis = {
  id: string;
  prompt: string;
  created_at: string;
  workflow_execution_id?: string;
};

export function AutomationDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [recentExecutions, setRecentExecutions] = useState<WorkflowExecution[]>([]);
  const [aiAnalyses, setAiAnalyses] = useState<AiAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
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
      
      // Fetch AI analyses
      const aiAnalysesResponse = await fetch('/api/ai/analyze/logs?limit=5');
      let aiAnalysesData = [];
      if (aiAnalysesResponse.ok) {
        aiAnalysesData = await aiAnalysesResponse.json();
      }
      setAiAnalyses(aiAnalysesData);
      
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
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load automation dashboard data');
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
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
      
      // Refresh the dashboard data
      setTimeout(() => fetchDashboardData(), 1000);
    } catch (error) {
      console.error('Error executing workflow:', error);
      toast({
        title: 'Error',
        description: 'Failed to execute workflow',
        variant: 'destructive',
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'started':
        return <Badge className="bg-blue-500">Running</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Workflows
            </TabsTrigger>
            <TabsTrigger value="executions" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Executions
            </TabsTrigger>
            <TabsTrigger value="ai-insights" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Insights
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchDashboardData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button size="sm" asChild>
            <Link href="/automation">
              <Plus className="h-4 w-4 mr-2" />
              New Workflow
            </Link>
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <AlertTriangle className="h-6 w-6 text-destructive mr-2" />
            <p>{error}</p>
          </CardContent>
        </Card>
      ) : (
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Bot className="h-5 w-5 text-primary mr-2" />
                  <div className="text-2xl font-bold">{workflows.length}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {workflows.filter(w => w.is_active).length} active
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Play className="h-5 w-5 text-primary mr-2" />
                  <div className="text-2xl font-bold">
                    {workflows.reduce((sum, w) => sum + (w.execution_count || 0), 0)}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last 24 hours: {recentExecutions.filter(e => 
                    new Date(e.started_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                  ).length}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <div className="text-2xl font-bold">
                    {workflows.length > 0 
                      ? Math.round(
                          workflows.reduce((sum, w) => sum + (w.success_rate || 0), 0) / workflows.length
                        )
                      : 0}%
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {recentExecutions.filter(e => e.status === 'completed').length} successful executions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">AI Analyses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
                  <div className="text-2xl font-bold">{aiAnalyses.length}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last analysis: {aiAnalyses.length > 0 
                    ? formatDate(aiAnalyses[0].created_at).split(',')[0]
                    : 'None'}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Workflow Executions</CardTitle>
                <CardDescription>
                  Last {recentExecutions.length} workflow executions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentExecutions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No executions found
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recentExecutions.slice(0, 5).map(execution => {
                      const workflow = workflows.find(w => w.id === execution.workflow_id);
                      return (
                        <div key={execution.execution_id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{workflow?.name || 'Unknown Workflow'}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(execution.started_at)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-xs">
                              {calculateExecutionTime(execution)}
                            </div>
                            {getStatusBadge(execution.status)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/automation/monitor">
                    View All Executions
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Active Workflows</CardTitle>
                <CardDescription>
                  Currently active automation workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                {workflows.filter(w => w.is_active).length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No active workflows found
                  </p>
                ) : (
                  <div className="space-y-4">
                    {workflows
                      .filter(w => w.is_active)
                      .slice(0, 5)
                      .map(workflow => (
                        <div key={workflow.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{workflow.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {workflow.last_execution 
                                ? `Last run: ${formatDate(workflow.last_execution.started_at).split(',')[0]}`
                                : 'Never executed'}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => router.push(`/automation?id=${workflow.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRunWorkflow(workflow.id)}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/automation">
                    Manage Workflows
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      )}
      
      <TabsContent value="workflows" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>All Workflows</CardTitle>
            <CardDescription>
              Manage and monitor all your automation workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            ) : workflows.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No workflows found</p>
                <Button asChild>
                  <Link href="/automation">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workflow
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {workflows.map(workflow => (
                  <Card key={workflow.id} className="overflow-hidden">
                    <div className="flex items-center p-4">
                      <div className="flex-1">
                        <h3 className="font-medium">{workflow.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {workflow.description || 'No description'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={workflow.is_active ? 'default' : 'outline'}>
                          {workflow.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => router.push(`/automation?id=${workflow.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleRunWorkflow(workflow.id)}
                            disabled={!workflow.is_active}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted/50 px-4 py-2 flex items-center justify-between text-xs">
                      <div>
                        Created: {formatDate(workflow.created_at).split(',')[0]}
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          Executions: {workflow.execution_count || 0}
                        </div>
                        <div>
                          Success Rate: {Math.round(workflow.success_rate || 0)}%
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="executions" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Recent Executions</CardTitle>
            <CardDescription>
              Recent workflow execution history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            ) : recentExecutions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No executions found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentExecutions.map(execution => {
                  const workflow = workflows.find(w => w.id === execution.workflow_id);
                  return (
                    <Card key={execution.execution_id} className="overflow-hidden">
                      <div className="flex items-center p-4">
                        <div className="flex-1">
                          <h3 className="font-medium">{workflow?.name || 'Unknown Workflow'}</h3>
                          <p className="text-sm text-muted-foreground">
                            ID: {execution.execution_id}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(execution.status)}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            asChild
                          >
                            <Link href={`/automation/monitor?executionId=${execution.execution_id}`}>
                              Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                      <div className="bg-muted/50 px-4 py-2 flex items-center justify-between text-xs">
                        <div>
                          Started: {formatDate(execution.started_at)}
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            Duration: {calculateExecutionTime(execution)}
                          </div>
                          {execution.status === 'failed' && (
                            <div className="text-destructive">
                              Error: {execution.error_message || 'Unknown error'}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/automation/monitor">
                View Full Execution History
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="ai-insights" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis History</CardTitle>
            <CardDescription>
              Recent AI analyses performed by automation workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            ) : aiAnalyses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No AI analyses found</p>
                <Button asChild>
                  <Link href="/automation">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Create AI Workflow
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {aiAnalyses.map(analysis => (
                  <Card key={analysis.id} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium flex items-center">
                          <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
                          AI Analysis
                        </h3>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(analysis.created_at)}
                        </div>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Prompt:</span> {analysis.prompt.length > 100 
                          ? `${analysis.prompt.substring(0, 100)}...` 
                          : analysis.prompt}
                      </p>
                      {analysis.workflow_execution_id && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Execution ID: {analysis.workflow_execution_id}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/automation/ai-insights">
                View All AI Insights
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </div>
  );
}
