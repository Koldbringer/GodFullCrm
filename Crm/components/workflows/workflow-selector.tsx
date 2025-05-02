"use client"

import { useState, useEffect } from "react"
import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"
import { getWorkflowTemplates, createWorkflowExecution, updateServiceOrder } from "@/lib/api"
import { WorkflowTemplate } from "@/lib/types"

interface WorkflowSelectorProps {
  serviceOrderId: string
  serviceType?: string | null
  currentWorkflowId?: string | null
  onWorkflowAssigned?: (workflowId: string) => void
}

export function WorkflowSelector({
  serviceOrderId,
  serviceType,
  currentWorkflowId,
  onWorkflowAssigned
}: WorkflowSelectorProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null)

  // Load workflow templates
  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true)
      try {
        const data = await getWorkflowTemplates(serviceType || undefined)
        setTemplates(data)
        
        // If there's a current workflow, select it
        if (currentWorkflowId) {
          const current = data.find(t => t.id === currentWorkflowId)
          if (current) {
            setSelectedTemplate(current)
          }
        }
      } catch (error) {
        console.error("Error loading workflow templates:", error)
        toast.error("Failed to load workflow templates")
      } finally {
        setLoading(false)
      }
    }
    
    loadTemplates()
  }, [serviceType, currentWorkflowId])

  // Assign workflow to service order
  const assignWorkflow = async () => {
    if (!selectedTemplate || assigning) return
    
    setAssigning(true)
    
    try {
      // Create a new workflow execution
      const now = new Date().toISOString()
      const defaultStep = selectedTemplate.default_step_id || 
        (selectedTemplate.steps && selectedTemplate.steps.length > 0 ? 
          selectedTemplate.steps.sort((a, b) => a.order - b.order)[0].id : null)
      
      if (!defaultStep) {
        toast.error("Workflow template has no steps")
        return
      }
      
      const execution = await createWorkflowExecution({
        service_order_id: serviceOrderId,
        workflow_template_id: selectedTemplate.id,
        current_step_id: defaultStep,
        status: 'active',
        started_at: now,
        step_history: [{
          step_id: defaultStep,
          started_at: now,
          completed_at: null,
          completed_by: null,
          notes: null,
          form_data: null
        }]
      })
      
      if (execution) {
        // Update the service order with the workflow ID
        await updateServiceOrder(serviceOrderId, {
          workflow_id: selectedTemplate.id,
          current_step: 1 // Assuming first step is 1
        })
        
        toast.success(`Workflow "${selectedTemplate.name}" assigned to service order`)
        
        if (onWorkflowAssigned) {
          onWorkflowAssigned(selectedTemplate.id)
        }
        
        setOpen(false)
      } else {
        toast.error("Failed to assign workflow")
      }
    } catch (error) {
      console.error("Error assigning workflow:", error)
      toast.error("Error assigning workflow")
    } finally {
      setAssigning(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Loading workflows...</span>
            </>
          ) : selectedTemplate ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>{selectedTemplate.name}</span>
            </>
          ) : (
            <span>Assign workflow</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start" side="bottom">
        <Command>
          <CommandInput placeholder="Search workflows..." />
          <CommandList>
            <CommandEmpty>No workflows found.</CommandEmpty>
            <CommandGroup>
              {templates.map((template) => (
                <CommandItem
                  key={template.id}
                  value={template.id}
                  onSelect={() => {
                    setSelectedTemplate(template)
                    if (template.id === currentWorkflowId) {
                      setOpen(false)
                    }
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selectedTemplate?.id === template.id ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <div className="flex flex-col">
                    <span>{template.name}</span>
                    {template.description && (
                      <span className="text-xs text-muted-foreground">{template.description}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <div className="border-t p-2">
            <Button
              size="sm"
              className="w-full"
              disabled={!selectedTemplate || selectedTemplate.id === currentWorkflowId || assigning}
              onClick={assignWorkflow}
            >
              {assigning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : selectedTemplate?.id === currentWorkflowId ? (
                "Already assigned"
              ) : (
                "Assign workflow"
              )}
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
