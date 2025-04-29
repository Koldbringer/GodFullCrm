'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wrench, Clipboard, Calendar, BarChart2, Settings } from 'lucide-react';
import ServiceJobsList from '@/components/service-management/ServiceJobsList';
import DevicesList from '@/components/service-management/DevicesList';
import MaintenanceSchedule from '@/components/service-management/MaintenanceSchedule';
import ServiceReports from '@/components/service-management/ServiceReports';
import ServiceAnalytics from '@/components/service-management/ServiceAnalytics';
import CreateServiceJobModal from '@/components/service-management/CreateServiceJobModal';
import CreateDeviceModal from '@/components/service-management/CreateDeviceModal';

export default function ServiceManagementPage() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [createJobModalOpen, setCreateJobModalOpen] = useState(false);
  const [createDeviceModalOpen, setCreateDeviceModalOpen] = useState(false);
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Zarządzanie serwisem</h1>
        <div className="flex gap-2">
          {activeTab === 'jobs' && (
            <Button onClick={() => setCreateJobModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nowe zlecenie
            </Button>
          )}
          {activeTab === 'devices' && (
            <Button onClick={() => setCreateDeviceModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nowe urządzenie
            </Button>
          )}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="jobs" className="flex items-center">
            <Wrench className="mr-2 h-4 w-4" />
            Zlecenia
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Urządzenia
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Harmonogram konserwacji
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center">
            <Clipboard className="mr-2 h-4 w-4" />
            Raporty serwisowe
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <BarChart2 className="mr-2 h-4 w-4" />
            Analityka
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Zlecenia serwisowe</CardTitle>
              <CardDescription>
                Zarządzaj zleceniami serwisowymi, przydzielaj techników i śledź postęp prac.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceJobsList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Urządzenia</CardTitle>
              <CardDescription>
                Zarządzaj urządzeniami klientów, śledź historię serwisową i planuj konserwacje.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DevicesList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Harmonogram konserwacji</CardTitle>
              <CardDescription>
                Planuj regularne konserwacje urządzeń i śledź terminy przeglądów.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MaintenanceSchedule />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Raporty serwisowe</CardTitle>
              <CardDescription>
                Przeglądaj i twórz raporty z wykonanych prac serwisowych.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceReports />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analityka serwisowa</CardTitle>
              <CardDescription>
                Analizuj dane serwisowe, śledź wydajność techników i identyfikuj trendy.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceAnalytics />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <CreateServiceJobModal 
        open={createJobModalOpen} 
        onOpenChange={setCreateJobModalOpen} 
      />
      
      <CreateDeviceModal 
        open={createDeviceModalOpen} 
        onOpenChange={setCreateDeviceModalOpen} 
      />
    </div>
  );
}