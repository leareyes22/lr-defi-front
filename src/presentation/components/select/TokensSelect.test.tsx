import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { TokensSelect } from './TokensSelect';
import { Token } from '../../../interfaces';

// Mock Material Tailwind components
vi.mock('@material-tailwind/react', () => ({
  Select: ({
    label,
    value,
    onChange,
    children,
  }: {
    label: string;
    value: string;
    onChange: (value?: string) => void;
    children: React.ReactNode;
  }) => (
    <div data-testid="select-wrapper">
      <label>{label}</label>
      <select
        data-testid="select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
    </div>
  ),
  Option: ({
    value,
    children,
  }: {
    value: string;
    children: React.ReactNode;
  }) => <option value={value}>{children}</option>,
}));

describe('TokensSelect Component', () => {
  afterEach(cleanup);

  const mockOptions: Token[] = [
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
  ];

  it('should render with a label', () => {
    render(
      <TokensSelect
        label="Select Token"
        value=""
        onChange={() => {}}
        options={mockOptions}
      />
    );
    expect(screen.getByText('Select Token')).toBeInTheDocument();
  });

  it('should render all options', () => {
    render(
      <TokensSelect
        label="Select Token"
        value=""
        onChange={() => {}}
        options={mockOptions}
      />
    );
    expect(screen.getByText('DAI')).toBeInTheDocument();
    expect(screen.getByText('USDC')).toBeInTheDocument();
  });

  it('should call onChange when an option is selected', () => {
    const handleChange = vi.fn();
    render(
      <TokensSelect
        label="Select Token"
        value=""
        onChange={handleChange}
        options={mockOptions}
      />
    );

    const select = screen.getByTestId('select');
    fireEvent.change(select, {
      target: { value: '0xC891481A0AaC630F4D89744ccD2C7D2C4215FD47' },
    });

    expect(handleChange).toHaveBeenCalledWith(
      '0xC891481A0AaC630F4D89744ccD2C7D2C4215FD47'
    );
  });

  it('should render with the correct value selected', () => {
    render(
      <TokensSelect
        label="Select Token"
        value="0x1D70D57ccD2798323232B2dD027B3aBcA5C00091"
        onChange={() => {}}
        options={mockOptions}
      />
    );

    const select = screen.getByTestId('select') as HTMLSelectElement;
    expect(select.value).toBe('0x1D70D57ccD2798323232B2dD027B3aBcA5C00091');
  });

  it('should render nothing when options array is empty', () => {
    render(
      <TokensSelect label="Select Token" value="" onChange={() => {}} options={[]} />
    );

    const select = screen.getByTestId('select');
    expect(select.children.length).toBe(0);
  });

  it('should use default empty array when options prop is not provided', () => {
    render(<TokensSelect label="Select Token" value="" onChange={() => {}} />);

    const select = screen.getByTestId('select');
    expect(select.children.length).toBe(0);
  });

  it('should render options with address as the value attribute', () => {
    render(
      <TokensSelect
        label="Select Token"
        value=""
        onChange={() => {}}
        options={mockOptions}
      />
    );

    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute(
      'value',
      '0x1D70D57ccD2798323232B2dD027B3aBcA5C00091'
    );
    expect(options[1]).toHaveAttribute(
      'value',
      '0xC891481A0AaC630F4D89744ccD2C7D2C4215FD47'
    );
  });

  it('should display token labels as option text', () => {
    render(
      <TokensSelect
        label="Select Token"
        value=""
        onChange={() => {}}
        options={mockOptions}
      />
    );

    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveTextContent('DAI');
    expect(options[1]).toHaveTextContent('USDC');
  });
});
