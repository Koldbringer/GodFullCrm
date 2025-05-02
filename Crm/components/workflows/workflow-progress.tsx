"use client"

import { useState } from "react"
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip"
import { WorkflowExecution, WorkflowStep, WorkflowTemplate } from "@/lib/types"
import { advanceWorkflowStep } from "@/lib/api"
import { toast } from "sonner"

interface WorkflowProgressProps {
  execution?: WorkflowExecution
  template?: WorkflowTemplate
  currentStepId?: string
  compact?: boolean
  onStepChange?: (stepId: string) => void
  readOnly?: boolean
}

export function WorkflowProgress({
  execution,
  template,
  currentStepId,
  compact = false,
  onStepChange,
  readOnly = false
}: WorkflowProgressProps) {
  const [isAdvancing, setIsAdvancing] = useState(false)
  
  // If we have an execution, use that data, otherwise use the template
  const workflowTemplate = execution?.workflow_templates || template
  const steps = workflowTemplate?.workflow_steps || []
  const currentStep = currentStepId || execution?.current_step_id
  
  if (!workflowTemplate || steps.length === 0) {
    return null
  }
  
  // Sort steps by order
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order)
  
  // Calculate progress percentage
  const currentStepIndex = sortedSteps.findIndex(step => step.id === currentStep)
  const progressPercentage = currentStepIndex >= 0 
    ? Math.round(((currentStepIndex) / (sortedSteps.length - 1)) * 100)
    : 0
  
  // Get step status
  const getStepStatus = (step: WorkflowStep) => {
    if (!execution?.step_history) return "pending"
    
    const stepHistory = execution.step_history.find(h => h.step_id === step.id)
    
    if (!stepHistory) return "pending"
    if (stepHistory.completed_at) return "completed"
    if (stepHistory.started_at) return "active"
    
    return "pending"
  }
  
  // Get step icon
  const getStepIcon = (step: WorkflowStep) => {
    const status = getStepStatus(step)
    
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "active":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Circle className="h-5 w-5 text-gray-300" />
    }
  }
  
  // Handle advancing to the next step
  const handleAdvanceStep = async (stepId: string) => {
    if (!execution || isAdvancing || readOnly) return
    
    setIsAdvancing(true)
    
    try {
      // Check if this is the final step
      const isFinalStep = sortedSteps[sortedSteps.length - 1].id === stepId
      
      const result = await advanceWorkflowStep(execution.id, stepId, {
        completed_by: "current-user", // Replace with actual user ID
        is_final_step: isFinalStep
      })
      
      if (result) {
        toast.success(`Workflow advanced to ${sortedSteps.find(s => s.id === stepId)?.name}`)
        if (onStepChange) {
          onStepChange(stepId)
        }
      } else {
        toast.error("Failed to advance workflow")
      }
    } catch (error) {
      console.error("Error advancing workflow:", error)
      toast.error("Error advancing workflow")
    } finally {
      setIsAdvancing(false)
    }
  }
  
  // Compact view for cards
  if (compact) {
    return (
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">
            Workflow: {workflowTemplate.name}
          </span>
          <span className="text-xs font-medium">
            {progressPercentage}%
          </span>
        </div>
        <Progress value={progressPercentage} className="h-1" />
      </div>
    )
  }
  
  // Full view for detailed pages
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{workflowTemplate.name}</h3>
        <span className="text-sm text-muted-foreground">
          Progress: {progressPercentage}%
        </span>
      </div>
      
      <Progress value={progressPercentage} className="h-2" />
      
      <div className="flex flex-col space-y-2 mt-4">
        {sortedSteps.map((step) => {
          const status = getStepStatus(step)
          const isActive = step.id === currentStep
          const isCompleted = status === "completed"
          const canAdvance = !readOnly && execution && isActive && !isAdvancing
          
          return (
            <div 
              key={step.id}
              className={`flex items-center p-3 rounded-md border ${
                isActive 
                  ? "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800" 
                  : isCompleted 
                    ? "border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800" 
                    : "border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
              }`}
            >
              <div className="mr-3">
                {getStepIcon(step)}
              </div>
              
              <div className="flex-1">
                <div className="font-medium">{step.name}</div>
                {step.description && (
                  <div className="text-sm text-muted-foreground">{step.description}</div>
                )}
              </div>
              
              {canAdvance && sortedSteps.findIndex(s => s.id === step.id) < sortedSteps.length - 1 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          // Find the next step in the sequence
                          const nextStepIndex = sortedSteps.findIndex(s => s.id === step.id) + 1
                          if (nextStepIndex < sortedSteps.length) {
                            handleAdvanceStep(sortedSteps[nextStepIndex].id)
                          }
                        }}
                        disabled={isAdvancing}
                      >
                        {isAdvancing ? "Advancing..." : "Complete & Advance"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mark this step as complete and advance to the next step</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
