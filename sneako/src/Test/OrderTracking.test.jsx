import { render, screen } from '@testing-library/react';
import axios from 'axios';
import { test, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ orderId: '1' }),
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
  };
});
vi.mock('axios');

import OrderTracking from '../Pages/OrderTracking';

test('renders Order Tracking heading', async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes('/orders/')) {
      return Promise.resolve({
        data: {
          id: 1,
          trackingNumber: 'ABC123',
          orderDate: new Date().toISOString(),
          status: 'Processing',
          products: [{ productId: 1, name: 'Test Shoe', quantity: 1, price: 1000 }],
          totalPrice: 1000,
        }
      });
    }
    if (url.includes('/products/')) {
      return Promise.resolve({
        data: { id: 1, image: 'test.jpg', name: 'Test Shoe' }
      });
    }
    return Promise.resolve({ data: {} });
  });

  render(
    <MemoryRouter>
      <OrderTracking />
    </MemoryRouter>
  );
  expect(await screen.findByText(/Order Tracking/i)).toBeInTheDocument();
});