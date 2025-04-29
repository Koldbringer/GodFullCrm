'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, subDays, subMonths } from 'date-fns';
import { pl } from 'date-fns/locale';
import { CalendarIcon, Loader2, RefreshCw } from 'lucide-react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function ServiceAnalytics() {
  const [activeTab, setActiveTab] = useState('status');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('30days');
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  const [customerId, setCustomerId] = useState('');
  const [technicianId, setTechnicianId] = useState('');
  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  
  // Fetch initial data
  useEffect(() => {
    fetchCustomers();
    fetchTechnicians();
    fetchAnalytics();
  }, []);
  
  // Fetch analytics data when filters change
  useEffect(() => {
    fetchAnalytics();
  }, [activeTab, startDate, endDate, customerId, technicianId]);
  
  // Fetch customers
  const fetchCustomers = async () => {
    try {
      // This would be replaced with a real API call
      const mockCustomers = [
        { id: '1', name: 'Jan Kowalski' },
        { id: '2', name: 'Anna Nowak' },
        { id: '3', name: 'Firma XYZ Sp. z o.o.' }
      ];
      setCustomers(mockCustomers);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };
  
  // Fetch technicians
  const fetchTechnicians = async () => {
    try {
      // This would be replaced with a real API call
      const mockTechnicians = [
        { id: '1', name: 'Adam Serwisant' },
        { id: '2', name: 'Piotr Technik' },
        { id: '3', name: 'Marek Instalator' }
      ];
      setTechnicians(mockTechnicians);
    } catch (err) {
      console.error('Error fetching technicians:', err);
    }
  };
  
  // Fetch analytics data
  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      params.append('reportType', activeTab);
      params.append('startDate', startDate.toISOString());
      params.append('endDate', endDate.toISOString());
      
      if (customerId) {
        params.append('customerId', customerId);
      }
      
      if (technicianId) {
        params.append('technicianId', technicianId);
      }
      
      const response = await fetch(`/api/service-management/analytics?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching analytics: ${response.status}`);
      }
      
      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle date range change
  const handleDateRangeChange = (range) => {
    setDateRange(range);
    
    const now = new Date();
    let start;
    
    switch (range) {
      case '7days':
        start = subDays(now, 7);
        break;
      case '30days':
        start = subDays(now, 30);
        break;
      case '90days':
        start = subDays(now, 90);
        break;
      case '6months':
        start = subMonths(now, 6);
        break;
      case '1year':
        start = subMonths(now, 12);
        break;
      case 'custom':
        // Don't change dates for custom range
        return;
      default:
        start = subDays(now, 30);
    }
    
    setStartDate(start);
    setEndDate(now);
  };
  
  // Prepare chart data based on analytics data and active tab
  const getChartData = () => {
    if (!analyticsData) return null;
    
    switch (activeTab) {
      case 'service_status_summary':
        return {
          labels: analyticsData.map(item => {
            const statusLabels = {
              scheduled: 'Zaplanowane',
              in_progress: 'W trakcie',
              completed: 'Zakończone',
              cancelled: 'Anulowane'
            };
            return statusLabels[item.status] || item.status;
          }),
          datasets: [
            {
              label: 'Liczba zleceń',
              data: analyticsData.map(item => item.count),
              backgroundColor: [
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 99, 132, 0.6)'
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)'
              ],
              borderWidth: 1
            }
          ]
        };
        
      case 'service_by_type':
        return {
          labels: analyticsData.map(item => {
            const typeLabels = {
              inspection: 'Oględziny',
              maintenance: 'Konserwacja',
              repair: 'Naprawa',
              installation: 'Instalacja'
            };
            return typeLabels[item.report_type] || item.report_type;
          }),
          datasets: [
            {
              label: 'Liczba zleceń',
              data: analyticsData.map(item => item.count),
              backgroundColor: [
                'rgba(54, 162, 235, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(255, 159, 64, 0.6)'
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }
          ]
        };
        
      case 'service_by_technician':
        return {
          labels: analyticsData.map(item => item.technician_name),
          datasets: [
            {
              label: 'Liczba zleceń',
              data: analyticsData.map(item => item.count),
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }
          ]
        };
        
      case 'service_by_customer':
        return {
          labels: analyticsData.map(item => item.customer_name),
          datasets: [
            {
              label: 'Liczba zleceń',
              data: analyticsData.map(item => item.count),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        };
        
      default:
        return null;
    }
  };
  
  // Get chart component based on active tab
  const getChartComponent = () => {
    const chartData = getChartData();
    if (!chartData) return null;
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: getChartTitle()
        }
      }
    };
    
    switch (activeTab) {
      case 'service_status_summary':
      case 'service_by_type':
        return <Pie data={chartData} options={options} />;
        
      case 'service_by_technician':
      case 'service_by_customer':
        return <Bar data={chartData} options={options} />;
        
      default:
        return null;
    }
  };
  
  // Get chart title based on active tab
  const getChartTitle = () => {
    switch (activeTab) {
      case 'service_status_summary':
        return 'Podsumowanie statusów zleceń';
      case 'service_by_type':
        return 'Zlecenia według typu';
      case 'service_by_technician':
        return 'Zlecenia według technika';
      case 'service_by_customer':
        return 'Zlecenia według klienta';
      default:
        return '';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="service_status_summary">Status</TabsTrigger>
            <TabsTrigger value="service_by_type">Typ</TabsTrigger>
            <TabsTrigger value="service_by_technician">Technicy</TabsTrigger>
            <TabsTrigger value="service_by_customer">Klienci</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-wrap gap-2">
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Zakres dat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Ostatnie 7 dni</SelectItem>
              <SelectItem value="30days">Ostatnie 30 dni</SelectItem>
              <SelectItem value="90days">Ostatnie 90 dni</SelectItem>
              <SelectItem value="6months">Ostatnie 6 miesięcy</SelectItem>
              <SelectItem value="1year">Ostatni rok</SelectItem>
              <SelectItem value="custom">Niestandardowy</SelectItem>
            </SelectContent>
          </Select>
          
          {dateRange === 'custom' && (
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] pl-3 text-left font-normal">
                    {format(startDate, 'PPP', { locale: pl })}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] pl-3 text-left font-normal">
                    {format(endDate, 'PPP', { locale: pl })}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
          
          <Select value={customerId} onValueChange={setCustomerId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Klient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Wszyscy klienci</SelectItem>
              {customers.map(customer => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={technicianId} onValueChange={setTechnicianId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Technik" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Wszyscy technicy</SelectItem>
              {technicians.map(technician => (
                <SelectItem key={technician.id} value={technician.id}>
                  {technician.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={fetchAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Odśwież
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Wszystkie zlecenia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : '124'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Zakończone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : '98'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">W trakcie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : '18'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Zaplanowane</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : '8'}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{getChartTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Ładowanie danych...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Błąd: {error}
            </div>
          ) : analyticsData && analyticsData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Brak danych dla wybranych filtrów.
            </div>
          ) : (
            <div className="h-[400px]">
              {getChartComponent()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}