'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Clock, Calendar, Zap, Globe } from 'lucide-react';
import { EventTypes } from '@/lib/services/event-emitter';

export interface Trigger {
  id: string;
  type: 'schedule' | 'event' | 'webhook';
  name: string;
  config: Record<string, any>;
}

interface TriggerPanelProps {
  triggers: Trigger[];
  onAddTrigger: (trigger: Trigger) => void;
  onUpdateTrigger: (triggerId: string, trigger: Trigger) => void;
  onDeleteTrigger: (triggerId: string) => void;
}

export function TriggerPanel({ 
  triggers, 
  onAddTrigger, 
  onUpdateTrigger, 
  onDeleteTrigger 
}: TriggerPanelProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);
  const [triggerType, setTriggerType] = useState<'schedule' | 'event' | 'webhook'>('schedule');
  
  // Form state for schedule trigger
  const [scheduleName, setScheduleName] = useState('');
  const [scheduleExpression, setScheduleExpression] = useState('');
  const [scheduleTimezone, setScheduleTimezone] = useState('UTC');
  
  // Form state for event trigger
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  
  // Form state for webhook trigger
  const [webhookName, setWebhookName] = useState('');
  const [webhookEndpoint, setWebhookEndpoint] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  
  const handleAddTrigger = () => {
    setIsAddDialogOpen(true);
    resetForm();
  };
  
  const handleEditTrigger = (trigger: Trigger) => {
    setSelectedTrigger(trigger);
    setTriggerType(trigger.type);
    
    // Set form values based on trigger type
    if (trigger.type === 'schedule') {
      setScheduleName(trigger.name);
      setScheduleExpression(trigger.config.schedule || '');
      setScheduleTimezone(trigger.config.timezone || 'UTC');
    } else if (trigger.type === 'event') {
      setEventName(trigger.name);
      setEventType(trigger.config.eventType || '');
    } else if (trigger.type === 'webhook') {
      setWebhookName(trigger.name);
      setWebhookEndpoint(trigger.config.endpoint || '');
      setWebhookSecret(trigger.config.secret || '');
    }
    
    setIsEditDialogOpen(true);
  };
  
  const resetForm = () => {
    setTriggerType('schedule');
    setScheduleName('');
    setScheduleExpression('');
    setScheduleTimezone('UTC');
    setEventName('');
    setEventType('');
    setWebhookName('');
    setWebhookEndpoint('');
    setWebhookSecret('');
  };
  
  const handleSaveTrigger = () => {
    let newTrigger: Trigger;
    
    if (triggerType === 'schedule') {
      newTrigger = {
        id: selectedTrigger?.id || `trigger_${Date.now()}`,
        type: 'schedule',
        name: scheduleName || 'Schedule Trigger',
        config: {
          schedule: scheduleExpression,
          timezone: scheduleTimezone,
        },
      };
    } else if (triggerType === 'event') {
      newTrigger = {
        id: selectedTrigger?.id || `trigger_${Date.now()}`,
        type: 'event',
        name: eventName || 'Event Trigger',
        config: {
          eventType: eventType,
          conditions: {},
        },
      };
    } else {
      newTrigger = {
        id: selectedTrigger?.id || `trigger_${Date.now()}`,
        type: 'webhook',
        name: webhookName || 'Webhook Trigger',
        config: {
          endpoint: webhookEndpoint,
          secret: webhookSecret,
        },
      };
    }
    
    if (selectedTrigger) {
      onUpdateTrigger(selectedTrigger.id, newTrigger);
      setIsEditDialogOpen(false);
    } else {
      onAddTrigger(newTrigger);
      setIsAddDialogOpen(false);
    }
    
    resetForm();
  };
  
  const handleDeleteTrigger = (triggerId: string) => {
    if (confirm('Are you sure you want to delete this trigger?')) {
      onDeleteTrigger(triggerId);
    }
  };
  
  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'schedule':
        return <Clock className="h-4 w-4" />;
      case 'event':
        return <Zap className="h-4 w-4" />;
      case 'webhook':
        return <Globe className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const getTriggerDescription = (trigger: Trigger) => {
    switch (trigger.type) {
      case 'schedule':
        return `Schedule: ${trigger.config.schedule || 'Not set'}`;
      case 'event':
        return `Event: ${trigger.config.eventType || 'Not set'}`;
      case 'webhook':
        return `Endpoint: ${trigger.config.endpoint || 'Not set'}`;
      default:
        return '';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Triggers</h3>
        <Button variant="outline" onClick={handleAddTrigger}>
          Add Trigger
        </Button>
      </div>
      
      {triggers.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No triggers defined</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add a trigger to automatically execute this workflow
            </p>
            <Button variant="outline" className="mt-4" onClick={handleAddTrigger}>
              Add Trigger
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {triggers.map(trigger => (
            <Card key={trigger.id} className="bg-muted/50">
              <CardHeader className="py-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getTriggerIcon(trigger.type)}
                    <CardTitle className="text-base">{trigger.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEditTrigger(trigger)}>
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteTrigger(trigger.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <CardDescription>{getTriggerDescription(trigger)}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
      
      {/* Add Trigger Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Trigger</DialogTitle>
            <DialogDescription>
              Add a trigger to automatically execute this workflow
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={triggerType} onValueChange={(value) => setTriggerType(value as any)}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="event" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Event
              </TabsTrigger>
              <TabsTrigger value="webhook" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Webhook
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="schedule" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="schedule-name">Name</Label>
                <Input 
                  id="schedule-name" 
                  placeholder="Daily at 9 AM" 
                  value={scheduleName}
                  onChange={e => setScheduleName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="schedule-expression">Cron Expression</Label>
                <Input 
                  id="schedule-expression" 
                  placeholder="0 9 * * *" 
                  value={scheduleExpression}
                  onChange={e => setScheduleExpression(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Use cron syntax: minute hour day-of-month month day-of-week
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="schedule-timezone">Timezone</Label>
                <Select 
                  value={scheduleTimezone}
                  onValueChange={setScheduleTimezone}
                >
                  <SelectTrigger id="schedule-timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="Europe/Warsaw">Europe/Warsaw</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="event" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="event-name">Name</Label>
                <Input 
                  id="event-name" 
                  placeholder="New Customer" 
                  value={eventName}
                  onChange={e => setEventName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="event-type">Event Type</Label>
                <Select 
                  value={eventType}
                  onValueChange={setEventType}
                >
                  <SelectTrigger id="event-type">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EventTypes.CUSTOMER_CREATED}>Customer Created</SelectItem>
                    <SelectItem value={EventTypes.CUSTOMER_UPDATED}>Customer Updated</SelectItem>
                    <SelectItem value={EventTypes.SERVICE_ORDER_CREATED}>Service Order Created</SelectItem>
                    <SelectItem value={EventTypes.SERVICE_ORDER_COMPLETED}>Service Order Completed</SelectItem>
                    <SelectItem value={EventTypes.DEVICE_MAINTENANCE_DUE}>Device Maintenance Due</SelectItem>
                    <SelectItem value={EventTypes.INVENTORY_LOW}>Inventory Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="webhook" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-name">Name</Label>
                <Input 
                  id="webhook-name" 
                  placeholder="External System" 
                  value={webhookName}
                  onChange={e => setWebhookName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="webhook-endpoint">Endpoint</Label>
                <Input 
                  id="webhook-endpoint" 
                  placeholder="/api/webhooks/my-workflow" 
                  value={webhookEndpoint}
                  onChange={e => setWebhookEndpoint(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The endpoint path for this webhook
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="webhook-secret">Secret (Optional)</Label>
                <Input 
                  id="webhook-secret" 
                  type="password"
                  placeholder="Secret key for verification" 
                  value={webhookSecret}
                  onChange={e => setWebhookSecret(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTrigger}>
              Add Trigger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Trigger Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Trigger</DialogTitle>
            <DialogDescription>
              Modify the trigger settings
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={triggerType} onValueChange={(value) => setTriggerType(value as any)}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="event" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Event
              </TabsTrigger>
              <TabsTrigger value="webhook" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Webhook
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="schedule" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-schedule-name">Name</Label>
                <Input 
                  id="edit-schedule-name" 
                  placeholder="Daily at 9 AM" 
                  value={scheduleName}
                  onChange={e => setScheduleName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-schedule-expression">Cron Expression</Label>
                <Input 
                  id="edit-schedule-expression" 
                  placeholder="0 9 * * *" 
                  value={scheduleExpression}
                  onChange={e => setScheduleExpression(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Use cron syntax: minute hour day-of-month month day-of-week
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-schedule-timezone">Timezone</Label>
                <Select 
                  value={scheduleTimezone}
                  onValueChange={setScheduleTimezone}
                >
                  <SelectTrigger id="edit-schedule-timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="Europe/Warsaw">Europe/Warsaw</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="event" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-event-name">Name</Label>
                <Input 
                  id="edit-event-name" 
                  placeholder="New Customer" 
                  value={eventName}
                  onChange={e => setEventName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-event-type">Event Type</Label>
                <Select 
                  value={eventType}
                  onValueChange={setEventType}
                >
                  <SelectTrigger id="edit-event-type">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EventTypes.CUSTOMER_CREATED}>Customer Created</SelectItem>
                    <SelectItem value={EventTypes.CUSTOMER_UPDATED}>Customer Updated</SelectItem>
                    <SelectItem value={EventTypes.SERVICE_ORDER_CREATED}>Service Order Created</SelectItem>
                    <SelectItem value={EventTypes.SERVICE_ORDER_COMPLETED}>Service Order Completed</SelectItem>
                    <SelectItem value={EventTypes.DEVICE_MAINTENANCE_DUE}>Device Maintenance Due</SelectItem>
                    <SelectItem value={EventTypes.INVENTORY_LOW}>Inventory Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="webhook" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-webhook-name">Name</Label>
                <Input 
                  id="edit-webhook-name" 
                  placeholder="External System" 
                  value={webhookName}
                  onChange={e => setWebhookName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-webhook-endpoint">Endpoint</Label>
                <Input 
                  id="edit-webhook-endpoint" 
                  placeholder="/api/webhooks/my-workflow" 
                  value={webhookEndpoint}
                  onChange={e => setWebhookEndpoint(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The endpoint path for this webhook
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-webhook-secret">Secret (Optional)</Label>
                <Input 
                  id="edit-webhook-secret" 
                  type="password"
                  placeholder="Secret key for verification" 
                  value={webhookSecret}
                  onChange={e => setWebhookSecret(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTrigger}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
