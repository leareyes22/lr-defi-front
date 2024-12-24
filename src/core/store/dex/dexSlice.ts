import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Address } from 'viem';
import { Error, Loading, Token } from '../../../interfaces';

interface DexState {
  destinationAddress: string;
  token: Token;
  amount: number | undefined;
  errors: { [key: string]: string };
  isLoading: { [key: string]: boolean };
  transactionHash: Address;
}

const initialState: DexState = {
  destinationAddress: '',
  token: {
    address: '0x',
    decimals: 0,
    label: '',
  },
  amount: undefined,
  errors: {},
  isLoading: {
    approve: false,
    transfer: false,
  },
  transactionHash: '0x',
};

const dexSlice = createSlice({
  name: 'dex',
  initialState,
  reducers: {
    setDestinationAddress(state, action: PayloadAction<string>) {
      state.destinationAddress = action.payload;
    },

    setToken(state, action: PayloadAction<Token>) {
      state.token = action.payload;
    },

    setAmount(state, action: PayloadAction<number>) {
      if (action.payload < 0) return; // Prevent negative amounts

      state.amount = action.payload;
    },

    setError(state, action: PayloadAction<Error>) {
      const error = action.payload;
      const { field, message } = error;

      state.errors[field] = message;
    },

    clearError(state, action: PayloadAction<string>) {
      if (!action.payload) return;

      const field = action.payload;

      delete state.errors[field];
    },

    setIsLoading(state, action: PayloadAction<Loading>) {
      const loading = action.payload;
      const { method, isLoading } = loading;

      state.isLoading[method] = isLoading;
    },

    setTransactionHash(state, action: PayloadAction<Address>) {
      state.transactionHash = action.payload;
    },

    resetState(state) {
      state.amount = initialState.amount;
      state.destinationAddress = initialState.destinationAddress;
      state.errors = initialState.errors;
      state.isLoading = initialState.isLoading;
    },
  },
});

export const {
  clearError,
  setDestinationAddress,
  setAmount,
  setError,
  setIsLoading,
  setToken,
  setTransactionHash,
  resetState,
} = dexSlice.actions;

export default dexSlice.reducer;
