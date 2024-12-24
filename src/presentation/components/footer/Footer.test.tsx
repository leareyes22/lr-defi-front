import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Footer } from './Footer';

describe('Footer Component', () => {
  afterEach(cleanup);

  it('Should render a footer element with the correct className.', () => {
    render(<Footer />);
    const element = screen.getByRole('contentinfo');
    expect(element.className).toEqual(
      'bg-teal-800 bg-opacity-30 p-2 m-2 rounded flex justify-center items-center'
    );
  });

  it('Should render a link to the Github repository', () => {
    render(<Footer />);
    const url = screen.getByRole('link').getAttribute('href');
    expect(url).toEqual('https://github.com/leareyes22');
  });
});
