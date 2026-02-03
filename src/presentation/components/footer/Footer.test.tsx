import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Footer } from './Footer';

describe('Footer Component', () => {
  afterEach(cleanup);

  it('Should render a footer element with the correct className.', () => {
    const { getByRole } = render(<Footer />);
    const element = getByRole('contentinfo');
    expect(element.className).toEqual(
      'bg-teal-800 bg-opacity-30 p-2 m-2 rounded flex justify-center items-center'
    );
  });

  it('Should render a link to the Github repository', () => {
    const { getByRole } = render(<Footer />);
    const url = getByRole('link').getAttribute('href');
    expect(url).toEqual('https://github.com/leareyes22');
  });
});
