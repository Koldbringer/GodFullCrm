'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Loader2 
} from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import ServiceJobDetailsModal from './ServiceJobDetailsModal';
import CreateServiceReportModal from './CreateServiceReportModal';

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

export default function ServiceJobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  
  // Fetch service jobs
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let url = '/api/service-management/jobs';
        const params = new URLSearchParams();
        
        if (statusFilter !== 'all') {
          params.append('status', statusFilter);
        }
        
        if (priorityFilter !== 'all') {
          params.append('priority', priorityFilter);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Error fetching service jobs: ${response.status}`);
        }
        
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        console.error('Error fetching service jobs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [statusFilter, priorityFilter]);
  
  // Filter jobs by search query
  const filteredJobs = jobs.filter(job => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.customer_name.toLowerCase().includes(query) ||
      job.technician_name.toLowerCase().includes(query) ||
      job.device_name.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query)
    );
  });
  
  // Handle job deletion
  const handleDeleteJob = async (jobId) => {
    if (!confirm('Czy na pewno chcesz usunąć to zlecenie serwisowe?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/service-management/jobs?id=${jobId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Error deleting service job: ${response.status}`);
      }
      
      // Remove the deleted job from the list
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (err) {
      console.error('Error deleting service job:', err);
      alert(`Błąd podczas usuwania zlecenia: ${err.message}`);
    }
  };
  
  // Handle job status update
  const handleStatusUpdate = async (jobId, newStatus) => {
    try {
      const response = await fetch('/api/service-management/jobs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: jobId,
          status: newStatus
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error updating service job status: ${response.status}`);
      }
      
      const updatedJob = await response.json();
      
      // Update the job in the list
      setJobs(jobs.map(job => job.id === jobId ? updatedJob : job));
    } catch (err) {
      console.error('Error updating service job status:', err);
      alert(`Błąd podczas aktualizacji statusu: ${err.message}`);
    }
  };
  
  // Open job details modal
  const openJobDetails = (job) => {
    setSelectedJob(job);
    setDetailsModalOpen(true);
  };
  
  // Open create report modal
  const openCreateReport = (job) => {
    setSelectedJob(job);
    setReportModalOpen(true);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Ładowanie zleceń serwisowych...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Błąd!</p>
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Szukaj zleceń..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie statusy</SelectItem>
              <SelectItem value="scheduled">Zaplanowane</SelectItem>
              <SelectItem value="in_progress">W trakcie</SelectItem>
              <SelectItem value="completed">Zakończone</SelectItem>
              <SelectItem value="cancelled">Anulowane</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px]">
              <AlertTriangle className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Priorytet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie priorytety</SelectItem>
              <SelectItem value="low">Niski</SelectItem>
              <SelectItem value="medium">Średni</SelectItem>
              <SelectItem value="high">Wysoki</SelectItem>
              <SelectItem value="critical">Krytyczny</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredJobs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nie znaleziono zleceń serwisowych spełniających kryteria wyszukiwania.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tytuł</TableHead>
                <TableHead>Klient</TableHead>
                <TableHead>Technik</TableHead>
                <TableHead>Urządzenie</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priorytet</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.customer_name}</TableCell>
                  <TableCell>{job.technician_name}</TableCell>
                  <TableCell>{job.device_name}</TableCell>
                  <TableCell>
                    {format(new Date(job.scheduled_date), 'dd MMM yyyy', { locale: pl })}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[job.status]}>
                      {statusLabels[job.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={priorityColors[job.priority]}>
                      {priorityLabels[job.priority]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openJobDetails(job)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {job.status !== 'completed' && job.status !== 'cancelled' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleStatusUpdate(job.id, 'in_progress')}
                            disabled={job.status === 'in_progress'}
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openCreateReport(job)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {selectedJob && (
        <>
          <ServiceJobDetailsModal 
            job={selectedJob}
            open={detailsModalOpen}
            onOpenChange={setDetailsModalOpen}
            onStatusChange={(status) => handleStatusUpdate(selectedJob.id, status)}
          />
          
          <CreateServiceReportModal 
            job={selectedJob}
            open={reportModalOpen}
            onOpenChange={setReportModalOpen}
            onReportCreated={() => {
              // Refresh the jobs list after report creation
              setReportModalOpen(false);
              const updatedJob = { ...selectedJob, status: 'completed' };
              setJobs(jobs.map(job => job.id === selectedJob.id ? updatedJob : job));
            }}
          />
        </>
      )}
    </div>
  );
}