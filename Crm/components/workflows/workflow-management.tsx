"use client"

import { useState, useEffect } from "react"
import { Loader2, GitBranch, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"

import { WorkflowSelector } from "./workflow-selector"
import { WorkflowProgress } from "./workflow-progress"
import { getWorkflowExecutionById, getWorkflowTemplateById } from "@/lib/api"
import { WorkflowExecution, WorkflowTemplate } from "@/lib/types"

interface WorkflowManagementProps {
  serviceOrderId: string
  serviceType?: string | null
  workflowId?: string | null
  currentStep?: number | null
  onWorkflowAssigned?: (workflowId: string) => void
  onWorkflowStepChange?: (stepId: string) => void
}

export function WorkflowManagement({
  serviceOrderId,
  serviceType,
  workflowId,
  currentStep,
  onWorkflowAssigned,
  onWorkflowStepChange
}: WorkflowManagementProps) {
  const [loading, setLoading] = useState(true)
  const [execution, setExecution] = useState<WorkflowExecution | null>(null)
  const [template, setTemplate] = useState<WorkflowTemplate | null>(null)
  const [activeTab, setActiveTab] = useState<string>("progress")
  
  // Load workflow data
  useEffect(() => {
    const loadWorkflowData = async () => {
      if (!workflowId) {
        setLoading(false)
        return
      }
      
      setLoading(true)
      
      try {
        // First try to get the execution
        const executionData = await getWorkflowExecutionById(serviceOrderId)
        
        if (executionData) {
          setExecution(executionData as WorkflowExecution)
          setTemplate(executionData.workflow_templates as unknown as WorkflowTemplate)
        } else {
          // If no execution exists, get the template
          const templateData = await getWorkflowTemplateById(workflowId, true)
          if (templateData) {
            setTemplate(templateData as WorkflowTemplate)
          }
        }
      } catch (error) {
        console.error("Error loading workflow data:", error)
        toast.error("Błąd podczas ładowania danych workflow")
      } finally {
        setLoading(false)
      }
    }
    
    loadWorkflowData()
  }, [serviceOrderId, workflowId])
  
  // Handle workflow step change
  const handleStepChange = (stepId: string) => {
    if (onWorkflowStepChange) {
      onWorkflowStepChange(stepId)
    }
  }
  
  // Handle workflow assignment
  const handleWorkflowAssigned = (newWorkflowId: string) => {
    if (onWorkflowAssigned) {
      onWorkflowAssigned(newWorkflowId)
    }
    
    // Reload the page to get the new workflow data
    window.location.reload()
  }
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Workflow
          </CardTitle>
          <CardDescription>Ładowanie danych workflow...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }
  
  if (!workflowId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Workflow
          </CardTitle>
          <CardDescription>Przypisz workflow do tego zlecenia, aby śledzić postęp prac</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="default" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Brak przypisanego workflow</AlertTitle>
            <AlertDescription>
              To zlecenie nie ma jeszcze przypisanego workflow. Przypisz workflow, aby śledzić postęp prac.
            </AlertDescription>
          </Alert>
          
          <WorkflowSelector
            serviceOrderId={serviceOrderId}
            serviceType={serviceType}
            onWorkflowAssigned={handleWorkflowAssigned}
          />
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Workflow
        </CardTitle>
        <CardDescription>
          {template?.name || "Workflow"} - {execution?.status || "Aktywny"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="progress">Postęp</TabsTrigger>
            <TabsTrigger value="history">Historia</TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress" className="mt-4">
            {execution ? (
              <WorkflowProgress
                execution={execution}
                onStepChange={handleStepChange}
              />
            ) : template ? (
              <WorkflowProgress
                template={template}
                currentStepId={template.default_step_id || undefined}
                readOnly={true}
              />
            ) : (
              <Alert variant="default">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Brak danych workflow</AlertTitle>
                <AlertDescription>
                  Nie można załadować danych workflow. Spróbuj odświeżyć stronę.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            {execution?.step_history && execution.step_history.length > 0 ? (
              <div className="space-y-4">
                {execution.step_history.map((step, index) => {
                  const stepData = template?.steps?.find(s => s.id === step.step_id)
                  
                  return (
                    <div
                      key={`${step.step_id}-${index}`}
                      className="border rounded-md p-3"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{stepData?.name || `Krok ${index + 1}`}</h4>
                          {stepData?.description && (
                            <p className="text-sm text-muted-foreground">{stepData.description}</p>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(step.started_at).toLocaleString('pl-PL')}
                        </div>
                      </div>
                      
                      {step.completed_at && (
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-green-600">Ukończono</span>
                          <span className="text-muted-foreground">
                            {new Date(step.completed_at).toLocaleString('pl-PL')}
                          </span>
                        </div>
                      )}
                      
                      {step.notes && (
                        <div className="mt-2 text-sm border-t pt-2">
                          <p className="text-xs text-muted-foreground mb-1">Notatki:</p>
                          <p>{step.notes}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Brak historii kroków workflow
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Odśwież
        </Button>
        
        {execution?.status !== 'completed' && (
          <Button variant="destructive" size="sm">
            Anuluj workflow
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
