import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { test, expect } from 'vitest';
import ProductCard from '../Pages/productCard';

test('renders product details and new arrival badge', () => {
  const product = {
    id: 20,
    name: 'Sneako Xtreme',
    price: 2999,
    category: 'Running',
    image: 'test.jpg',
  };
  render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>
  );
  expect(screen.getByText('Sneako Xtreme')).toBeInTheDocument();
  expect(screen.getByText('Running')).toBeInTheDocument();
  expect(screen.getByText('₹2,999')).toBeInTheDocument();
  expect(screen.getByText('NEW ARRIVAL')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /view details/i })).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute('href', '/product/20');
});

test('does not show new arrival badge for old product', () => {
  const product = {
    id: 5,
    name: 'Sneako Classic',
    price: 1999,
    category: 'Casual',
    image: 'classic.jpg',
  };
  render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>
  );
  expect(screen.queryByText('NEW ARRIVAL')).not.toBeInTheDocument();
});
