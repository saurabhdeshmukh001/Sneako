import { render, screen, waitFor } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');

import OrderTrackingAdmin from '../Admin/OrderTrackingAdmin';

test('renders Order Management heading and order row', async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes('/orders')) {
      return Promise.resolve({
        data: [
          {
            id: 1,
            userId: 10,
            orderDate: new Date().toISOString(),
            totalPrice: 2000,
            status: 'Processing',
          },
        ],
      });
    }
    if (url.includes('/users')) {
      return Promise.resolve({
        data: [
          { id: 10, name: 'Test User' },
        ],
      });
    }
    return Promise.resolve({ data: [] });
  });

  render(<OrderTrackingAdmin />);
  expect(await screen.findByText(/Order Management/i)).toBeInTheDocument();
  expect(await screen.findByText('Test User')).toBeInTheDocument();
  // Use regex and findAllByText for robustness
  const statusElements = await screen.findAllByText(/Processing/i);
  expect(statusElements.length).toBeGreaterThan(0);
});
