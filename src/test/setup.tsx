import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Mock uuid to return deterministic values in tests
vi.mock('uuid', () => ({
  v7: vi.fn(() => 'mock-uuid'),
}));

// Mock @rainbow-me/rainbowkit
vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: () => <div data-testid="connect-button">Connect Wallet</div>,
  useAddRecentTransaction: () => vi.fn(),
  getDefaultConfig: vi.fn(() => ({})),
}));

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useAccount: vi.fn(() => ({
    address: '0x1234567890123456789012345678901234567890',
    chainId: 1,
  })),
  useChainId: vi.fn(() => 1),
  useReadContract: vi.fn(() => ({
    data: undefined,
  })),
  useWaitForTransactionReceipt: vi.fn(() => ({
    isLoading: false,
  })),
  useWriteContract: vi.fn(() => ({
    writeContractAsync: vi.fn(),
  })),
}));
