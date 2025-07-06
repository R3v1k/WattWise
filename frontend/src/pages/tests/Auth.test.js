// src/pages/__tests__/Auth.test.js
import { screen } from '@testing-library/react';
import Auth from '../Auth';
import { renderWithRouter } from './testUtils';

it('shows Login & Register buttons', () => {
  renderWithRouter(<Auth />);
  expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
});
