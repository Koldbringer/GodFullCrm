import { NextResponse } from 'next/server'
import { addSampleData, checkSampleData } from '@/lib/sample-data'

export async function GET() {
  try {
    // Check if sample data already exists
    const { exists, error: checkError } = await checkSampleData()
    
    if (checkError) {
      return NextResponse.json({ success: false, error: checkError.message }, { status: 500 })
    }
    
    if (exists) {
      return NextResponse.json({ success: true, message: 'Sample data already exists' })
    }
    
    // Add sample data
    const result = await addSampleData()
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Sample data added successfully',
      data: {
        customersCount: result.data.customers.length,
        sitesCount: result.data.sites.length,
        techniciansCount: result.data.technicians.length,
        ordersCount: result.data.orders.length
      }
    })
  } catch (error: any) {
    console.error('Error in sample data API route:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
