import { render, screen } from '@testing-library/react';
import { ServiceOrdersKanban } from './service-orders-kanban';
import { getServiceOrders, updateServiceOrder } from '@/lib/api';
import { createClient } from '@/lib/supabase';

// Mock the API and Supabase client
jest.mock('@/lib/api', () => ({
  getServiceOrders: jest.fn(),
  updateServiceOrder: jest.fn(),
}));
jest.mock('@/lib/supabase', () => ({
  createClient: jest.fn(() => ({
    channel: jest.fn(() => ({
      on: jest.fn(() => ({
        subscribe: jest.fn(),
      })),
      removeChannel: jest.fn(),
    })),
  })),
}));

describe('ServiceOrdersKanban', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    // Mock a successful API call with empty data
    (getServiceOrders as jest.Mock).mockResolvedValue([]);

    render(<ServiceOrdersKanban />);

    // Check if the component renders the search input
    expect(screen.getByPlaceholderText('Szukaj zlecenia...')).toBeInTheDocument();
  });

  // Add more tests here for fetching data, filtering, drag and drop, etc.
});