import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { handleSupabaseError } from '@/lib/supabase/error-handler'

/**
 * GET handler for dashboard statistics
 * Fetches dashboard statistics based on the provided time range
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d' // Default to 30 days
    
    // Create Supabase client
    const supabase = await createServerClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Failed to create Supabase client' },
        { status: 500 }
      )
    }
    
    // Determine date range based on timeRange parameter
    const now = new Date()
    let startDate = new Date()
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      case 'all':
        startDate = new Date(0) // Beginning of time
        break
      default:
        startDate.setDate(now.getDate() - 30) // Default to 30 days
    }
    
    // Format dates for query
    const startDateStr = startDate.toISOString()
    const endDateStr = now.toISOString()
    
    // Fetch KPI data
    const [
      revenueResult,
      ordersResult,
      customersResult,
      completionRateResult,
      satisfactionResult
    ] = await Promise.all([
      // Total revenue
      supabase
        .from('invoices')
        .select('total_amount')
        .gte('created_at', startDateStr)
        .lte('created_at', endDateStr),
      
      // Total orders
      supabase
        .from('service_orders')
        .select('id', { count: 'exact' })
        .gte('created_at', startDateStr)
        .lte('created_at', endDateStr),
      
      // New customers
      supabase
        .from('customers')
        .select('id', { count: 'exact' })
        .gte('created_at', startDateStr)
        .lte('created_at', endDateStr),
      
      // Completion rate
      supabase
        .from('service_orders')
        .select('status')
        .gte('created_at', startDateStr)
        .lte('created_at', endDateStr),
      
      // Customer satisfaction
      supabase
        .from('service_reports')
        .select('customer_satisfaction')
        .gte('created_at', startDateStr)
        .lte('created_at', endDateStr)
    ])
    
    // Check for errors
    if (revenueResult.error) throw revenueResult.error
    if (ordersResult.error) throw ordersResult.error
    if (customersResult.error) throw customersResult.error
    if (completionRateResult.error) throw completionRateResult.error
    if (satisfactionResult.error) throw satisfactionResult.error
    
    // Calculate KPIs
    const totalRevenue = revenueResult.data.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0)
    const totalOrders = ordersResult.count || 0
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    
    // Calculate completion rate
    const completedOrders = completionRateResult.data.filter(order => order.status === 'completed').length
    const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
    
    // Calculate average customer satisfaction
    const satisfactionValues = satisfactionResult.data
      .map(report => report.customer_satisfaction)
      .filter(Boolean) as number[]
    const averageSatisfaction = satisfactionValues.length > 0
      ? satisfactionValues.reduce((sum, value) => sum + value, 0) / satisfactionValues.length
      : 0
    
    // Fetch revenue by month
    const revenueByMonthResult = await supabase.rpc('get_revenue_by_month', {
      start_date: startDateStr,
      end_date: endDateStr
    })
    
    if (revenueByMonthResult.error) throw revenueByMonthResult.error
    
    // Fetch orders by type
    const ordersByTypeResult = await supabase
      .from('service_orders')
      .select('service_type, id')
      .gte('created_at', startDateStr)
      .lte('created_at', endDateStr)
    
    if (ordersByTypeResult.error) throw ordersByTypeResult.error
    
    // Process orders by type
    const ordersByType = ordersByTypeResult.data.reduce((acc, order) => {
      const type = order.service_type || 'other'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const ordersByTypeArray = Object.entries(ordersByType).map(([type, value]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1), // Capitalize first letter
      value
    }))
    
    // Fetch top technicians
    const topTechniciansResult = await supabase.rpc('get_top_technicians', {
      start_date: startDateStr,
      end_date: endDateStr,
      limit_count: 5
    })
    
    if (topTechniciansResult.error) throw topTechniciansResult.error
    
    // Fetch customer acquisition data
    const customerAcquisitionResult = await supabase.rpc('get_customer_acquisition', {
      start_date: startDateStr,
      end_date: endDateStr
    })
    
    if (customerAcquisitionResult.error) throw customerAcquisitionResult.error
    
    // Construct response
    const response = {
      kpis: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        completionRate,
        customerSatisfaction: averageSatisfaction
      },
      revenueByMonth: revenueByMonthResult.data || [],
      ordersByType: ordersByTypeArray,
      topTechnicians: topTechniciansResult.data || [],
      customerAcquisition: customerAcquisitionResult.data || []
    }
    
    return NextResponse.json(response)
  } catch (error) {
    const structuredError = handleSupabaseError(error, 'dashboard/stats')
    console.error('Error fetching dashboard stats:', structuredError)
    
    return NextResponse.json(
      { error: structuredError.message },
      { status: 500 }
    )
  }
}
