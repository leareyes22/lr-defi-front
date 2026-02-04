import { describe, it, expect } from 'vitest';
import dexReducer, {
  clearError,
  resetState,
  setAmount,
  setDestinationAddress,
  setError,
  setIsLoading,
  setToken,
  setTransactionHash,
} from './dexSlice';

describe('dexSlice reducer', () => {
  const initialState = {
    destinationAddress: '',
    token: {
      address: '0x' as const,
      decimals: 0,
      label: '',
    },
    amount: undefined,
    errors: {},
    isLoading: {
      approve: false,
      transfer: false,
    },
    transactionHash: '0x' as const,
  };

  describe('initial state', () => {
    it('should return the initial state when passed an empty action', () => {
      const result = dexReducer(undefined, { type: '' });
      expect(result).toEqual(initialState);
    });
  });

  describe('setDestinationAddress', () => {
    it('should update the destination address', () => {
      const address = '0x1234567890123456789012345678901234567890';
      const result = dexReducer(initialState, setDestinationAddress(address));
      expect(result.destinationAddress).toBe(address);
    });

    it('should handle empty string', () => {
      const stateWithAddress = {
        ...initialState,
        destinationAddress: '0x1234',
      };
      const result = dexReducer(stateWithAddress, setDestinationAddress(''));
      expect(result.destinationAddress).toBe('');
    });
  });

  describe('setToken', () => {
    it('should update the token with all properties', () => {
      const token = {
        address: '0xC891481A0AaC630F4D89744ccD2C7D2C4215FD47' as const,
        decimals: 6,
        label: 'USDC',
      };
      const result = dexReducer(initialState, setToken(token));
      expect(result.token).toEqual(token);
    });

    it('should overwrite existing token', () => {
      const stateWithToken = {
        ...initialState,
        token: {
          address: '0x1234' as const,
          decimals: 18,
          label: 'OLD',
        },
      };
      const newToken = {
        address: '0x5678' as const,
        decimals: 6,
        label: 'NEW',
      };
      const result = dexReducer(stateWithToken, setToken(newToken));
      expect(result.token).toEqual(newToken);
    });
  });

  describe('setAmount', () => {
    it('should update the amount with a positive number', () => {
      const result = dexReducer(initialState, setAmount(100));
      expect(result.amount).toBe(100);
    });

    it('should allow zero as a valid amount', () => {
      const result = dexReducer(initialState, setAmount(0));
      expect(result.amount).toBe(0);
    });

    it('should prevent negative amounts', () => {
      const result = dexReducer(initialState, setAmount(-10));
      expect(result.amount).toBeUndefined();
    });

    it('should prevent negative amounts when state already has an amount', () => {
      const stateWithAmount = { ...initialState, amount: 50 };
      const result = dexReducer(stateWithAmount, setAmount(-10));
      expect(result.amount).toBe(50);
    });

    it('should handle decimal amounts', () => {
      const result = dexReducer(initialState, setAmount(0.5));
      expect(result.amount).toBe(0.5);
    });
  });

  describe('setError', () => {
    it('should add an error for a field', () => {
      const result = dexReducer(
        initialState,
        setError({ field: 'amount', message: 'Amount is required' })
      );
      expect(result.errors['amount']).toBe('Amount is required');
    });

    it('should overwrite existing error for the same field', () => {
      const stateWithError = {
        ...initialState,
        errors: { amount: 'Old error' },
      };
      const result = dexReducer(
        stateWithError,
        setError({ field: 'amount', message: 'New error' })
      );
      expect(result.errors['amount']).toBe('New error');
    });

    it('should allow multiple errors for different fields', () => {
      let state = dexReducer(
        initialState,
        setError({ field: 'amount', message: 'Amount error' })
      );
      state = dexReducer(
        state,
        setError({ field: 'destinationAddress', message: 'Address error' })
      );
      expect(state.errors).toEqual({
        amount: 'Amount error',
        destinationAddress: 'Address error',
      });
    });
  });

  describe('clearError', () => {
    it('should remove an error for a field', () => {
      const stateWithError = {
        ...initialState,
        errors: { amount: 'Amount error' },
      };
      const result = dexReducer(stateWithError, clearError('amount'));
      expect(result.errors['amount']).toBeUndefined();
    });

    it('should not modify state when clearing non-existent error', () => {
      const result = dexReducer(initialState, clearError('amount'));
      expect(result.errors).toEqual({});
    });

    it('should return early when field is empty string', () => {
      const stateWithError = {
        ...initialState,
        errors: { amount: 'Amount error' },
      };
      const result = dexReducer(stateWithError, clearError(''));
      expect(result.errors['amount']).toBe('Amount error');
    });

    it('should only remove the specified error, keeping others', () => {
      const stateWithErrors = {
        ...initialState,
        errors: {
          amount: 'Amount error',
          destinationAddress: 'Address error',
        },
      };
      const result = dexReducer(stateWithErrors, clearError('amount'));
      expect(result.errors).toEqual({ destinationAddress: 'Address error' });
    });
  });

  describe('setIsLoading', () => {
    it('should set approve loading to true', () => {
      const result = dexReducer(
        initialState,
        setIsLoading({ method: 'approve', isLoading: true })
      );
      expect(result.isLoading['approve']).toBe(true);
    });

    it('should set transfer loading to true', () => {
      const result = dexReducer(
        initialState,
        setIsLoading({ method: 'transfer', isLoading: true })
      );
      expect(result.isLoading['transfer']).toBe(true);
    });

    it('should set loading back to false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: { approve: true, transfer: false },
      };
      const result = dexReducer(
        stateWithLoading,
        setIsLoading({ method: 'approve', isLoading: false })
      );
      expect(result.isLoading['approve']).toBe(false);
    });

    it('should handle custom method names', () => {
      const result = dexReducer(
        initialState,
        setIsLoading({ method: 'mint', isLoading: true })
      );
      expect(result.isLoading['mint']).toBe(true);
    });
  });

  describe('setTransactionHash', () => {
    it('should update the transaction hash', () => {
      const hash = '0xabc123def456789012345678901234567890123456789012345678901234567890' as const;
      const result = dexReducer(initialState, setTransactionHash(hash));
      expect(result.transactionHash).toBe(hash);
    });
  });

  describe('resetState', () => {
    it('should reset amount to initial state', () => {
      const modifiedState = {
        ...initialState,
        amount: 100,
      };
      const result = dexReducer(modifiedState, resetState());
      expect(result.amount).toBeUndefined();
    });

    it('should reset destinationAddress to initial state', () => {
      const modifiedState = {
        ...initialState,
        destinationAddress: '0x1234',
      };
      const result = dexReducer(modifiedState, resetState());
      expect(result.destinationAddress).toBe('');
    });

    it('should reset errors to initial state', () => {
      const modifiedState = {
        ...initialState,
        errors: { amount: 'Error' },
      };
      const result = dexReducer(modifiedState, resetState());
      expect(result.errors).toEqual({});
    });

    it('should reset isLoading to initial state', () => {
      const modifiedState = {
        ...initialState,
        isLoading: { approve: true, transfer: true },
      };
      const result = dexReducer(modifiedState, resetState());
      expect(result.isLoading).toEqual({ approve: false, transfer: false });
    });

    it('should NOT reset token (preserves selected token)', () => {
      const selectedToken = {
        address: '0xC891481A0AaC630F4D89744ccD2C7D2C4215FD47' as const,
        decimals: 6,
        label: 'USDC',
      };
      const modifiedState = {
        ...initialState,
        token: selectedToken,
        amount: 100,
      };
      const result = dexReducer(modifiedState, resetState());
      expect(result.token).toEqual(selectedToken);
    });

    it('should NOT reset transactionHash', () => {
      const hash = '0xabc123' as const;
      const modifiedState = {
        ...initialState,
        transactionHash: hash,
      };
      const result = dexReducer(modifiedState, resetState());
      expect(result.transactionHash).toBe(hash);
    });
  });
});
