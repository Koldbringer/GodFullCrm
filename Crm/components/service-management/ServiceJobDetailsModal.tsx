'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  User, 
  MapPin, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  Settings, 
  History, 
  Loader2 
} from 'lucide-react';

// Status badge colors
const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

// Priority badge colors
const priorityColors = {
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

// Status labels in Polish
const statusLabels = {
  scheduled: 'Zaplanowane',
  in_progress: 'W trakcie',
  completed: 'Zakończone',
  cancelled: 'Anulowane'
};

// Priority labels in Polish
const priorityLabels = {
  low: 'Niski',
  medium: 'Średni',
  high: 'Wysoki',
  critical: 'Krytyczny'
};

export default function ServiceJobDetailsModal({ job, open, onOpenChange, onStatusChange }) {
  const [activeTab, setActiveTab] = useState('details');
  const [history, setHistory] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch job history and reports when the modal opens
  useEffect(() => {
    if (open && job) {
      fetchJobHistory();
      fetchJobReports();
    }
  }, [open, job]);
  
  // Fetch job history
  const fetchJobHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/service-management/history?serviceJobId=${job.id}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching job history: ${response.status}`);
      }
      
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error('Error fetching job history:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch job reports
  const fetchJobReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/service-management/reports?serviceJobId=${job.id}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching job reports: ${response.status}`);
      }
      
      const data = await response.json();
      setReports(data);
    } catch (err) {
      console.error('Error fetching job reports:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle status change
  const handleStatusChange = async (newStatus) => {
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };
  
  if (!job) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {job.title}
            <Badge className={statusColors[job.status]}>
              {statusLabels[job.status]}
            </Badge>
            <Badge className={priorityColors[job.priority]}>
              {priorityLabels[job.priority]}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Szczegóły
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="mr-2 h-4 w-4" />
              Historia
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Raporty
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">Klient:</span>
                  <span>{job.customer_name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">Technik:</span>
                  <span>{job.technician_name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">Urządzenie:</span>
                  <span>{job.device_name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">Lokalizacja:</span>
                  <span>{job.location}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">Data zaplanowana:</span>
                  <span>{format(new Date(job.scheduled_date), 'dd MMMM yyyy, HH:mm', { locale: pl })}</span>
                </div>
                
                {job.completion_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">Data zakończenia:</span>
                    <span>{format(new Date(job.completion_date), 'dd MMMM yyyy, HH:mm', { locale: pl })}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">Priorytet:</span>
                  <Badge className={priorityColors[job.priority]}>
                    {priorityLabels[job.priority]}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">Status:</span>
                  <Badge className={statusColors[job.status]}>
                    {statusLabels[job.status]}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Opis:</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {job.description || 'Brak opisu'}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2">Ładowanie historii...</span>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Brak historii dla tego zlecenia.
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((entry) => (
                  <div key={entry.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">
                          Status zmieniony z {entry.previous_status ? statusLabels[entry.previous_status] : 'Nowy'} na {statusLabels[entry.new_status]}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Przez: {entry.changed_by_name}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(entry.created_at), 'dd MMM yyyy, HH:mm', { locale: pl })}
                      </div>
                    </div>
                    {entry.notes && (
                      <div className="mt-2 text-sm">
                        <span className="font-semibold">Notatki:</span> {entry.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2">Ładowanie raportów...</span>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Brak raportów dla tego zlecenia.
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">
                          Raport: {report.report_type === 'inspection' ? 'Oględziny' : 
                                  report.report_type === 'maintenance' ? 'Konserwacja' : 
                                  report.report_type === 'repair' ? 'Naprawa' : 
                                  report.report_type === 'installation' ? 'Instalacja' : 'Inny'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Wykonane prace: {report.actions_taken}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(report.completed_at), 'dd MMM yyyy, HH:mm', { locale: pl })}
                      </div>
                    </div>
                    {report.findings && (
                      <div className="mt-2 text-sm">
                        <span className="font-semibold">Ustalenia:</span> {report.findings}
                      </div>
                    )}
                    {report.follow_up_required && (
                      <div className="mt-2 text-sm">
                        <span className="font-semibold">Wymagana dalsza obsługa:</span> {report.follow_up_description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="flex gap-2">
            {job.status !== 'completed' && job.status !== 'cancelled' && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => handleStatusChange('in_progress')}
                  disabled={job.status === 'in_progress'}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Rozpocznij
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleStatusChange('completed')}
                  disabled={job.status === 'completed'}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Zakończ
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleStatusChange('cancelled')}
                  disabled={job.status === 'cancelled'}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Anuluj
                </Button>
              </>
            )}
          </div>
          <Button variant="default" onClick={() => onOpenChange(false)}>
            Zamknij
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}