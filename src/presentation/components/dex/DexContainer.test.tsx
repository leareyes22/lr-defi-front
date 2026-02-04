import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import dexReducer from '../../../core/store/dex/dexSlice';

// Mock the core module to avoid WagmiConfig import which requires getDefaultConfig
vi.mock('../../../core', () => ({
  AssetOptions: [
    {
      address: '0x1D70D57ccD2798323232B2dD027B3aBcA5C00091',
      decimals: 18,
      label: 'DAI',
    },
    {
      address: '0xC891481A0AaC630F4D89744ccD2C7D2C4215FD47',
      decimals: 6,
      label: 'USDC',
    },
  ],
  config: {},
}));

import { DexContainer } from './DexContainer';

// Mock Material Tailwind components
vi.mock('@material-tailwind/react', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    loading,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    [key: string]: unknown;
  }) => (
    <button onClick={onClick} disabled={disabled} data-loading={loading} {...props}>
      {children}
    </button>
  ),
  Card: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
  ),
  Input: ({
    label,
    value,
    onChange,
    error,
    ...props
  }: {
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
    [key: string]: unknown;
  }) => (
    <input
      aria-label={label}
      value={value}
      onChange={onChange}
      data-error={error}
      {...props}
    />
  ),
  Typography: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock wagmi hooks
const mockWriteContractAsync = vi.fn();
vi.mock('wagmi', () => ({
  useAccount: vi.fn(() => ({
    address: '0x1234567890123456789012345678901234567890',
    chainId: 1,
  })),
  useChainId: vi.fn(() => 1),
  useReadContract: vi.fn(() => ({
    data: BigInt('1000000000000000000'), // 1 token with 18 decimals
  })),
  useWaitForTransactionReceipt: vi.fn(() => ({
    isLoading: false,
  })),
  useWriteContract: vi.fn(() => ({
    writeContractAsync: mockWriteContractAsync,
  })),
}));

// Mock rainbowkit
const mockAddRecentTransaction = vi.fn();
vi.mock('@rainbow-me/rainbowkit', () => ({
  useAddRecentTransaction: () => mockAddRecentTransaction,
}));

// Mock TokensSelect component
vi.mock('../select/TokensSelect', () => ({
  TokensSelect: ({
    label,
    value,
    onChange,
    options,
  }: {
    label: string;
    value: string;
    onChange: (value?: string) => void;
    options: Array<{ address: string; label: string }>;
  }) => (
    <select
      data-testid="tokens-select"
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options?.map((opt) => (
        <option key={opt.address} value={opt.address}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

// Mock Loader component
vi.mock('../loader/Loader', () => ({
  Loader: ({ txIsLoading }: { txIsLoading: boolean }) =>
    txIsLoading ? <div data-testid="loader">Loading...</div> : null,
}));

// Mock ErrorMessage component
vi.mock('../error/ErrorMessage', () => ({
  ErrorMessage: ({ error }: { error?: string }) =>
    error ? <div data-testid="error-message">{error}</div> : null,
}));

describe('DexContainer Component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const createStore = (preloadedState = {}) =>
    configureStore({
      reducer: { dex: dexReducer },
      preloadedState,
    });

  const renderDexContainer = (preloadedState = {}) => {
    const store = createStore(preloadedState);
    return {
      store,
      ...render(
        <Provider store={store}>
          <DexContainer />
        </Provider>
      ),
    };
  };

  describe('rendering', () => {
    it('should render the DeFi Page title', () => {
      renderDexContainer();
      expect(screen.getByText('DeFi Page')).toBeInTheDocument();
    });

    it('should render the destination address input', () => {
      renderDexContainer();
      expect(screen.getByLabelText('Destination Address')).toBeInTheDocument();
    });

    it('should render the amount input', () => {
      renderDexContainer();
      expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    });

    it('should render the token select', () => {
      renderDexContainer();
      expect(screen.getByTestId('tokens-select')).toBeInTheDocument();
    });

    it('should render Mint, Approve, and Transfer buttons', () => {
      renderDexContainer();
      expect(screen.getByRole('button', { name: /mint/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /approve/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /transfer/i })).toBeInTheDocument();
    });

    it('should display balance and allowance', () => {
      renderDexContainer();
      expect(screen.getByText(/Balance:/)).toBeInTheDocument();
      expect(screen.getByText(/Allowance:/)).toBeInTheDocument();
    });
  });

  describe('form interactions', () => {
    it('should update destination address on input change', () => {
      const { store } = renderDexContainer();
      const input = screen.getByLabelText('Destination Address');

      fireEvent.change(input, {
        target: { value: '0xabcdef1234567890abcdef1234567890abcdef12' },
      });

      expect(store.getState().dex.destinationAddress).toBe(
        '0xabcdef1234567890abcdef1234567890abcdef12'
      );
    });

    it('should update amount on input change', () => {
      const { store } = renderDexContainer();
      const input = screen.getByLabelText('Amount') as HTMLInputElement;

      // Simulate actual browser behavior - set value and valueAsNumber
      Object.defineProperty(input, 'valueAsNumber', { value: 100, writable: true });
      fireEvent.change(input, { target: { value: '100' } });

      expect(store.getState().dex.amount).toBe(100);
    });

    it('should clear error when destination address changes', () => {
      const { store } = renderDexContainer({
        dex: {
          destinationAddress: '',
          token: { address: '0x', decimals: 0, label: '' },
          amount: undefined,
          errors: { destinationAddress: 'Invalid address' },
          isLoading: { approve: false, transfer: false },
          transactionHash: '0x',
        },
      });

      const input = screen.getByLabelText('Destination Address');
      fireEvent.change(input, { target: { value: '0x123' } });

      expect(store.getState().dex.errors['destinationAddress']).toBeUndefined();
    });

    it('should clear error when amount changes', () => {
      const { store } = renderDexContainer({
        dex: {
          destinationAddress: '',
          token: { address: '0x', decimals: 0, label: '' },
          amount: undefined,
          errors: { amount: 'Amount must be greater than zero' },
          isLoading: { approve: false, transfer: false },
          transactionHash: '0x',
        },
      });

      const input = screen.getByLabelText('Amount') as HTMLInputElement;
      Object.defineProperty(input, 'valueAsNumber', { value: 50, writable: true });
      fireEvent.change(input, { target: { value: '50' } });

      expect(store.getState().dex.errors['amount']).toBeUndefined();
    });
  });

  describe('token selection', () => {
    it('should update token when selection changes', () => {
      const { store } = renderDexContainer();
      const select = screen.getByTestId('tokens-select');

      fireEvent.change(select, {
        target: { value: '0x1D70D57ccD2798323232B2dD027B3aBcA5C00091' },
      });

      const state = store.getState().dex;
      expect(state.token.address).toBe(
        '0x1D70D57ccD2798323232B2dD027B3aBcA5C00091'
      );
      expect(state.token.label).toBe('DAI');
      expect(state.token.decimals).toBe(18);
    });
  });

  describe('validation', () => {
    it('should show error when trying to approve with invalid address', async () => {
      const { store } = renderDexContainer({
        dex: {
          destinationAddress: 'invalid-address',
          token: {
            address: '0x1D70D57ccD2798323232B2dD027B3aBcA5C00091',
            decimals: 18,
            label: 'DAI',
          },
          amount: 100,
          errors: {},
          isLoading: { approve: false, transfer: false },
          transactionHash: '0x',
        },
      });

      const approveButton = screen.getByRole('button', { name: /approve/i });
      fireEvent.click(approveButton);

      // Wait for state update
      await vi.waitFor(() => {
        expect(store.getState().dex.errors['destinationAddress']).toBe(
          'Destination address must be a valid address.'
        );
      });
    });

    it('should show error when trying to approve with zero amount', async () => {
      const { store } = renderDexContainer({
        dex: {
          destinationAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
          token: {
            address: '0x1D70D57ccD2798323232B2dD027B3aBcA5C00091',
            decimals: 18,
            label: 'DAI',
          },
          amount: 0,
          errors: {},
          isLoading: { approve: false, transfer: false },
          transactionHash: '0x',
        },
      });

      const approveButton = screen.getByRole('button', { name: /approve/i });
      fireEvent.click(approveButton);

      await vi.waitFor(() => {
        expect(store.getState().dex.errors['amount']).toBe(
          'Amount must be greater than zero.'
        );
      });
    });

    it('should show error when transfer amount exceeds balance', async () => {
      // The transfer function validates in order: address, amount > 0, allowance, balance
      // With the default mock returning 1 token (1e18), requesting 100 tokens will fail balance check
      const { store } = renderDexContainer({
        dex: {
          destinationAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
          token: {
            address: '0x1D70D57ccD2798323232B2dD027B3aBcA5C00091',
            decimals: 18,
            label: 'DAI',
          },
          amount: 100,
          errors: {},
          isLoading: { approve: false, transfer: false },
          transactionHash: '0x',
        },
      });

      const transferButton = screen.getByRole('button', { name: /transfer/i });
      fireEvent.click(transferButton);

      await vi.waitFor(() => {
        // The mock returns 1 token balance, so transferring 100 fails the balance check
        expect(store.getState().dex.errors['amount']).toBe(
          'Insufficient DAI balance.'
        );
      });
    });
  });

  describe('error display', () => {
    it('should display destination address error', () => {
      renderDexContainer({
        dex: {
          destinationAddress: '',
          token: { address: '0x', decimals: 0, label: '' },
          amount: undefined,
          errors: { destinationAddress: 'Invalid address' },
          isLoading: { approve: false, transfer: false },
          transactionHash: '0x',
        },
      });

      expect(screen.getByText('Invalid address')).toBeInTheDocument();
    });

    it('should display amount error', () => {
      renderDexContainer({
        dex: {
          destinationAddress: '',
          token: { address: '0x', decimals: 0, label: '' },
          amount: undefined,
          errors: { amount: 'Amount must be greater than zero' },
          isLoading: { approve: false, transfer: false },
          transactionHash: '0x',
        },
      });

      expect(
        screen.getByText('Amount must be greater than zero')
      ).toBeInTheDocument();
    });
  });

  describe('loading states', () => {
    it('should show loading state on approve button when approving', () => {
      renderDexContainer({
        dex: {
          destinationAddress: '',
          token: { address: '0x', decimals: 0, label: '' },
          amount: undefined,
          errors: {},
          isLoading: { approve: true, transfer: false },
          transactionHash: '0x',
        },
      });

      const approveButton = screen.getByRole('button', { name: /approve/i });
      expect(approveButton).toHaveAttribute('data-loading', 'true');
    });

    it('should show loading state on transfer button when transferring', () => {
      renderDexContainer({
        dex: {
          destinationAddress: '',
          token: { address: '0x', decimals: 0, label: '' },
          amount: undefined,
          errors: {},
          isLoading: { approve: false, transfer: true },
          transactionHash: '0x',
        },
      });

      const transferButton = screen.getByRole('button', { name: /transfer/i });
      expect(transferButton).toHaveAttribute('data-loading', 'true');
    });
  });

  describe('button disabled states', () => {
    it('should disable buttons when no token is selected (invalid address)', () => {
      renderDexContainer({
        dex: {
          destinationAddress: '',
          token: { address: '0x', decimals: 0, label: '' },
          amount: undefined,
          errors: {},
          isLoading: { approve: false, transfer: false },
          transactionHash: '0x',
        },
      });

      // Buttons are disabled when token address is not a valid address (isAddress('0x') is false)
      expect(screen.getByRole('button', { name: /mint/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /approve/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /transfer/i })).toBeDisabled();
    });

    it('should enable buttons when token is selected and wallet is connected', () => {
      // With default mocks: useAccount returns address + chainId=1, useChainId returns 1
      renderDexContainer({
        dex: {
          destinationAddress: '',
          token: {
            address: '0x1D70D57ccD2798323232B2dD027B3aBcA5C00091',
            decimals: 18,
            label: 'DAI',
          },
          amount: undefined,
          errors: {},
          isLoading: { approve: false, transfer: false },
          transactionHash: '0x',
        },
      });

      expect(screen.getByRole('button', { name: /mint/i })).not.toBeDisabled();
      expect(screen.getByRole('button', { name: /approve/i })).not.toBeDisabled();
      expect(screen.getByRole('button', { name: /transfer/i })).not.toBeDisabled();
    });
  });
});
