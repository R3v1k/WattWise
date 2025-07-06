// src/pages/__tests__/Devices.test.js
import { screen } from '@testing-library/react';
import Devices from '../Devices';
import { renderWithRouter } from './testUtils';

test('renders Rooms header and new-room button', () => {
  renderWithRouter(<Devices />);
  expect(screen.getByRole('heading', { name: /your rooms/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /\+ new room/i })).toBeInTheDocument();
});
