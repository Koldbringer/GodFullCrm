import { render, screen, waitFor } from '@testing-library/react'
import { ServiceOrderDetailsDialog } from '@/components/service-orders/service-order-details-dialog'
import * as api from '@/lib/api'

// Mock the API functions
jest.mock('@/lib/api', () => ({
  getServiceOrderById: jest.fn().mockResolvedValue({
    id: 'so1',
    title: 'Test Service Order',
    description: 'This is a test service order',
    status: 'in_progress',
    priority: 'medium',
    service_type: 'maintenance',
    created_at: '2023-01-01T12:00:00Z',
    updated_at: '2023-01-02T12:00:00Z',
    scheduled_start: '2023-01-10T10:00:00Z',
    customers: {
      name: 'Test Customer',
    },
    sites: {
      name: 'Test Site',
    },
    devices: {
      model: 'Test Device',
      type: 'AC',
    },
    technicians: {
      name: 'Test Technician',
    },
  }),
}))

describe('ServiceOrderDetailsDialog', () => {
  it('renders loading state initially', () => {
    render(<ServiceOrderDetailsDialog open={true} onOpenChange={() => {}} orderId="so1" />)
    
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
  
  it('loads and displays service order details', async () => {
    render(<ServiceOrderDetailsDialog open={true} onOpenChange={() => {}} orderId="so1" />)
    
    await waitFor(() => {
      expect(api.getServiceOrderById).toHaveBeenCalledWith('so1')
      expect(screen.getByText('Test Service Order')).toBeInTheDocument()
      expect(screen.getByText('Test Customer')).toBeInTheDocument()
      expect(screen.getByText('Test Site')).toBeInTheDocument()
      expect(screen.getByText(/Test Device/)).toBeInTheDocument()
      expect(screen.getByText('Test Technician')).toBeInTheDocument()
    })
  })
  
  it('does not fetch data when dialog is closed', () => {
    render(<ServiceOrderDetailsDialog open={false} onOpenChange={() => {}} orderId="so1" />)
    
    expect(api.getServiceOrderById).not.toHaveBeenCalled()
  })
  
  it('shows error state when service order is not found', async () => {
    // Override the mock for this test
    (api.getServiceOrderById as jest.Mock).mockResolvedValueOnce(null)
    
    render(<ServiceOrderDetailsDialog open={true} onOpenChange={() => {}} orderId="invalid-id" />)
    
    await waitFor(() => {
      expect(screen.getByText('Nie znaleziono zlecenia')).toBeInTheDocument()
    })
  })
})
