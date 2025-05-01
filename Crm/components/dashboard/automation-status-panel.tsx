"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, RefreshCw, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import Link from "next/link";

type WorkflowStatus = {
  id: string;
  name: string;
  is_active: boolean;
  last_execution_status?: 'completed' | 'failed' | 'running' | null;
  last_execution_time?: string;
  error_message?: string;
};

export function AutomationStatusPanel() {
  const [workflows, setWorkflows] = useState<WorkflowStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkflowStatus = async () => {
    try {
      setIsLoading(true);
      // Fetch workflows
      const response = await fetch('/api/automation/workflows');

      if (!response.ok) {
        throw new Error('Failed to fetch automation status');
      }

      const data = await response.json();

      // Get the latest execution for each workflow
      const workflowsWithStatus = await Promise.all(
        data.map(async (workflow: any) => {
          try {
            const executionResponse = await fetch(
              `/api/automation/workflows/executions?workflowId=${workflow.id}&limit=1`
            );

            if (!executionResponse.ok) {
              return {
                ...workflow,
                last_execution_status: null,
                last_execution_time: null,
              };
            }

            const executionData = await executionResponse.json();
            const lastExecution = executionData[0];

            return {
              ...workflow,
              last_execution_status: lastExecution ? lastExecution.status : null,
              last_execution_time: lastExecution ? lastExecution.completed_at || lastExecution.started_at : null,
              error_message: lastExecution?.error_message,
            };
          } catch (err) {
            console.error(`Error fetching execution for workflow ${workflow.id}:`, err);
            return {
              ...workflow,
              last_execution_status: null,
              last_execution_time: null,
            };
          }
        })
      );

      setWorkflows(workflowsWithStatus);
      setError(null);
    } catch (err) {
      console.error('Error fetching automation status:', err);
      setError('Failed to load automation status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflowStatus();
  }, []);

  const getStatusIndicator = (workflow: WorkflowStatus) => {
    if (!workflow.is_active) {
      return <span className="h-2 w-2 rounded-full bg-gray-400"></span>;
    }

    if (workflow.last_execution_status === 'running') {
      return <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>;
    }

    if (workflow.last_execution_status === 'failed') {
      return <span className="h-2 w-2 rounded-full bg-red-500"></span>;
    }

    if (workflow.last_execution_status === 'completed') {
      return <span className="h-2 w-2 rounded-full bg-green-500"></span>;
    }

    return <span className="h-2 w-2 rounded-full bg-yellow-500"></span>;
  };

  const getStatusText = (workflow: WorkflowStatus) => {
    if (!workflow.is_active) {
      return 'Nieaktywny';
    }

    if (workflow.last_execution_status === 'running') {
      return 'Uruchomiony';
    }

    if (workflow.last_execution_status === 'failed') {
      return `Błąd: ${workflow.error_message || 'Nieznany błąd'}`;
    }

    if (workflow.last_execution_status === 'completed') {
      return 'Aktywny';
    }

    return 'Oczekujący';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Status Automatyzacji</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchWorkflowStatus}
              disabled={isLoading}
              className="h-8 w-8"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <CardDescription>Przegląd aktywnych automatyzacji i alertów</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {isLoading ? (
          <>
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          </>
        ) : error ? (
          <div className="flex items-center justify-center py-4 text-muted-foreground">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span>{error}</span>
          </div>
        ) : workflows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
            <p className="mb-2">Brak skonfigurowanych automatyzacji</p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/automation">Skonfiguruj automatyzacje</Link>
            </Button>
          </div>
        ) : (
          workflows.slice(0, 4).map((workflow) => (
            <div key={workflow.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIndicator(workflow)}
                <p className="text-sm font-medium">{workflow.name}</p>
              </div>
              <span className="text-xs text-muted-foreground">{getStatusText(workflow)}</span>
            </div>
          ))
        )}

        {workflows.length > 0 && (
          <div className="pt-2">
            <Button variant="link" size="sm" className="p-0 h-auto w-full" asChild>
              <Link href="/automation/monitor">Zobacz wszystkie automatyzacje</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}