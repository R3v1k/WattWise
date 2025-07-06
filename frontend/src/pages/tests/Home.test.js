// src/pages/__tests__/Home.test.js
import { screen } from '@testing-library/react';
import Home from '../Home';
import { renderWithRouter } from './testUtils';

test('landing shows heading and link to /auth', () => {
  renderWithRouter(<Home />);

  expect(
    screen.getByRole('heading', { name: /tired of wasting money & energy\?/i })
  ).toBeInTheDocument();

  const cta = screen.getByRole('link', { name: /get started/i });
  expect(cta).toHaveAttribute('href', '/auth');
});
