import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { afterEach, describe, it, expect } from 'vitest';
import { NavbarMenuItem } from './NavbarMenuItem';

describe('NavbarMenuItem Component', () => {
  afterEach(cleanup);

  const renderWithRouter = (
    ui: React.ReactElement,
    { route = '/' }: { route?: string } = {}
  ) => {
    return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
  };

  it('should render the title', () => {
    renderWithRouter(<NavbarMenuItem path="/defi" title="DeFi" />);
    expect(screen.getByText('DeFi')).toBeInTheDocument();
  });

  it('should render the icon when provided', () => {
    const { container } = renderWithRouter(
      <NavbarMenuItem path="/defi" icon="fa-brands fa-ethereum" title="DeFi" />
    );
    const icon = container.querySelector('i');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('fa-brands', 'fa-ethereum');
  });

  it('should render without icon when not provided', () => {
    const { container } = renderWithRouter(
      <NavbarMenuItem path="/defi" title="DeFi" />
    );
    const icon = container.querySelector('i');
    expect(icon).toBeInTheDocument();
    expect(icon).not.toHaveClass('fa-brands');
  });

  it('should navigate to the correct path', () => {
    renderWithRouter(<NavbarMenuItem path="/about" title="About" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/about');
  });

  it('should apply active styles when on the matching route', () => {
    renderWithRouter(
      <Routes>
        <Route
          path="/defi"
          element={<NavbarMenuItem path="/defi" title="DeFi" />}
        />
      </Routes>,
      { route: '/defi' }
    );

    const link = screen.getByRole('link');
    expect(link).toHaveClass('bg-teal-800', 'text-gray-100');
  });

  it('should apply inactive styles when not on the matching route', () => {
    renderWithRouter(
      <>
        <NavbarMenuItem path="/defi" title="DeFi" />
        <Routes>
          <Route path="/about" element={<div>About Page</div>} />
        </Routes>
      </>,
      { route: '/about' }
    );

    const link = screen.getByRole('link');
    expect(link).toHaveClass('text-black');
    expect(link).toHaveClass('hover:bg-teal-800', 'hover:text-gray-100');
  });

  it('should have proper base styling classes', () => {
    renderWithRouter(<NavbarMenuItem path="/defi" title="DeFi" />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass(
      'flex',
      'justify-center',
      'items-center',
      'rounded-md',
      'p-2',
      'transition-colors',
      'mr-2',
      'shadow-md'
    );
  });

  it('should render title with proper typography classes', () => {
    renderWithRouter(<NavbarMenuItem path="/defi" title="DeFi" />);
    const title = screen.getByText('DeFi');
    expect(title).toHaveClass('text-lg', 'font-semibold');
  });

  it('should render icon with proper styling classes', () => {
    const { container } = renderWithRouter(
      <NavbarMenuItem path="/defi" icon="fa-brands fa-ethereum" title="DeFi" />
    );
    const icon = container.querySelector('i');
    expect(icon).toHaveClass('text-2xl', 'mr-4', 'text-teal-500');
  });
});
