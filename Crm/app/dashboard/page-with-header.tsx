import type { Metadata } from "next"
import { ArrowUpRight, BarChart3, ClipboardList, Package, Users, Plus, Filter, LayoutDashboard } from "lucide-react"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { Skeleton } from "@/components/ui/skeleton"
import { createServerClient } from "@/lib/supabase/server"
import Link from "next/link"
import { DashboardClient } from "@/components/dashboard/dashboard-client"
import { PageHeader } from "@/components/ui/page-header"

export const metadata: Metadata = {
  title: "Dashboard - HVAC CRM ERP",
  description: "Zaawansowany dashboard dla systemu HVAC CRM ERP",
}

// Komponent dla karty z danymi i skeletonem podczas ładowania
function MetricCard({
  title,
  icon,
  value,
  change,
  isPositiveChange = true,
  isLoading = false,
  changeText
}: {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  change?: string | number;
  isPositiveChange?: boolean;
  isLoading?: boolean;
  changeText?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-24 mb-1" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {change && (
              <div className={`flex items-center text-xs ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
                {isPositiveChange ? (
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                ) : (
                  <ArrowUpRight className="mr-1 h-4 w-4 transform rotate-90" />
                )}
                <span>{changeText || `${change} w tym miesiącu`}</span>
              </div>
            )}
            {!change && (
              <p className="text-xs text-muted-foreground">Brak danych porównawczych</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Komponent do pobierania danych o aktywnych zleceniach
async function ActiveOrdersMetric() {
  try {
    const supabase = createServerClient();
    if (!supabase) {
      return <MetricCard
        title="Aktywne zlecenia"
        icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
        value="N/A"
        isLoading={false}
      />;
    }

    // Pobierz aktywne zlecenia (status != 'completed' i != 'cancelled')
    const { data: activeOrders, error: activeOrdersError } = await supabase
      .from('service_orders')
      .select('id, created_at')
      .not('status', 'in', '("completed","cancelled")')

    // Pobierz zlecenia utworzone w ciągu ostatnich 24 godzin
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const { data: newOrders, error: newOrdersError } = await supabase
      .from('service_orders')
      .select('id')
      .gt('created_at', yesterday.toISOString())
      .not('status', 'in', '("completed","cancelled")')

    if (activeOrdersError) {
      console.error('Error fetching active orders:', activeOrdersError);
      return <MetricCard
        title="Aktywne zlecenia"
        icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
        value="Błąd"
        isLoading={false}
      />;
    }

    return (
      <MetricCard
        title="Aktywne zlecenia"
        icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
        value={activeOrders?.length || 0}
        change={newOrders?.length || 0}
        isPositiveChange={true}
        changeText={`+${newOrders?.length || 0} od wczoraj`}
      />
    );
  } catch (error) {
    console.error('Error in ActiveOrdersMetric:', error);
    return <MetricCard
      title="Aktywne zlecenia"
      icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
      value="Błąd"
      isLoading={false}
    />;
  }
}

// Komponent do pobierania danych o klientach
async function CustomersMetric() {
  try {
    const supabase = createServerClient();
    if (!supabase) {
      return <MetricCard
        title="Klienci"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        value="N/A"
        isLoading={false}
      />;
    }

    // Pobierz wszystkich klientów
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('id, created_at')

    // Pobierz klientów utworzonych w tym miesiącu
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const { data: newCustomers, error: newCustomersError } = await supabase
      .from('customers')
      .select('id')
      .gt('created_at', firstDayOfMonth.toISOString())

    if (customersError) {
      console.error('Error fetching customers:', customersError);
      return <MetricCard
        title="Klienci"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        value="Błąd"
        isLoading={false}
      />;
    }

    return (
      <MetricCard
        title="Klienci"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        value={customers?.length || 0}
        change={newCustomers?.length || 0}
        isPositiveChange={true}
        changeText={`+${newCustomers?.length || 0} w tym miesiącu`}
      />
    );
  } catch (error) {
    console.error('Error in CustomersMetric:', error);
    return <MetricCard
      title="Klienci"
      icon={<Users className="h-4 w-4 text-muted-foreground" />}
      value="Błąd"
      isLoading={false}
    />;
  }
}

// Komponent do pobierania danych o urządzeniach
async function DevicesMetric() {
  try {
    const supabase = createServerClient();
    if (!supabase) {
      return <MetricCard
        title="Urządzenia"
        icon={<Package className="h-4 w-4 text-muted-foreground" />}
        value="N/A"
        isLoading={false}
      />;
    }

    // Pobierz wszystkie urządzenia
    const { data: devices, error: devicesError } = await supabase
      .from('devices')
      .select('id, created_at')

    // Pobierz urządzenia utworzone w tym miesiącu
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const { data: newDevices, error: newDevicesError } = await supabase
      .from('devices')
      .select('id')
      .gt('created_at', firstDayOfMonth.toISOString())

    if (devicesError) {
      console.error('Error fetching devices:', devicesError);
      return <MetricCard
        title="Urządzenia"
        icon={<Package className="h-4 w-4 text-muted-foreground" />}
        value="Błąd"
        isLoading={false}
      />;
    }

    return (
      <MetricCard
        title="Urządzenia"
        icon={<Package className="h-4 w-4 text-muted-foreground" />}
        value={devices?.length || 0}
        change={newDevices?.length || 0}
        isPositiveChange={true}
        changeText={`+${newDevices?.length || 0} w tym miesiącu`}
      />
    );
  } catch (error) {
    console.error('Error in DevicesMetric:', error);
    return <MetricCard
      title="Urządzenia"
      icon={<Package className="h-4 w-4 text-muted-foreground" />}
      value="Błąd"
      isLoading={false}
    />;
  }
}

// Komponent do pobierania danych o przychodach
async function RevenueMetric() {
  try {
    const supabase = createServerClient();
    if (!supabase) {
      return <MetricCard
        title="Przychód"
        icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        value="N/A"
        isLoading={false}
      />;
    }

    // Pobierz wszystkie zlecenia z kosztem
    const { data: orders, error: ordersError } = await supabase
      .from('service_orders')
      .select('cost')
      .not('cost', 'is', null)

    // Pobierz zlecenia z poprzedniego miesiąca
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const firstDayLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
    const lastDayLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);

    const { data: lastMonthOrders, error: lastMonthOrdersError } = await supabase
      .from('service_orders')
      .select('cost')
      .not('cost', 'is', null)
      .gte('created_at', firstDayLastMonth.toISOString())
      .lte('created_at', lastDayLastMonth.toISOString())

    if (ordersError) {
      console.error('Error fetching revenue data:', ordersError);
      return <MetricCard
        title="Przychód"
        icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        value="Błąd"
        isLoading={false}
      />;
    }

    // Oblicz całkowity przychód
    const totalRevenue = orders?.reduce((sum, order) => sum + (order.cost || 0), 0) || 0;
    const lastMonthRevenue = lastMonthOrders?.reduce((sum, order) => sum + (order.cost || 0), 0) || 0;

    // Oblicz procentową zmianę
    let percentChange = 0;
    let isPositiveChange = true;

    if (lastMonthRevenue > 0) {
      percentChange = ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
      isPositiveChange = percentChange >= 0;
      percentChange = Math.abs(percentChange);
    }

    // Formatuj przychód jako walutę
    const formattedRevenue = new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(totalRevenue);

    return (
      <MetricCard
        title="Przychód"
        icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        value={formattedRevenue}
        change={percentChange.toFixed(1)}
        isPositiveChange={isPositiveChange}
        changeText={`${isPositiveChange ? '+' : '-'}${percentChange.toFixed(1)}% niż w zeszłym miesiącu`}
      />
    );
  } catch (error) {
    console.error('Error in RevenueMetric:', error);
    return <MetricCard
      title="Przychód"
      icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
      value="Błąd"
      isLoading={false}
    />;
  }
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <NotificationCenter />
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PageHeader
          icon={LayoutDashboard}
          title="Dashboard"
          description="Przegląd kluczowych wskaźników i statystyk"
          breadcrumbs={[
            { href: "/dashboard", label: "Dashboard" }
          ]}
          actions={
            <>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtry
              </Button>
              <Button asChild>
                <Link href="/service-orders/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Nowe zlecenie
                </Link>
              </Button>
            </>
          }
        />

        {/* Kluczowe wskaźniki */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Suspense fallback={<MetricCard title="Aktywne zlecenia" icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />} value="" isLoading={true} />}>
            <ActiveOrdersMetric />
          </Suspense>

          <Suspense fallback={<MetricCard title="Klienci" icon={<Users className="h-4 w-4 text-muted-foreground" />} value="" isLoading={true} />}>
            <CustomersMetric />
          </Suspense>

          <Suspense fallback={<MetricCard title="Urządzenia" icon={<Package className="h-4 w-4 text-muted-foreground" />} value="" isLoading={true} />}>
            <DevicesMetric />
          </Suspense>

          <Suspense fallback={<MetricCard title="Przychód" icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />} value="" isLoading={true} />}>
            <RevenueMetric />
          </Suspense>
        </div>

        {/* Główne panele - używamy komponentu klienta z preferencjami użytkownika */}
        <DashboardClient />
      </div>
    </div>
  )
}