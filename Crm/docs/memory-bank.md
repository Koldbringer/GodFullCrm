# Memory Bank - HVAC CRM ERP System

## Dashboard Integration with Supabase

### Overview
The dashboard needs to be connected to real data from Supabase instead of using hardcoded mock data. This will provide real-time insights and metrics for the business.

### Dashboard Components to Update
1. **Main Dashboard Metrics** - Connect the top cards showing active orders, customers, devices, and revenue to actual data from Supabase
2. **AiInsightsPanel** - Connect to analytics data from Supabase
3. **BusinessMetrics** - Pull real financial and operational metrics
4. **IotMonitoringPanel** - Connect to device telemetry data
5. **TechnicianPerformance** - Show real technician performance metrics
6. **UpcomingTasks** - Display actual upcoming tasks and alerts
7. **AutomationStatusPanel** - Show real automation statuses

### Data Tables Required
- service_orders - For active orders count and revenue metrics
- customers - For customer count and growth metrics
- devices - For device count and status metrics
- technicians - For technician performance metrics
- device_telemetry - For IoT monitoring data
- tasks - For upcoming tasks
- notifications - For alerts
- automation_status - For automation status (may need to be created)

### Implementation Approach
1. Use server components for initial data loading
2. Implement proper error handling and fallback data
3. Add loading states with skeleton loaders
4. For real-time updates, use client components with Supabase subscriptions where needed

### Code Structure
- Keep data fetching logic separate from UI components
- Use TypeScript for type safety
- Follow the existing pattern of using createServerClient for server components
- Use proper error handling and fallback data

### Performance Considerations
- Use pagination for large datasets
- Implement caching where appropriate
- Optimize queries to fetch only needed data
- Consider using Supabase RLS (Row Level Security) in the future for multi-tenant security

