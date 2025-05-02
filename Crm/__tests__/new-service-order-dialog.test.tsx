import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NewServiceOrderDialog } from '@/components/service-orders/new-service-order-dialog'
import * as api from '@/lib/api'

// Mock the API functions
jest.mock('@/lib/api', () => ({
  getCustomers: jest.fn().mockResolvedValue({ data: [{ id: 'c1', name: 'Test Customer' }] }),
  getSites: jest.fn().mockResolvedValue([{ id: 's1', name: 'Test Site', customer_id: 'c1' }]),
  getDevices: jest.fn().mockResolvedValue([{ id: 'd1', model: 'Test Device', type: 'AC', site_id: 's1' }]),
  getTechnicians: jest.fn().mockResolvedValue([{ id: 't1', name: 'Test Technician' }]),
  createServiceOrder: jest.fn().mockResolvedValue({ id: 'so1', title: 'Test Order' }),
}))

// Mock the toast function
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('NewServiceOrderDialog', () => {
  it('renders the dialog when open is true', () => {
    render(<NewServiceOrderDialog open={true} onOpenChange={() => {}} />)
    
    expect(screen.getByText('Nowe zlecenie serwisowe')).toBeInTheDocument()
  })
  
  it('does not render the dialog when open is false', () => {
    render(<NewServiceOrderDialog open={false} onOpenChange={() => {}} />)
    
    expect(screen.queryByText('Nowe zlecenie serwisowe')).not.toBeInTheDocument()
  })
  
  it('loads data when opened', async () => {
    render(<NewServiceOrderDialog open={true} onOpenChange={() => {}} />)
    
    await waitFor(() => {
      expect(api.getCustomers).toHaveBeenCalled()
      expect(api.getSites).toHaveBeenCalled()
      expect(api.getDevices).toHaveBeenCalled()
      expect(api.getTechnicians).toHaveBeenCalled()
    })
  })
  
  it('submits the form with valid data', async () => {
    const onOpenChangeMock = jest.fn()
    render(<NewServiceOrderDialog open={true} onOpenChange={onOpenChangeMock} />)
    
    // Wait for data to load
    await waitFor(() => {
      expect(api.getCustomers).toHaveBeenCalled()
    })
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Tytuł zlecenia/i), {
      target: { value: 'Test Service Order' },
    })
    
    // Submit the form
    fireEvent.click(screen.getByText('Utwórz zlecenie'))
    
    // Check if the API was called
    await waitFor(() => {
      expect(api.createServiceOrder).toHaveBeenCalled()
      expect(onOpenChangeMock).toHaveBeenCalledWith(false)
    })
  })
})
