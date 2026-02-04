import { describe, it, expect } from 'vitest';
import { isAddress } from 'viem';
import { AssetOptions } from './DexUtils';

describe('DexUtils', () => {
  describe('AssetOptions', () => {
    it('should be a non-empty array', () => {
      expect(Array.isArray(AssetOptions)).toBe(true);
      expect(AssetOptions.length).toBeGreaterThan(0);
    });

    it('should contain DAI token', () => {
      const dai = AssetOptions.find((token) => token.label === 'DAI');
      expect(dai).toBeDefined();
      expect(dai?.decimals).toBe(18);
    });

    it('should contain USDC token', () => {
      const usdc = AssetOptions.find((token) => token.label === 'USDC');
      expect(usdc).toBeDefined();
      expect(usdc?.decimals).toBe(6);
    });

    describe('token structure validation', () => {
      it.each(AssetOptions)(
        'token "$label" should have a valid address format',
        (token) => {
          expect(isAddress(token.address)).toBe(true);
        }
      );

      it.each(AssetOptions)(
        'token "$label" should have a positive decimals value',
        (token) => {
          expect(token.decimals).toBeGreaterThan(0);
          expect(Number.isInteger(token.decimals)).toBe(true);
        }
      );

      it.each(AssetOptions)(
        'token "$label" should have a non-empty label',
        (token) => {
          expect(token.label).toBeTruthy();
          expect(typeof token.label).toBe('string');
          expect(token.label.length).toBeGreaterThan(0);
        }
      );
    });

    it('should have unique addresses', () => {
      const addresses = AssetOptions.map((token) => token.address);
      const uniqueAddresses = new Set(addresses);
      expect(uniqueAddresses.size).toBe(addresses.length);
    });

    it('should have unique labels', () => {
      const labels = AssetOptions.map((token) => token.label);
      const uniqueLabels = new Set(labels);
      expect(uniqueLabels.size).toBe(labels.length);
    });

    it('should have addresses that are checksummed or lowercase', () => {
      AssetOptions.forEach((token) => {
        expect(token.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
      });
    });
  });
});
