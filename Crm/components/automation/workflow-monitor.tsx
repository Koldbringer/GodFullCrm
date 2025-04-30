'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Info,
  Trash2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface WorkflowExecution {
  id: string;
  execution_id: string;
  workflow_id: string;
  status: 'started' | 'completed' | 'failed';
  started_at: string;
  completed_at: string | null;
  error_message: string | null;
  variables: string | null;
  created_at: string;
}

interface WorkflowNodeExecution {
  id: string;
  execution_id: string;
  workflow_id: string;
  node_id: string;
  status: 'started' | 'completed' | 'failed';
  timestamp: string;
  error_message: string | null;
  created_at: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export function WorkflowMonitor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [nodeExecutions, setNodeExecutions] = useState<WorkflowNodeExecution[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNodeExecutionsLoading, setIsNodeExecutionsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [executionToDelete, setExecutionToDelete] = useState<string | null>(null);
  
  // Fetch workflows on component mount
  useEffect(() => {
    fetchWorkflows();
  }, []);
  
  // Fetch executions when filters change
  useEffect(() => {
    fetchExecutions();
  }, [selectedWorkflowId, page, limit]);
  
  // Parse URL parameters on mount
  useEffect(() => {
    const workflowId = searchParams.get('workflowId');
    const executionId = searchParams.get('executionId');
    
    if (workflowId) {
      setSelectedWorkflowId(workflowId);
    }
    
    if (executionId) {
      fetchExecutionDetails(executionId);
    }
  }, [searchParams]);
  
  async function fetchWorkflows() {
    try {
      const response = await fetch('/api/automation/workflows');
      if (!response.ok) {
        throw new Error('Failed to fetch workflows');
      }
      
      const data = await response.json();
      setWorkflows(data);
    } catch (error) {
      console.error('Error fetching workflows:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch workflows',
        variant: 'destructive',
      });
    }
  }
  
  async function fetchExecutions() {
    setIsLoading(true);
    
    try {
      const offset = (page - 1) * limit;
      let url = `/api/automation/workflows/executions?limit=${limit}&offset=${offset}`;
      
      if (selectedWorkflowId) {
        url += `&workflowId=${selectedWorkflowId}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch executions');
      }
      
      const data = await response.json();
      setExecutions(data);
    } catch (error) {
      console.error('Error fetching executions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch workflow executions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  async function fetchExecutionDetails(executionId: string) {
    setIsNodeExecutionsLoading(true);
    
    try {
      // Fetch execution details
      const executionResponse = await fetch(`/api/automation/workflows/executions?executionId=${executionId}`);
      if (!executionResponse.ok) {
        throw new Error('Failed to fetch execution details');
      }
      
      const executionData = await executionResponse.json();
      if (executionData.length === 0) {
        throw new Error('Execution not found');
      }
      
      setSelectedExecution(executionData[0]);
      
      // Fetch node executions
      const nodeExecutionsResponse = await fetch(`/api/automation/workflows/executions/nodes?executionId=${executionId}`);
      if (!nodeExecutionsResponse.ok) {
        throw new Error('Failed to fetch node executions');
      }
      
      const nodeExecutionsData = await nodeExecutionsResponse.json();
      setNodeExecutions(nodeExecutionsData);
      
      // Open the details dialog
      setIsDetailsOpen(true);
    } catch (error) {
      console.error('Error fetching execution details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch execution details',
        variant: 'destructive',
      });
    } finally {
      setIsNodeExecutionsLoading(false);
    }
  }
  
  async function deleteExecution(executionId: string) {
    try {
      const response = await fetch(`/api/automation/workflows/executions?executionId=${executionId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete execution');
      }
      
      toast({
        title: 'Success',
        description: 'Execution deleted successfully',
      });
      
      // Refresh the executions list
      fetchExecutions();
      
      // Close the dialog if the deleted execution was selected
      if (selectedExecution?.execution_id === executionId) {
        setIsDetailsOpen(false);
        setSelectedExecution(null);
      }
    } catch (error) {
      console.error('Error deleting execution:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete execution',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setExecutionToDelete(null);
    }
  }
  
  function handleSearch() {
    if (searchTerm.trim() === '') {
      fetchExecutions();
      return;
    }
    
    // Filter executions by execution_id
    const filteredExecutions = executions.filter(execution => 
      execution.execution_id.includes(searchTerm)
    );
    
    setExecutions(filteredExecutions);
  }
  
  function handleViewDetails(execution: WorkflowExecution) {
    setSelectedExecution(execution);
    fetchExecutionDetails(execution.execution_id);
  }
  
  function handleDeleteClick(executionId: string) {
    setExecutionToDelete(executionId);
    setIsDeleteDialogOpen(true);
  }
  
  function getStatusBadge(status: string) {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-500" variant="secondary">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-500" variant="secondary">
            <XCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        );
      case 'started':
        return (
          <Badge className="bg-blue-500" variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Running
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            {status}
          </Badge>
        );
    }
  }
  
  function formatDate(dateString: string | null) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  }
  
  function getWorkflowName(workflowId: string) {
    const workflow = workflows.find(w => w.id === workflowId);
    return workflow ? workflow.name : 'Unknown Workflow';
  }
  
  function getDuration(startDate: string, endDate: string | null) {
    if (!endDate) return 'Running...';
    
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const durationMs = end - start;
    
    if (durationMs < 1000) {
      return `${durationMs}ms`;
    } else if (durationMs < 60000) {
      return `${Math.round(durationMs / 1000)}s`;
    } else {
      const minutes = Math.floor(durationMs / 60000);
      const seconds = Math.round((durationMs % 60000) / 1000);
      return `${minutes}m ${seconds}s`;
    }
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filtry</CardTitle>
          <CardDescription>Filtruj wykonania przepływów automatyzacji</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Przepływ</label>
              <Select
                value={selectedWorkflowId}
                onValueChange={setSelectedWorkflowId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wszystkie przepływy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Wszystkie przepływy</SelectItem>
                  {workflows.map(workflow => (
                    <SelectItem key={workflow.id} value={workflow.id}>
                      {workflow.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Wyszukaj ID wykonania</label>
              <div className="flex gap-2">
                <Input
                  placeholder="ID wykonania"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <Button variant="outline" onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-end">
              <Button variant="outline" onClick={fetchExecutions}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Odśwież
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Wykonania przepływów</CardTitle>
          <CardDescription>Lista wykonań przepływów automatyzacji</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : executions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Brak wykonań przepływów automatyzacji</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID wykonania</TableHead>
                    <TableHead>Przepływ</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rozpoczęto</TableHead>
                    <TableHead>Zakończono</TableHead>
                    <TableHead>Czas trwania</TableHead>
                    <TableHead className="text-right">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {executions.map(execution => (
                    <TableRow key={execution.execution_id}>
                      <TableCell className="font-mono text-xs">
                        {execution.execution_id.substring(0, 16)}...
                      </TableCell>
                      <TableCell>{getWorkflowName(execution.workflow_id)}</TableCell>
                      <TableCell>{getStatusBadge(execution.status)}</TableCell>
                      <TableCell>{formatDate(execution.started_at)}</TableCell>
                      <TableCell>{formatDate(execution.completed_at)}</TableCell>
                      <TableCell>
                        {getDuration(execution.started_at, execution.completed_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(execution)}
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(execution.execution_id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-2">
            <Select
              value={limit.toString()}
              onValueChange={value => setLimit(parseInt(value, 10))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="10 per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              Page {page}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage(p => p + 1)}
              disabled={executions.length < limit}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Execution Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Szczegóły wykonania</DialogTitle>
            <DialogDescription>
              Szczegółowe informacje o wykonaniu przepływu automatyzacji
            </DialogDescription>
          </DialogHeader>
          
          {selectedExecution && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">ID wykonania</h3>
                  <p className="text-sm font-mono">{selectedExecution.execution_id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Przepływ</h3>
                  <p className="text-sm">{getWorkflowName(selectedExecution.workflow_id)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Status</h3>
                  <div className="mt-1">{getStatusBadge(selectedExecution.status)}</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Czas trwania</h3>
                  <p className="text-sm">
                    {getDuration(selectedExecution.started_at, selectedExecution.completed_at)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Rozpoczęto</h3>
                  <p className="text-sm">{formatDate(selectedExecution.started_at)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Zakończono</h3>
                  <p className="text-sm">{formatDate(selectedExecution.completed_at)}</p>
                </div>
              </div>
              
              {selectedExecution.error_message && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-red-500">Błąd</h3>
                  <div className="bg-red-50 p-3 rounded-md mt-1 text-sm font-mono text-red-800">
                    {selectedExecution.error_message}
                  </div>
                </div>
              )}
              
              <Separator />
              
              <Tabs defaultValue="nodes">
                <TabsList>
                  <TabsTrigger value="nodes">Wykonanie węzłów</TabsTrigger>
                  <TabsTrigger value="variables">Zmienne</TabsTrigger>
                </TabsList>
                
                <TabsContent value="nodes" className="space-y-4">
                  {isNodeExecutionsLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : nodeExecutions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Brak danych o wykonaniu węzłów</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID węzła</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Czas</TableHead>
                            <TableHead>Błąd</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {nodeExecutions.map(nodeExecution => (
                            <TableRow key={nodeExecution.id}>
                              <TableCell className="font-mono text-xs">
                                {nodeExecution.node_id}
                              </TableCell>
                              <TableCell>{getStatusBadge(nodeExecution.status)}</TableCell>
                              <TableCell>{formatDate(nodeExecution.timestamp)}</TableCell>
                              <TableCell>
                                {nodeExecution.error_message ? (
                                  <span className="text-red-500 text-xs">
                                    {nodeExecution.error_message}
                                  </span>
                                ) : (
                                  <span className="text-green-500 text-xs">Brak błędów</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="variables">
                  {selectedExecution.variables ? (
                    <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-[300px]">
                      {JSON.stringify(JSON.parse(selectedExecution.variables), null, 2)}
                    </pre>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Brak zmiennych</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Zamknij
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (selectedExecution) {
                  handleDeleteClick(selectedExecution.execution_id);
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Usuń
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Potwierdź usunięcie</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz usunąć to wykonanie przepływu automatyzacji?
              Ta operacja jest nieodwracalna.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Anuluj
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (executionToDelete) {
                  deleteExecution(executionToDelete);
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Usuń
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
