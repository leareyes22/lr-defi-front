import { Address } from 'viem';

export interface Token {
  address: Address;
  decimals: number;
  label: string;
}
