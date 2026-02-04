import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { Navbar } from './Navbar';

// Mock the router module to control menuRoutes
vi.mock('../../router', () => ({
  menuRoutes: [
    {
      path: '/defi',
      icon: 'fa-brands fa-ethereum',
      title: 'DeFi',
      component: null,
    },
    {
      path: '/about',
      icon: 'fa-solid fa-user',
      title: 'About',
      component: null,
    },
  ],
}));

// Mock ConnectButton from rainbowkit
vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: () => <div data-testid="connect-button">Connect Wallet</div>,
}));

describe('Navbar Component', () => {
  afterEach(cleanup);

  const renderNavbar = () => {
    return render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  };

  it('should render the navbar element', () => {
    renderNavbar();
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('should render all menu items from menuRoutes', () => {
    renderNavbar();
    expect(screen.getByText('DeFi')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('should render the ConnectButton', () => {
    renderNavbar();
    expect(screen.getByTestId('connect-button')).toBeInTheDocument();
  });

  it('should have correct navigation links', () => {
    renderNavbar();
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/defi');
    expect(links[1]).toHaveAttribute('href', '/about');
  });

  it('should have proper layout styling', () => {
    renderNavbar();
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass(
      'flex',
      'justify-between',
      'bg-teal-800',
      'bg-opacity-30',
      'p-2',
      'm-2',
      'rounded'
    );
  });

  it('should have a flex spacer between menu items and connect button', () => {
    const { container } = renderNavbar();
    const flexSpacer = container.querySelector('.flex-1');
    expect(flexSpacer).toBeInTheDocument();
  });

  it('should wrap ConnectButton in a styled container', () => {
    renderNavbar();
    const connectButton = screen.getByTestId('connect-button');
    const wrapper = connectButton.parentElement;
    expect(wrapper).toHaveClass('flex', 'items-center', 'shadow-md', 'rounded-md');
  });
});
