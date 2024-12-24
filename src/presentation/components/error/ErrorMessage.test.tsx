import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage Component', () => {
  afterEach(cleanup);

  it('Should return null when the error message is undefined.', () => {
    const { container } = render(<ErrorMessage error={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('Should return null when the error message is an empty string.', () => {
    const { container } = render(<ErrorMessage error="" />);
    expect(container.firstChild).toBeNull();
  });

  it('Should render the error message when a message is not empty.', () => {
    const errorMessage = 'This is an error message.';
    render(<ErrorMessage error={errorMessage} />);
    screen.getByText(errorMessage);
  });
});
