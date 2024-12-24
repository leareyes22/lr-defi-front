import { Loader } from './Loader';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

describe('Loader test:', () => {
  afterEach(cleanup);

  it('Should return null when txIsLoading is false.', () => {
    const { container } = render(<Loader txIsLoading={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('Should render the loading spinner when txIsLoading is true.', () => {
    render(<Loader txIsLoading={true} />);
    screen.getByText('Transaction in progress...');
  });
});
